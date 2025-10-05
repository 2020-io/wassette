# MCP Extension Platform - Architecture

## Overview

The MCP Extension Platform is a browser extension system for deploying and executing WebAssembly-based MCP agents in enterprise environments. Agents are downloaded from a remote repository, not bundled with the extension.

## Components

### 1. Browser Extension (Chrome/Edge)

**Location**: `./extension/`

The extension is a thin client that downloads and executes agents from the backend.

#### Key Files:
- `manifest.json` - Extension configuration (Manifest V3)
- `background/service-worker.js` - Agent installation and management
- `content/content-script-bundle.js` - Agent execution in page context
- `popup/` - User interface for browsing and installing agents
- `sandbox/pyodide-sandbox.html` - Sandboxed iframe for Pyodide execution

#### Features:
- Agent catalog browsing from backend API
- Dynamic agent installation (profile + WASM download)
- Permission mediation and enforcement
- Sandboxed agent execution
- Interactive Python shell for Pyodide agents

### 2. Backend API (Node.js/Express)

**Location**: `./backend/api/`

Serves agent catalog and agent files.

#### Endpoints:
- `GET /api/agents` - List available agents
- `GET /api/agents/:id` - Get agent details
- `GET /agents/:id/:version/profile.json` - Download agent profile
- `GET /agents/:id/:version/agent.wasm` - Download agent WASM
- `GET /health` - Health check
- `GET /api/version` - Version info

#### Deployment:
- Running on gateway: https://dumpsterfire.blackhats.com
- Systemd service: `mcp-api.service`
- Nginx reverse proxy with Let's Encrypt SSL

### 3. Agent Repository

**Location**: `./backend/agents/`

Stores agent files organized by ID and version:
```
backend/agents/
  └── pyodide-test/
      └── 1.0.0/
          ├── profile.json
          └── agent.wasm
```

#### Agent Profile (profile.json):
- Agent metadata (name, version, description)
- Permission requirements
- Capability limits (memory, timeout, network)
- Cryptographic hash and signature
- Default code for execution

## Data Flow

### Agent Installation:
1. User opens extension popup
2. Popup fetches catalog from backend: `GET /api/agents`
3. User clicks "Install" on an agent
4. Popup sends `installAgent` message to service worker
5. Service worker downloads:
   - Profile: `GET /api/agents/:id`
   - WASM: `GET /agents/:id/:version/agent.wasm`
6. Service worker verifies signature (dev mode: skipped)
7. Service worker stores agent in IndexedDB (agents, profiles, metadata stores)
8. Service worker grants default permissions (stores in user-grants)

### Agent Execution Flow:
1. User clicks "Run" or "Shell" in popup
2. Popup sends `executeAgent` message to content script on active tab
3. Content script sends `getAgentInfo` message to service worker
4. Service worker returns profile, WASM bytes, and user grants from IndexedDB
5. Content script creates PermissionMediator with profile and grants
6. Content script creates sandboxed iframe (`sandbox/pyodide-sandbox.html`)
7. Iframe loads Pyodide from CDN (v0.24.1)
8. Content script sends Python code + restricted API to iframe via postMessage
9. Iframe executes Python with `restricted_api` proxy object
10. Python calls (e.g., `restricted_api.fetch(url)`) postMessage back to content script
11. Content script's PermissionMediator enforces ACL checks (first layer)
12. If allowed, content script sends `network-fetch` message to **service worker**
13. **Service worker validates request against agent profile** (second layer, default DENY ALL)
14. Service worker makes actual fetch() call (not CORS-restricted, has full host_permissions)
15. Response flows back: service worker → content script → iframe
16. Iframe captures stdout and returns result to content script
17. Content script returns result + denial log to popup

## Security Model

### Four-Layer Security Architecture

#### Layer 1: Extension Permissions (Broad Access)
- Extension has `host_permissions` in manifest.json for known backend servers
- Service worker has unrestricted network access (not CORS-restricted)
- Extension is trusted code with broad permissions

#### Layer 2: Sandbox Isolation (CSP)
- Agents execute in sandboxed iframe with restrictive CSP
- CSP blocks direct network access from sandbox
- Sandbox can only communicate via postMessage
- Prevents malicious agents from bypassing permission checks

