/**
 * Popup UI Logic
 */

// UI elements
const elements = {
  catalogList: document.getElementById('catalog-list'),
  agentsList: document.getElementById('agents-list'),
  output: document.getElementById('output'),
  outputContent: document.getElementById('output-content'),
  status: document.getElementById('status'),
  btnRefreshCatalog: document.getElementById('btn-refresh-catalog'),
  btnStorageInfo: document.getElementById('btn-storage-info'),
  btnClearOutput: document.getElementById('btn-clear-output'),
  pythonShellSection: document.getElementById('python-shell-section'),
  shellOutput: document.getElementById('shell-output'),
  shellInput: document.getElementById('shell-input'),
  btnShellRun: document.getElementById('btn-shell-run'),
  btnCloseShell: document.getElementById('btn-close-shell')
};

// State
const state = {
  catalog: [],
  installedAgents: [],
  backendUrl: 'https://dumpsterfire.blackhats.com',
  shellAgentId: null,
  shellHistory: []
};

/**
 * Initialize popup
 */
async function initialize() {
  try {
    setStatus('Loading...', 'loading');

    // Load catalog and installed agents in parallel
    await Promise.all([
      loadCatalog(),
      loadInstalledAgents()
    ]);

    // Set up event listeners
    setupEventListeners();

    setStatus('Ready', 'success');
  } catch (error) {
    console.error('[Popup] Initialization failed:', error);
    setStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  elements.btnRefreshCatalog.addEventListener('click', handleRefreshCatalog);
  elements.btnStorageInfo.addEventListener('click', handleStorageInfo);
  elements.btnClearOutput.addEventListener('click', handleClearOutput);
  elements.btnShellRun.addEventListener('click', handleShellRun);
  elements.btnCloseShell.addEventListener('click', handleCloseShell);
  elements.shellInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleShellRun();
  });
}

/**
 * Load catalog from backend
 */
async function loadCatalog() {
  try {
    const response = await fetch(`${state.backendUrl}/api/agents`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to load catalog');
    }

    state.catalog = data.agents || [];
    renderCatalog();
  } catch (error) {
    console.error('[Popup] Failed to load catalog:', error);
    elements.catalogList.innerHTML = `
      <div class="empty-state">
        <p style="color: #f44;">Failed to load catalog</p>
        <p style="font-size: 12px; color: #bbb;">${error.message}</p>
      </div>
    `;
  }
}

/**
 * Render catalog list
 */
