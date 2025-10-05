# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) Browser Extension Platform for deploying WebAssembly-based MCP agents via browser extensions in enterprise environments.

**Current Status**: Active development - building browser extension with Pyodide test agent.

## Project Rules

1. **Never use emojis** in any code, documentation, or output
2. **Maintain ./docs/ directory** with real-time component documentation
3. **Always test before reporting** - Manually test features before claiming they work
4. Use Pyodide WASM runtime as test payload for infrastructure validation

## Key Architecture Components

The specification describes a multi-tier system:

1. **Browser Extension (Chrome/Edge)**: Manifest V3 extension with service worker, permission mediator, content scripts, and WASM executor
2. **Backend Services (Docker)**: API server, update server (nginx), web console (Next.js), PostgreSQL, Redis, MinIO (S3-compatible storage)
3. **Web Console**: User-facing interface for browsing and installing MCP agents
4. **Update Mechanism**: Self-hosted update server using Chrome's extension update protocol

## Core Concepts

### Two-Layer Update Model
- **Layer 1 (Extension Code)**: Infrequent updates via self-hosted update server, Chrome handles update mechanism
- **Layer 2 (WASM Agents)**: Frequent updates downloaded by extension as data, stored in IndexedDB

### Security Model
- **Permission Mediation**: JavaScript layer enforces agent permission profiles
- **Cryptographic Signing**: All WASM agents signed and verified using platform private key
- **Sandboxing**: WASM agents can only call APIs explicitly passed via import object

### Enterprise Deployment
- One-time IT deployment via MDM (Google Workspace Admin Console or Microsoft Intune)
- Force-installed extensions with self-hosted update URLs
- Automatic updates without Chrome Web Store dependency

## Important Technical Details

### Extension Signing
- Extension ID is derived from RSA private key
- **Same key = same extension ID** (critical for updates)
- Losing the signing key means the extension can never be updated
- Production key must be stored in HSM/KMS (AWS KMS, Azure Key Vault, etc.)

### WASM Agent Requirements
- Agents must be cryptographically signed
- Permission profile defines capabilities (networkAccess, domAccess, maxMemory, executionTimeout)
- Signatures verified before WASM instantiation
- Revocation list checked

### Storage Strategy
- IndexedDB for WASM binaries (can be 50MB+)
- Agent metadata and permission profiles
- User preference and approval records

## Key Files

- `mcp-extension-spec.md`: Complete technical specification (1279 lines)
- `docs/`: Component-specific documentation (updated in real-time during development)
  - `docs/extension.md`: Browser extension architecture and components
  - `docs/permission-mediator.md`: Permission enforcement system
  - `docs/backend-services.md`: Docker services and API (when implemented)
  - `docs/signing.md`: Cryptographic signing (when implemented)
  - `docs/testing.md`: Testing strategy (when implemented)

## Development Considerations

When implementing this specification:

1. **Extension Development**: Use Manifest V3, minimize permissions, no eval() or inline scripts
2. **Agent Development**: Request minimal permissions, no network access unless required, handle execution timeouts
3. **Signing Keys**: Never commit signing keys, use KMS in production
4. **Update Server**: Must use HTTPS with valid SSL certificate
5. **Permission Enforcement**: JavaScript mediator must enforce all capability limits before passing APIs to WASM

## POC Milestones (from spec)

1. Basic extension with WASM support
2. Permission mediation implementation
3. Self-hosted update server
4. Dynamic agent loading
5. Web console integration
6. Enterprise deployment testing

## Testing Strategy

- Unit tests: Permission mediator, WASM loader, crypto verification (target 80%+ coverage)
- Integration tests: End-to-end agent installation and execution
- Manual testing: Full workflows with test agents (network-test-*, pyodide-test)
- Security tests: ACL validation, permission enforcement, signature tampering attempts
- Performance tests: Load testing with k6/Artillery

## References

See Appendix B in `docs/mcp-extension-spec.md` for Chrome Extension docs, WebAssembly spec, Chrome Enterprise policy documentation, and other technical references.