#### Layer 3: Content Script ACL Enforcement (First Check)
- `PermissionMediator` runs in content script (outside sandbox)
- Enforces agent-specific ACLs before proxying to service worker:
  - `networkAccess` - Enable/disable all network access
  - `allowedHosts` - Whitelist of allowed domains (if networkAccess enabled)
  - `maxMemory` - Memory limits for WASM execution
  - `executionTimeout` - Maximum execution time
  - `domAccess` - Read-only or full DOM access
- Logs all permission denials with context for audit
- Denied calls return error strings (e.g., "[Permission denied: network.fetch]")

#### Layer 4: Service Worker Validation (DEFAULT DENY ALL)
- Service worker receives network requests from content script
- **DEFAULT DENY ALL** - validates every request against agent profile
- Double-checks ACLs (networkAccess, allowedHosts) from agent's stored profile
- Only makes fetch() if validation passes
- Service worker has full network access (no CORS restrictions)
- This is necessary because content scripts are CORS-restricted even with host_permissions

### Network Access Control Examples

**Agent with networkAccess: false**
```javascript
// All network requests denied
restricted_api.fetch(url) → "[Permission denied: network.fetch]"
```

**Agent with networkAccess: true, no allowedHosts**
```javascript
// All network requests allowed
restricted_api.fetch(url) → actual response
```

**Agent with networkAccess: true, allowedHosts: ["dumpsterfire.blackhats.com"]**
```javascript
restricted_api.fetch("https://dumpsterfire.blackhats.com/health") → actual response
restricted_api.fetch("https://www.google.com") → "[Permission denied: host not in allowedHosts]"
```

### Cryptographic Verification
- Agents signed with platform private key (RSA-2048)
- SHA256 hash verification
- Public key embedded in extension
- **Currently disabled in dev mode** (verification skipped, see content-script.js line ~160)

## Storage Architecture

### Service Worker IndexedDB:
- `agents` - WASM binaries (keyPath: id)
- `profiles` - Agent profiles (keyPath: agentId)
- `user-grants` - Permission approvals (keyPath: agentId)
- `metadata` - Installation timestamps, usage stats (keyPath: agentId)

**Note**: Content scripts have separate IndexedDB context, so they fetch agent data from service worker via messaging.

## Key Design Decisions

1. **Agents from backend, not bundled** - Extension is thin client, agents downloaded dynamically
2. **Sandboxed iframe for Pyodide** - Provides CSP isolation, prevents direct network access
3. **Service worker as source of truth** - Agents stored in service worker IndexedDB, content scripts request via messaging
4. **Content script bundle (non-modules)** - Content scripts don't support ES6 modules, so libs bundled into single file
5. **Service worker network proxy** - Content scripts are CORS-restricted, service worker makes actual fetch() calls with full host_permissions
6. **DEFAULT DENY ALL in service worker** - Every network request validated against agent profile before allowing
7. **Double ACL validation** - Content script checks ACLs, service worker validates again (defense in depth)
8. **Python stdout capture** - StringIO redirection for print() output in shell
9. **No Chrome Web Store dependency** - Self-hosted update server for enterprise deployment

## Technology Stack

- **Extension**: Chrome Manifest V3
  - Service worker: ES6 modules
  - Content script: Plain JavaScript (bundled from `scripts/build-content-bundle.js`)
  - Popup: Plain JavaScript + HTML
- **Pyodide**: Python 3.11 in WebAssembly (v0.24.1 from CDN)
- **Backend**: Node.js 18, Express
- **Deployment**: systemd, nginx, Let's Encrypt on 192.168.100.1
- **Storage**: IndexedDB (extension), filesystem (backend)

## Build Scripts

- **`scripts/build-content-bundle.js`** - Bundles lib/*.js + content-script.js into single file, strips ES6 imports/exports
- **`scripts/sign-agent.js`** - Signs agent WASM with platform private key, updates profile hash/signature
- **`scripts/update-network-tests.js`** - Updates network test agents with shared test script
- **`scripts/deploy-to-gateway.sh`** - Deploys backend to 192.168.100.1 via rsync + docker-compose
