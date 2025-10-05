/**
 * Content Script
 *
 * Executes in page context to:
 * - Receive agent execution requests from service worker
 * - Load WASM from IndexedDB
 * - Instantiate and execute agents with restricted APIs
 * - Return results to service worker
 */

import { agentStorage } from '../lib/agent-storage.js';
import { cryptoVerifier } from '../lib/crypto-verify.js';
import { WasmExecutor, PyodideExecutor } from '../lib/wasm-executor.js';

// Content script state
const state = {
  executors: new Map(),
  pyodideLoaded: false,
  pyodideLoadPromise: null
};

console.log('[ContentScript] Content script loaded');

/**
 * Initialize content script
 */
async function initialize() {
  try {
    await agentStorage.init();
    await cryptoVerifier.init();

    console.log('[ContentScript] Initialized');
  } catch (error) {
    console.error('[ContentScript] Initialization failed:', error);
  }
}

// Initialize when script loads
initialize();

/**
 * Message handler from service worker
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ContentScript] Received message:', message.type);

  handleMessage(message)
    .then(sendResponse)
    .catch(error => {
      console.error('[ContentScript] Message handler error:', error);
      sendResponse({ success: false, error: error.message });
    });

  // Return true for async response
  return true;
});

/**
 * Handle incoming messages
 */
async function handleMessage(message) {
  switch (message.type) {
    case 'executeAgent':
      return await executeAgent(message.agentId, message.args);

    case 'ping':
      return { success: true, message: 'pong' };

    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

/**
 * Execute agent
 */
async function executeAgent(agentId, args = []) {
  try {
    console.log(`[ContentScript] Executing agent: ${agentId}`);

    // Request agent data from service worker (agents stored in service worker's IndexedDB)
    const agentInfo = await chrome.runtime.sendMessage({
      type: 'getAgentInfo',
      agentId
    });

    if (!agentInfo.success) {
      throw new Error(agentInfo.error || 'Failed to get agent info');
    }

    const profile = agentInfo.profile;
    const wasmBytes = agentInfo.wasm;

    if (!profile) {
      throw new Error(`Agent profile not found: ${agentId}`);
    }

    if (!wasmBytes) {
      throw new Error(`Agent WASM not found: ${agentId}`);
    }

    // Note: Agent verification happens during installation in service worker
    // Content script trusts agents from service worker (already verified)

    // Check permission grants (also from service worker)
    const userGrants = agentInfo.userGrants || {};

    // If no grants exist, request permissions
    if (Object.keys(userGrants).length === 0) {
      const granted = await requestPermissions(profile);
      if (!granted) {
        throw new Error('User denied permissions');
      }
    }

    // Create executor
    let executor;

    if (profile.runtime === 'pyodide' || agentId.includes('pyodide') || agentId.includes('network-test')) {
      // Use sandboxed iframe for Pyodide execution
      const mediator = new PermissionMediator(profile, userGrants);
      const code = args[0] || profile.defaultCode || "print('Hello from Pyodide!')";

      const result = await executePyodideInSandbox(code, agentId, profile.name, mediator);

      return {
        success: true,
        result,
        denialLog: mediator.getDenialLog()
      };
    } else {
      // Standard WASM executor
      executor = new WasmExecutor(profile, userGrants);
      await executor.loadModule(wasmBytes);

      const functionName = profile.entrypoint || 'main';
      const result = await executor.execute(functionName, args);

      return {
        success: true,
        result,
        denialLog: executor.getDenialLog()
      };
    }
  } catch (error) {
    console.error(`[ContentScript] Agent execution failed:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute Python code in sandboxed iframe
 */
async function executePyodideInSandbox(code, agentId, agentName, mediator) {
  return new Promise((resolve, reject) => {
    // Create sandboxed iframe
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('sandbox/pyodide-sandbox.html');
    iframe.sandbox = 'allow-scripts';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const timeout = setTimeout(() => {
      iframe.remove();
      reject(new Error('Pyodide execution timeout'));
    }, 60000);

    // Create restricted API for sandbox (needs to be in outer scope)
    const restrictedAPI = mediator.createRestrictedAPI();

    const messageHandler = async (event) => {
      if (event.source !== iframe.contentWindow) return;

      if (event.data.type === 'pyodide-ready') {
        const apiForSandbox = {};
        for (const key in restrictedAPI) {
          apiForSandbox[key] = true; // Mark as available for proxying
        }

        // Send code to sandbox
        iframe.contentWindow.postMessage({
          type: 'execute-python',
          code,
          agentId,
          agentName,
          restrictedAPI: apiForSandbox
        }, '*');
      } else if (event.data.type === 'api-call') {
        // Handle API call from sandbox
        const { callId, method, args } = event.data;
        const fn = restrictedAPI[method];

        if (typeof fn === 'function') {
          try {
            const result = await fn(...args);
            iframe.contentWindow.postMessage({
              type: 'api-response',
              callId,
              result
            }, '*');
          } catch (error) {
            iframe.contentWindow.postMessage({
              type: 'api-response',
              callId,
              error: error.message
            }, '*');
          }
        }
      } else if (event.data.type === 'execution-result') {
        clearTimeout(timeout);
        window.removeEventListener('message', messageHandler);
        iframe.remove();

        if (event.data.success) {
          resolve(event.data.result);
        } else {
          reject(new Error(event.data.error));
        }
      }
    };

    window.addEventListener('message', messageHandler);
  });
}

/**
 * Load Pyodide runtime (deprecated - use sandbox instead)
 */
async function loadPyodide() {
  if (state.pyodideLoaded) return;

  if (state.pyodideLoadPromise) {
    return state.pyodideLoadPromise;
  }

  state.pyodideLoadPromise = (async () => {
    try {
      console.log('[ContentScript] Loading Pyodide...');

      // Inject Pyodide loader script
      await injectScript('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');

      // Wait for loadPyodide to be available
      await waitForGlobal('loadPyodide', 10000);

      state.pyodideLoaded = true;
      console.log('[ContentScript] Pyodide loaded successfully');
    } catch (error) {
      console.error('[ContentScript] Failed to load Pyodide:', error);
      throw error;
    }
  })();

  return state.pyodideLoadPromise;
}

/**
 * Inject script into page
 */
function injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    (document.head || document.documentElement).appendChild(script);
  });
}

/**
 * Wait for global variable to be available
 */
function waitForGlobal(name, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (window[name]) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for global: ${name}`));
      } else {
        setTimeout(check, 100);
      }
    };

    check();
  });
}

