# Usage Guide

## Installing Agents

1. **Open the extension popup**
   - Click the extension icon in Chrome toolbar
   - Or: Extensions menu (puzzle piece) → "MCP Extension Platform"

2. **Browse available agents**
   - The "Available Agents" section shows agents from the backend catalog
   - Click "Refresh Catalog" to reload from server

3. **Install an agent**
   - Click "Install" next to any agent
   - Extension downloads profile and WASM from backend
   - Installation progress shown in output panel
   - Installed agents appear in "Installed Agents" section

## Running Agents

### Quick Run

1. Click "Run" button next to an installed agent
2. Agent executes with default code
3. Output appears in the output panel

For Pyodide agents, default execution runs a test script showing:
- Basic Python execution
- Page title access via `js.document.title`

### Interactive Python Shell

For Pyodide agents (like `pyodide-test`):

1. Click "Shell" button next to the agent
2. Python shell opens in the popup
3. Type Python code and press Enter
4. Output appears immediately

**Example commands**:
```python
# Basic math
2 + 2

# Print statements
print("Hello from Python!")

# Multiple lines (use Shift+Enter for newlines in most browsers)
for i in range(5):
    print(i)

# Access page
import js
js.document.title

# Access restricted API
print(restricted_api.getPageText()[:100])

# Agent ID
print(f"Agent: {agent_id}")
```

**Features**:
- Both `print()` output and return values are shown
- Stdout captured via StringIO redirection
- Shell state persists between executions (variables remain)
- Close with "Close" button

## Managing Agents

### View Installed Agents

The "Installed Agents" section shows:
- Agent ID
- Last used timestamp
- Action buttons (Shell, Run, Delete)

### Delete an Agent

1. Click "Delete" button
2. Confirm deletion
3. Agent removed from IndexedDB
4. Catalog updates to show "Install" button again

### Storage Info

Click "Storage Info" button to see:
- Total storage used by extension
- Storage quota
- Usage percentage

## Permissions

### Automatic Permissions

When installing an agent, required permissions are automatically granted:
- `page.read` - Read page content
- `console.log` - Log to console
- `clipboard.write` - Write to clipboard (optional)

### Permission Denials

If an agent tries to use a permission it doesn't have:
- Action is blocked
- Denial logged in output (when available)
- Check service worker console for audit log

## Debugging

### Extension Console

**Service Worker Console**:
1. Go to `chrome://extensions/`
2. Find "MCP Extension Platform"
3. Click "Inspect views: service worker"
4. View installation and permission logs

**Page Console**:
1. Press F12 on the page where agent runs
2. View content script and execution logs
3. Check for CSP or sandbox errors

### Sandbox Console

The Pyodide sandbox iframe has its own console:
1. Open browser DevTools
2. Look for logs prefixed with `[Sandbox]`
3. Check pyodide.asm.js for Python output

### Output Panel

The extension popup has an output panel:
- Shows execution results
- Shows installation progress
- Shows errors
- Click "Clear" to reset

## Tips

1. **Reload page after installation** - Content script only loads on page load
2. **Check backend status** - Visit https://dumpsterfire.blackhats.com/health
3. **Python print() vs return** - Shell shows both; use print() for debugging
4. **Pyodide loading** - First shell use loads Pyodide (~30s), subsequent uses are fast
5. **Storage limits** - Browser may limit extension storage; check "Storage Info"

## Known Limitations

1. **Content script injection** - Auto-injected when needed, but page reload is cleaner
2. **Large WASM files** - Download may be slow on first install
3. **Pyodide CDN dependency** - Requires internet connection for first load
4. **Dev mode signature verification** - Currently disabled (see content-script-bundle.js)
5. **Single shell per popup** - Opening new popup creates new shell session
