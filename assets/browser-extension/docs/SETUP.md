# Setup Guide

## Prerequisites

- Chrome/Chromium browser (for development/testing)
- Node.js 18+ (for backend)
- SSH access to deployment server (optional, for production)

## Local Development Setup

### 1. Backend API

```bash
cd backend/api
npm install
PORT=3000 node server.js
```

The API will start on http://localhost:3000

### 2. Build Content Script Bundle

The content script must be bundled because content scripts don't support ES6 modules:

```bash
node scripts/build-content-bundle.js
```

This bundles `lib/*.js` + `content/content-script.js` into `content/content-script-bundle.js` with imports/exports stripped.

**When to rebuild:**
- After editing any file in `extension/lib/`
- After editing `extension/content/content-script.js`
- After pulling changes that modify these files

### 3. Extension Loading

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `extension/` directory
5. Note the extension ID (e.g., `nhhpjehacjmhopjfhcdkafbbbklhhbnj`)

### 4. Configure Backend URL

If running locally, update `extension/popup/popup.js`:

```javascript
const state = {
  // ...
  backendUrl: 'http://localhost:3000'  // Change from production URL
};
```

## Production Deployment (Gateway)

### Backend Deployment

The backend is deployed to the gateway server (192.168.100.1) at https://dumpsterfire.blackhats.com

**Method 1: Manual deployment (preferred)**

1. **Deploy agent profiles**:
   ```bash
   rsync -av backend/agents/*/1.0.0/profile.json root@192.168.100.1:/opt/mcp-platform/backend/agents/
   ```

2. **Restart service**:
   ```bash
   ssh root@192.168.100.1 'systemctl restart mcp-api'
   ```

3. **Check status**:
   ```bash
   ssh root@192.168.100.1 'systemctl status mcp-api'
   curl https://dumpsterfire.blackhats.com/health
   ```

**Method 2: Full deployment script**

```bash
./scripts/deploy-to-gateway.sh
```

This uses rsync + docker-compose to deploy entire backend.

### Extension Testing

After deploying backend changes:

1. Go to `chrome://extensions/`
2. Click reload icon on the extension
3. Open new tab (or reload existing tab) to ensure fresh content script
4. Test the extension

**Note**: If you modified `extension/lib/` or `extension/content/content-script.js`, you must rebuild the bundle first:
```bash
node scripts/build-content-bundle.js
```

## File Structure

```
prototype/
├── extension/           # Browser extension (thin client)
│   ├── manifest.json
│   ├── background/      # Service worker
│   ├── content/         # Content scripts
│   ├── popup/           # User interface
│   ├── sandbox/         # Pyodide sandbox
│   ├── lib/             # Shared modules
│   └── icons/
├── backend/
│   ├── api/             # Express API server
│   │   └── server.js
│   └── agents/          # Agent repository
│       └── pyodide-test/
│           └── 1.0.0/
│               ├── profile.json
│               └── agent.wasm
├── scripts/             # Build and signing scripts
└── docs/                # Documentation

```

## Adding New Agents

1. **Create agent directory**:
   ```bash
   mkdir -p backend/agents/my-agent/1.0.0
   ```

2. **Create profile.json**:
   ```json
   {
     "agentId": "my-agent",
     "name": "My Agent",
     "version": "1.0.0",
     "runtime": "pyodide",
     "permissions": {
       "required": ["page.read"]
     },
     "capabilities": {
       "maxMemory": 104857600,
       "executionTimeout": 30000
     },
     "hash": "...",
     "signature": "..."
   }
   ```

3. **Add WASM file**:
   ```bash
   # For Pyodide agents, this is a placeholder
   echo "PLACEHOLDER" > backend/agents/my-agent/1.0.0/agent.wasm
   ```

4. **Update catalog** in `backend/api/server.js`:
   ```javascript
   app.get('/api/agents', (req, res) => {
     const agents = [
       { agentId: 'pyodide-test', ... },
       { agentId: 'my-agent', ... },  // Add here
     ];
     // ...
   });
   ```

5. **Sign the agent** (for production):
   ```bash
   node scripts/sign-agent.js my-agent
   ```

## Troubleshooting

### "Could not establish connection. Receiving end does not exist"
- Content script bundle has syntax errors or import/export statements
- **Fix**: Rebuild bundle: `node scripts/build-content-bundle.js`
- Reload extension in chrome://extensions/
- Open new tab to get fresh content script

### "Agent profile not found"
- Content script trying to read from its own IndexedDB (wrong context)
- Agents stored in service worker IndexedDB, content script must request via messaging
- **Fix**: Content script should call `chrome.runtime.sendMessage({ type: 'getAgentInfo' })`
- Already fixed in current code (content-script.js line ~82)

### "SubtleCrypto digest" type error
- WASM bytes from service worker are not ArrayBuffer
- Service worker might be returning Uint8Array or wrong type
- **Fix**: Check `handleGetAgentInfo` in service-worker.js returns actual WASM bytes
- Check `agentStorage.getAgent()` returns ArrayBuffer

### Extension not loading agents
- Check backend is running: `curl https://dumpsterfire.blackhats.com/health`
- Open service worker console: chrome://extensions/ → "Inspect views: service worker"
- Look for installation errors in console

### Network requests failing with CORS errors
- Content script should make fetch() directly, not proxy to service worker
- Extension has `host_permissions` in manifest.json
- **Architecture**: Extension → Content script (with permissions) → Direct fetch() → ACL enforcement

### Python shell not working
- Check browser console for CSP errors
- Verify sandbox iframe loads: check Network tab for pyodide-sandbox.html
- Ensure content script is injected (auto-injected when needed)
- Check Pyodide CDN is accessible

### Permission errors
- Check agent profile has required permissions
- Review console logs for permission denials
- Service worker stores grants in IndexedDB (user-grants store)
- Check PermissionMediator logic in lib/permission-mediator.js