/**
 * Request permissions from user
 */
async function requestPermissions(profile) {
  try {
    // Show permission dialog
    const granted = await showPermissionDialog(profile);

    if (granted) {
      // Store grants
      const grants = {};
      profile.permissions.required.forEach(p => grants[p] = true);

      if (profile.permissions.optional) {
        profile.permissions.optional.forEach(p => grants[p] = true);
      }

      await agentStorage.storeUserGrants(profile.agentId, grants);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[ContentScript] Permission request failed:', error);
    return false;
  }
}

/**
 * Show permission dialog
 */
async function showPermissionDialog(profile) {
  // Create simple permission dialog
  const dialog = document.createElement('div');
  dialog.id = 'mcp-permission-dialog';
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    z-index: 999999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  dialog.innerHTML = `
    <h3 style="margin: 0 0 16px 0; font-size: 18px;">
      Permission Request
    </h3>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #666;">
      <strong>${profile.name}</strong> requests the following permissions:
    </p>
    <ul style="margin: 0 0 24px 0; padding-left: 24px; font-size: 14px;">
      ${profile.permissions.required.map(p => `<li>${p}</li>`).join('')}
      ${profile.permissions.optional ? profile.permissions.optional.map(p => `<li>${p} (optional)</li>`).join('') : ''}
    </ul>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="mcp-deny" style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
        Deny
      </button>
      <button id="mcp-allow" style="padding: 8px 16px; border: none; border-radius: 4px; background: #0066cc; color: white; cursor: pointer;">
        Allow
      </button>
    </div>
  `;

  document.body.appendChild(dialog);

  return new Promise((resolve) => {
    dialog.querySelector('#mcp-allow').onclick = () => {
      dialog.remove();
      resolve(true);
    };

    dialog.querySelector('#mcp-deny').onclick = () => {
      dialog.remove();
      resolve(false);
    };
  });
}

console.log('[ContentScript] Ready');
