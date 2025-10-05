/**
 * Service Worker (Background Script)
 *
 * Persistent background process responsible for:
 * - Agent registry management
 * - Communication hub between console and content scripts
 * - Version checking and updates
 * - Periodic tasks
 */

import { agentStorage } from '../lib/agent-storage.js';
import { cryptoVerifier } from '../lib/crypto-verify.js';

// Extension state
const state = {
  installedAgents: new Map(),
  activeExecutions: new Map(),
  updateCheckInterval: null
};

// Initialize on install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[ServiceWorker] Extension installed:', details.reason);

  if (details.reason === 'install') {
    await initializeExtension();
  } else if (details.reason === 'update') {
    await handleExtensionUpdate(details.previousVersion);
  }
});

// Initialize on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('[ServiceWorker] Extension started');
  await initializeExtension();
});

/**
 * Initialize extension
 */
async function initializeExtension() {
  try {
    // Initialize storage
    await agentStorage.init();

    // Initialize crypto verifier
    await cryptoVerifier.init();

    // Load installed agents
    await loadInstalledAgents();

    // Start periodic update checks
    startUpdateChecks();

    console.log('[ServiceWorker] Initialization complete');
  } catch (error) {
    console.error('[ServiceWorker] Initialization failed:', error);
  }
}

/**
 * Load installed agents from storage
 */
async function loadInstalledAgents() {
  try {
    const agents = await agentStorage.listAgents();

    state.installedAgents.clear();

    for (const agent of agents) {
      state.installedAgents.set(agent.agentId, agent);
    }

    console.log(`[ServiceWorker] Loaded ${agents.length} installed agents`);
  } catch (error) {
    console.error('[ServiceWorker] Failed to load agents:', error);
  }
}

/**
 * Handle extension update
 */