function renderCatalog() {
  if (state.catalog.length === 0) {
    elements.catalogList.innerHTML = `
      <div class="empty-state">
        <p>No agents available in catalog</p>
      </div>
    `;
    return;
  }

  // Get list of installed agent IDs
  const installedIds = new Set(state.installedAgents.map(a => a.agentId));

  elements.catalogList.innerHTML = state.catalog.map(agent => {
    const isInstalled = installedIds.has(agent.agentId);
    return `
      <div class="agent-card" data-agent-id="${agent.agentId}">
        <div class="agent-info">
          <div class="agent-name">${agent.name}</div>
          <div class="agent-meta">
            ${agent.description}
          </div>
          <div class="agent-meta" style="font-size: 11px; color: #888;">
            Version: ${agent.version} | Runtime: ${agent.runtime}
          </div>
        </div>
        <div class="agent-actions">
          ${isInstalled ?
            '<span style="color: #4a4; font-size: 12px;">Installed</span>' :
            `<button class="btn-small btn-install" data-agent-id="${agent.agentId}" data-version="${agent.version}">Install</button>`
          }
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners to install buttons
  document.querySelectorAll('.btn-install').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const agentId = e.target.dataset.agentId;
      const version = e.target.dataset.version;
      handleInstallFromCatalog(agentId, version);
    });
  });
}

/**
 * Handle install from catalog
 */
async function handleInstallFromCatalog(agentId, version) {
  try {
    setStatus('Installing agent...', 'loading');
    showOutput(`Installing ${agentId}...\n`);

    const profileUrl = `${state.backendUrl}/api/agents/${agentId}`;
    const wasmUrl = `${state.backendUrl}/agents/${agentId}/${version}/agent.wasm`;

    const response = await chrome.runtime.sendMessage({
      type: 'installAgent',
      agentId,
      profileUrl,
      wasmUrl
    });

    if (response.success) {
      showOutput('\nAgent installed successfully!\n');
      showOutput(`Name: ${response.profile.name}\n`);
      showOutput(`Version: ${response.profile.version}\n`);
      setStatus('Agent installed', 'success');
      await Promise.all([loadCatalog(), loadInstalledAgents()]);
    } else {
      showOutput('\nInstallation failed: ' + response.error);
      setStatus('Installation failed', 'error');
    }
  } catch (error) {
    console.error('[Popup] Install agent failed:', error);
    showOutput('\nError: ' + error.message);
    setStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Load installed agents
 */
async function loadInstalledAgents() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'listAgents' });

    if (!response.success) {
      throw new Error(response.error);
    }

    state.installedAgents = response.agents || [];
    renderInstalledAgents();
  } catch (error) {
    console.error('[Popup] Failed to load installed agents:', error);
    throw error;
  }
}

/**
 * Render installed agents list
 */
function renderInstalledAgents() {
  if (state.installedAgents.length === 0) {
    elements.agentsList.innerHTML = `
      <div class="empty-state">
        <p>No agents installed</p>
        <p style="font-size: 12px; color: #bbb;">
          Install agents from the catalog above
        </p>
      </div>
    `;
    return;
  }

  elements.agentsList.innerHTML = state.installedAgents.map(agent => {
    const isPyodide = agent.agentId === 'pyodide-test' || (agent.runtime === 'pyodide');
    return `
      <div class="agent-card" data-agent-id="${agent.agentId}">
        <div class="agent-info">
          <div class="agent-name">${agent.agentId}</div>
          <div class="agent-meta">
            ${agent.lastUsed ? 'Last used: ' + formatDate(agent.lastUsed) : 'Never used'}
          </div>
        </div>
        <div class="agent-actions">
          ${isPyodide ? `<button class="btn-small btn-shell" data-agent-id="${agent.agentId}">Shell</button>` : ''}
          <button class="btn-small btn-execute" data-agent-id="${agent.agentId}">
            Run
          </button>
          <button class="btn-danger btn-delete" data-agent-id="${agent.agentId}">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners to agent buttons
  document.querySelectorAll('.btn-shell').forEach(btn => {
    btn.addEventListener('click', (e) => handleOpenShell(e.target.dataset.agentId));
  });

  document.querySelectorAll('.btn-execute').forEach(btn => {
    btn.addEventListener('click', (e) => handleExecuteAgent(e.target.dataset.agentId));
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => handleDeleteAgent(e.target.dataset.agentId));
  });
}

/**
 * Handle refresh catalog button
 */
async function handleRefreshCatalog() {
  try {
    setStatus('Refreshing catalog...', 'loading');
    await Promise.all([loadCatalog(), loadInstalledAgents()]);
    setStatus('Catalog refreshed', 'success');
  } catch (error) {
    console.error('[Popup] Refresh catalog failed:', error);
    setStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Handle execute agent
 */
async function handleExecuteAgent(agentId) {
  try {
    setStatus(`Executing ${agentId}...`, 'loading');
    showOutput(`Executing agent: ${agentId}\n`);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Ensure content script is loaded
    await ensureContentScriptLoaded(tab.id);

    // For pyodide agents, use default test code
    const args = agentId === 'pyodide-test' ? [`
print("=" * 50)
print("Pyodide Test Agent")
print("=" * 50)

print("\\n[Test] Basic execution")
print("SUCCESS: Pyodide is running!")

print("\\n[Test] Page access")
try:
    import js
    title = js.document.title
    print(f"SUCCESS: Page title = '{title}'")
except Exception as e:
    print(f"FAILED: {e}")

print("\\n" + "=" * 50)
print("Test completed")
print("=" * 50)
`] : [];

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'executeAgent',
      agentId,
      args
    });

    if (response.success) {
      showOutput('\nExecution completed!\n');
      if (response.result) {
        showOutput('Result: ' + JSON.stringify(response.result, null, 2) + '\n');
      }
      if (response.denialLog && response.denialLog.length > 0) {
        showOutput('\nPermission denials:\n' + JSON.stringify(response.denialLog, null, 2));
      }
      setStatus('Execution completed', 'success');
    } else {
      showOutput('\nExecution failed: ' + response.error);
      setStatus('Execution failed', 'error');
    }

    await loadInstalledAgents();
  } catch (error) {
    console.error('[Popup] Execute agent failed:', error);
    showOutput('\nError: ' + error.message);
    setStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Handle delete agent
 */
async function handleDeleteAgent(agentId) {
  if (!confirm(`Delete agent "${agentId}"?`)) {
    return;
  }

  try {
    setStatus(`Deleting ${agentId}...`, 'loading');

    const response = await chrome.runtime.sendMessage({
      type: 'uninstallAgent',
      agentId
    });

    if (response.success) {
      setStatus('Agent deleted', 'success');
      await Promise.all([loadCatalog(), loadInstalledAgents()]);
    } else {
      setStatus('Delete failed', 'error');
    }
  } catch (error) {
    console.error('[Popup] Delete agent failed:', error);
    setStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Handle storage info
 */
async function handleStorageInfo() {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = (estimate.usage / 1024 / 1024).toFixed(2);
      const quota = (estimate.quota / 1024 / 1024).toFixed(2);
      const percent = ((estimate.usage / estimate.quota) * 100).toFixed(1);

      showOutput(`Storage Information:

Used: ${used} MB
Quota: ${quota} MB
Usage: ${percent}%
`);
    } else {
      showOutput('Storage estimate API not available');
    }
  } catch (error) {
    console.error('[Popup] Storage info failed:', error);
    showOutput('Error: ' + error.message);
  }
}

/**
 * Handle clear output
 */
function handleClearOutput() {
  elements.output.classList.add('hidden');
  elements.outputContent.textContent = '';
}

/**
 * Show output panel
 */
function showOutput(text) {
  elements.output.classList.remove('hidden');
  elements.outputContent.textContent += text;
  elements.output.scrollTop = elements.output.scrollHeight;
}

/**
 * Set status message
 */
function setStatus(message, type = '') {
  elements.status.textContent = message;
  elements.status.className = 'status ' + type;
}

/**
 * Format date
 */
function formatDate(timestamp) {
  if (!timestamp) return 'Never';

  const date = new Date(timestamp);
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';

  return date.toLocaleDateString();
}

/**
 * Ensure content script is loaded in tab
 */
async function ensureContentScriptLoaded(tabId) {
  try {
    // Try to ping the content script
    await chrome.tabs.sendMessage(tabId, { type: 'ping' });
  } catch (error) {
    // Content script not loaded, inject it
    console.log('[Popup] Injecting content script into tab');
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/content-script-bundle.js']
    });
    // Wait a bit for initialization
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Handle open shell
 */
async function handleOpenShell(agentId) {
  state.shellAgentId = agentId;
  state.shellHistory = [];
  elements.pythonShellSection.style.display = 'block';
  elements.shellOutput.textContent = `Python Shell - ${agentId}\nType Python code and press Enter to execute.\n\n>>> `;
  elements.shellInput.value = '';
  elements.shellInput.focus();
}

/**
 * Handle close shell
 */
function handleCloseShell() {
  elements.pythonShellSection.style.display = 'none';
  state.shellAgentId = null;
  state.shellHistory = [];
}

/**
 * Handle shell run
 */
async function handleShellRun() {
  const code = elements.shellInput.value.trim();
  if (!code || !state.shellAgentId) return;

  try {
    // Add input to output
    elements.shellOutput.textContent += code + '\n';
    elements.shellInput.value = '';

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await ensureContentScriptLoaded(tab.id);

    // Execute code
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'executeAgent',
      agentId: state.shellAgentId,
      args: [code]
    });

    if (response.success) {
      const result = response.result !== undefined ? String(response.result) : '';
      if (result) {
        elements.shellOutput.textContent += result + '\n';
      }
    } else {
      elements.shellOutput.textContent += `Error: ${response.error}\n`;
    }
  } catch (error) {
    elements.shellOutput.textContent += `Error: ${error.message}\n`;
  }

  elements.shellOutput.textContent += '\n>>> ';
  elements.shellOutput.scrollTop = elements.shellOutput.scrollHeight;
  elements.shellInput.focus();
}

// Initialize when popup opens
initialize();
