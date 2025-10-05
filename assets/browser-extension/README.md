# MCP Extension Platform

Enterprise browser extension platform for deploying and executing WebAssembly-based MCP agents.

## Quick Start

```bash
# Start backend
cd backend/api
npm install
node server.js

# Load extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the extension/ directory
```

## Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design, data flow, and security model
- **[Setup](docs/SETUP.md)** - Installation and deployment guide
- **[Usage](docs/USAGE.md)** - Using the extension and Python shell
- **[Permission Mediator](docs/permission-mediator.md)** - ACL enforcement and API security
- **[Full Specification](docs/mcp-extension-spec.md)** - Complete technical specification

## Features

- **Dynamic Agent Loading** - Download agents from remote backend, not bundled
- **Python Shell** - Interactive REPL for Pyodide agents with stdout capture
- **Four-Layer Security** - Sandbox CSP + Content script ACL + Service worker validation + Permission mediation
- **Network Access Control** - ACL-based allowedHosts whitelist enforcement
- **Service Worker Proxy** - Bypass CORS restrictions with DEFAULT DENY ALL validation
- **Enterprise Deployment** - Self-hosted backend with SSL

## Current Status

**Working**:
- ✅ Agent catalog from backend API
- ✅ Dynamic agent installation (profile + WASM download)
- ✅ Pyodide agent execution in sandboxed iframe
- ✅ Interactive Python shell with print() capture
- ✅ Permission enforcement with audit logging
- ✅ Network ACLs (networkAccess, allowedHosts)
- ✅ Service worker network proxy (CORS bypass)
- ✅ Storage management (IndexedDB)

**In Development**:
- ⏳ Cryptographic signature verification (currently disabled in dev mode)
- ⏳ Additional agent runtimes beyond Pyodide
- ⏳ Extended API surface (storage APIs, tab management)
- ⏳ Self-hosted extension updates

## Project Structure

```
prototype/
├── extension/          # Chrome extension (thin client)
├── backend/
│   ├── api/           # Express API server
│   └── agents/        # Agent repository (profile.json + agent.wasm)
├── scripts/           # Build and signing tools
└── docs/             # Documentation
```

## Technology

- **Extension**: Chrome Manifest V3
  - Service worker: ES6 modules
  - Content script: Plain JavaScript (bundled, no modules)
  - Sandbox: Restricted CSP iframe
- **Runtime**: Pyodide (Python 3.11 in WebAssembly, v0.24.1 from CDN)
- **Backend**: Node.js 18, Express
- **Deployment**: systemd, nginx, Let's Encrypt on 192.168.100.1
- **Storage**: IndexedDB (extension), filesystem (backend)

## Production Deployment

Backend running at: https://dumpsterfire.blackhats.com

See [Setup Guide](docs/SETUP.md) for deployment instructions.

## Development

- **Build content script**: `node scripts/build-content-bundle.js`
- **Sign agent**: `node scripts/sign-agent.js <agent-id>`
- **Deploy backend**: `./scripts/deploy-to-gateway.sh`

See [CLAUDE.md](CLAUDE.md) for Claude Code guidelines and project rules.