async function handleExtensionUpdate(previousVersion) {
  console.log(`[ServiceWorker] Updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);

  // Perform any migration tasks
  // TODO: Add migration logic if needed
}

/**
 * Start periodic update checks
 */
function startUpdateChecks() {
  // Check for updates every 6 hours
  const CHECK_INTERVAL = 6 * 60 * 60 * 1000;

  if (state.updateCheckInterval) {
    clearInterval(state.updateCheckInterval);
  }

  state.updateCheckInterval = setInterval(async () => {
    await checkForUpdates();
  }, CHECK_INTERVAL);

  // Initial check
  checkForUpdates();
}

/**
 * Check for agent and extension updates
 */
async function checkForUpdates() {
  try {
    console.log('[ServiceWorker] Checking for updates...');

    // Check extension update
    chrome.runtime.requestUpdateCheck((status) => {
      if (status === 'update_available') {
        console.log('[ServiceWorker] Extension update available');
      } else if (status === 'no_update') {
        console.log('[ServiceWorker] Extension is up to date');
      }
    });

    // TODO: Check for agent updates from backend API

  } catch (error) {
    console.error('[ServiceWorker] Update check failed:', error);
  }
}

/**
 * Message handler for content scripts and console
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ServiceWorker] Received message:', message.type);

  handleMessage(message, sender)
    .then(sendResponse)
    .catch(error => {
      console.error('[ServiceWorker] Message handler error:', error);
      sendResponse({ success: false, error: error.message });
    });

  // Return true to indicate async response
  return true;
});

/**
 * Handle incoming messages
 */
async function handleMessage(message, sender) {
  switch (message.type) {
    case 'installAgent':
      return await handleInstallAgent(message);

    case 'uninstallAgent':
      return await handleUninstallAgent(message);

    case 'executeAgent':
      return await handleExecuteAgent(message, sender);

    case 'listAgents':
      return await handleListAgents();

    case 'network-fetch':
      return await handleNetworkFetch(message);

    case 'getAgentInfo':
      return await handleGetAgentInfo(message);

    case 'grantPermissions':
      return await handleGrantPermissions(message);

    case 'revokePermissions':
      return await handleRevokePermissions(message);

    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

/**
 * Install agent from web console or backend
 */
async function handleInstallAgent(message) {
  const { agentId, profileUrl, wasmUrl } = message;

  try {
    console.log(`[ServiceWorker] Installing agent: ${agentId}`);

    // Fetch profile
    const profileResponse = await fetch(profileUrl);
    const data = await profileResponse.json();
    const profile = data.agent || data; // Extract .agent if present

    // Fetch WASM binary
    const wasmResponse = await fetch(wasmUrl);
    const wasmBytes = await wasmResponse.arrayBuffer();

    // Verify integrity
    const verification = await cryptoVerifier.verifyAgent(wasmBytes, profile);
    if (!verification.valid) {
      throw new Error(`Agent verification failed: ${verification.reason}`);
    }

    // Store agent
    console.log('[ServiceWorker] Storing profile:', profile.agentId, profile.name);
    await agentStorage.storeAgent(agentId, wasmBytes);
    await agentStorage.storeProfile(profile);
    await agentStorage.storeMetadata(agentId, {
      installedAt: Date.now(),
      lastUsed: null,
      executionCount: 0
    });

    // Grant default permissions
    const grants = {};
    if (profile.permissions && profile.permissions.required) {
      profile.permissions.required.forEach(p => grants[p] = true);
    }
    console.log('[ServiceWorker] Granting permissions:', grants);
    await agentStorage.storeUserGrants(agentId, grants);

    // Verify it was stored
    const storedProfile = await agentStorage.getProfile(agentId);
    console.log('[ServiceWorker] Verified stored profile:', storedProfile ? storedProfile.agentId : 'NOT FOUND');

    // Update state
    state.installedAgents.set(agentId, profile);

    console.log(`[ServiceWorker] Agent installed successfully: ${agentId}`);

    return {
      success: true,
      agentId,
      profile
    };
  } catch (error) {
    console.error(`[ServiceWorker] Failed to install agent:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Uninstall agent
 */
async function handleUninstallAgent(message) {
  const { agentId } = message;

  try {
    console.log(`[ServiceWorker] Uninstalling agent: ${agentId}`);

    await agentStorage.deleteAgent(agentId);
    state.installedAgents.delete(agentId);

    return { success: true };
  } catch (error) {
    console.error(`[ServiceWorker] Failed to uninstall agent:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute agent in content script
 */
async function handleExecuteAgent(message, sender) {
  const { agentId, args } = message;

  try {
    console.log(`[ServiceWorker] Executing agent: ${agentId}`);

    // Check if agent is installed
    if (!state.installedAgents.has(agentId)) {
      throw new Error(`Agent not installed: ${agentId}`);
    }

    // Get tab ID
    const tabId = sender.tab ? sender.tab.id : (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id;

    // Send execution request to content script
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'executeAgent',
      agentId,
      args
    });

    // Update metadata
    await agentStorage.updateLastUsed(agentId);

    return response;
  } catch (error) {
    console.error(`[ServiceWorker] Failed to execute agent:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List installed agents
 */
async function handleListAgents() {
  try {
    const agents = await agentStorage.listAgents();

    return {
      success: true,
      agents
    };
  } catch (error) {
    console.error(`[ServiceWorker] Failed to list agents:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Handle network fetch (proxied through service worker to avoid CORS issues)
 *
 * DEFAULT DENY ALL - Validates request against agent profile before allowing
 *
 * Content scripts are CORS-restricted even with host_permissions.
 * Only service workers can make unrestricted cross-origin requests.
 *
 * Security: This validates the request matches the agent's profile ACLs
 * as a second layer of defense (content script already checked, but we verify again)
 */
async function handleNetworkFetch(message) {
  try {
    const { url, options, agentId } = message;

    // DEFAULT DENY - agentId is required
    if (!agentId) {
      console.error('[ServiceWorker] Network fetch denied: no agentId provided');
      return {
        success: false,
        error: 'Permission denied: agentId required'
      };
    }

    // Get agent profile to validate permissions
    const profile = await agentStorage.getProfile(agentId);
    if (!profile) {
      console.error(`[ServiceWorker] Network fetch denied: agent ${agentId} not found`);
      return {
        success: false,
        error: 'Permission denied: agent not found'
      };
    }

    // Validate networkAccess capability
    if (!profile.capabilities.networkAccess) {
      console.warn(`[ServiceWorker] Network fetch denied for ${agentId}: networkAccess disabled`);
      return {
        success: false,
        error: 'Permission denied: networkAccess disabled'
      };
    }

    // Validate allowedHosts ACL if specified
    if (profile.capabilities.allowedHosts && profile.capabilities.allowedHosts.length > 0) {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      const allowed = profile.capabilities.allowedHosts.some(allowedHost => {
        return hostname === allowedHost || hostname.endsWith('.' + allowedHost);
      });

      if (!allowed) {
        console.warn(`[ServiceWorker] Network fetch denied for ${agentId}: ${hostname} not in allowedHosts`);
        return {
          success: false,
          error: `Permission denied: ${hostname} not in allowedHosts`
        };
      }
    }

    // ACL validation passed - make the request
    console.log(`[ServiceWorker] Proxying fetch for ${agentId} to: ${url}`);

    const response = await fetch(url, options);
    const data = await response.text();

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`[ServiceWorker] Fetch failed:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get agent info
 */
async function handleGetAgentInfo(message) {
  const { agentId } = message;

  try {
    const profile = await agentStorage.getProfile(agentId);
    const wasm = await agentStorage.getAgent(agentId);
    const metadata = await agentStorage.getMetadata(agentId);
    const userGrants = await agentStorage.getUserGrants(agentId);

    return {
      success: true,
      profile,
      wasm,
      metadata,
      userGrants
    };
  } catch (error) {
    console.error(`[ServiceWorker] Failed to get agent info:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Grant permissions to agent
 */
async function handleGrantPermissions(message) {
  const { agentId, grants } = message;

  try {
    await agentStorage.storeUserGrants(agentId, grants);

    return { success: true };
  } catch (error) {
    console.error(`[ServiceWorker] Failed to grant permissions:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Revoke permissions from agent
 */
async function handleRevokePermissions(message) {
  const { agentId, permissions } = message;

  try {
    const currentGrants = await agentStorage.getUserGrants(agentId);

    // Remove specified permissions
    for (const permission of permissions) {
      delete currentGrants[permission];
    }

    await agentStorage.storeUserGrants(agentId, currentGrants);

    return { success: true };
  } catch (error) {
    console.error(`[ServiceWorker] Failed to revoke permissions:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Handle external messages (from web console)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('[ServiceWorker] Received external message:', message.type);

  handleMessage(message, sender)
    .then(sendResponse)
    .catch(error => {
      console.error('[ServiceWorker] External message handler error:', error);
      sendResponse({ success: false, error: error.message });
    });

  return true;
});

console.log('[ServiceWorker] Service worker loaded');
