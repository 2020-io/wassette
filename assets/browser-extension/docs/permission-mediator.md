# Permission Mediator

## Overview

The permission mediator (`lib/permission-mediator.js`) is the security enforcement layer that restricts agent access to browser APIs. It creates a restricted API object based on the agent's permission profile and enforces ACLs.

## Key Principle

WASM/Python agents cannot directly call browser APIs. They can only access functions explicitly provided via the restricted API object, which enforces permissions and ACLs before allowing access.

## Architecture

```
Agent Profile (permissions + capabilities)
         |
         v
PermissionMediator (in content script)
         |
         +-- Check user grants from service worker
         +-- Check capabilities (networkAccess, allowedHosts, etc.)
         +-- Create restricted API object
         +-- Log permission denials
         |
         v
Restricted API --> Passed to sandboxed iframe
         |
         v
Python code accesses via `restricted_api` global
         |
         v
API calls proxy to content script via postMessage
         |
         v
Network requests proxy to service worker (if allowed)
```

## Permission Types

### Console
- `console.log` - Log messages
  - `log(message)` - Prefixed with agent ID

### Page Access
- `page.read` - Read DOM content
  - `querySelector(selector)` - Returns element (read-only if `domAccess: "read-only"`)
  - `querySelectorAll(selector)` - Returns elements array
  - `getPageText()` - Returns `document.body.innerText`

- `page.write` - Modify DOM
  - `setElementText(selector, text)` - Updates element text content
  - Only available if `domAccess` is not `"read-only"`

### Clipboard
- `clipboard.write` - Write to clipboard
  - `writeToClipboard(text)` - Async, uses `navigator.clipboard.writeText()`

- `clipboard.read` - Read from clipboard
  - `readFromClipboard()` - Async, uses `navigator.clipboard.readText()`

### Network Access
- `network.fetch` - Make HTTP requests
  - `fetch(url, options)` - Async, proxied through service worker
  - Requires `capabilities.networkAccess: true`
  - Optional `capabilities.allowedHosts` array for host whitelist
  - Service worker validates request (DEFAULT DENY ALL)

### Notifications
- `notifications` - Show browser notifications
  - `showNotification(title, options)` - Uses Notification API

## Network Access Control

### ACL Enforcement Flow
1. Python calls `restricted_api.fetch(url)`
2. Sandbox proxies call to content script
3. **Content script ACL check** (first layer):
   - Checks `networkAccess` capability
   - Validates `allowedHosts` if specified
   - Logs denial if blocked
4. If allowed, sends to **service worker** (second layer):
   - Service worker validates against agent profile (DEFAULT DENY ALL)
   - Requires `agentId` in request
   - Double-checks `networkAccess` and `allowedHosts`
   - Makes actual fetch() (not CORS-restricted)
5. Response flows back through chain

### Why Service Worker Proxy?
Content scripts are CORS-restricted even with `host_permissions`. Only service workers can make unrestricted cross-origin requests. This is a Chrome architecture limitation.

## Implementation Example

### Creating Restricted API

```javascript
class PermissionMediator {
  constructor(profile, userGrants) {
    this.profile = profile;
    this.userGrants = userGrants || {};
    this.denialLog = [];
  }

  createRestrictedAPI() {
    const api = {};

    // Network access with ACL enforcement
    if (this.hasPermission('network.fetch') && this.profile.capabilities.networkAccess) {
      api.fetch = async (url, options) => {
        // Check allowedHosts ACL
        if (this.profile.capabilities.allowedHosts) {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname;
          const allowed = this.profile.capabilities.allowedHosts.some(allowedHost => {
            return hostname === allowedHost || hostname.endsWith('.' + allowedHost);
          });
          if (!allowed) {
            this.logDenial('network.fetch', { url, reason: 'Host not in allowedHosts' });
            return '[Permission denied: host not in allowedHosts]';
          }
        }

        // Proxy to service worker for actual fetch
        const response = await chrome.runtime.sendMessage({
          type: 'network-fetch',
          url,
          options,
          agentId: this.profile.agentId
        });

        if (!response.success) {
          throw new Error(response.error);
        }
        return response.data;
      };
    } else {
      api.fetch = (url) => {
        this.logDenial('network.fetch', { url, reason: 'networkAccess disabled' });
        return '[Permission denied: network.fetch]';
      };
    }

    return api;
  }
}
```

## Usage in Python

```python
# Network request (with ACL enforcement)
result = await restricted_api.fetch('https://api.example.com/data')
print(result)

# Read page
text = restricted_api.getPageText()

# Console logging
restricted_api.log("Hello from agent!")

# DOM access (if permitted)
element = restricted_api.querySelector('#content')
```

## Permission Granting Flow

1. **Installation** - Service worker grants `permissions.required` from profile
2. **Storage** - Grants stored in service worker's `user-grants` IndexedDB store
3. **Execution** - Content script requests grants from service worker via `getAgentInfo`
4. **Mediation** - PermissionMediator creates API based on grants and capabilities
5. **Access** - Python code calls `restricted_api.method()`
6. **Enforcement** - Content script enforces ACLs, service worker validates network requests

## Denial Logging

All permission denials are logged with context:

```javascript
{
  agentId: 'my-agent',
  permission: 'network.fetch',
  timestamp: 1759504633447,
  context: {
    url: 'https://blocked-site.com',
    reason: 'Host not in allowedHosts'
  }
}
```

Logged to:
- Console (for debugging)
- In-memory array (returned with execution results)
- Future: Backend audit API

## Security Layers

1. **Sandbox CSP** - Prevents direct network/DOM access from iframe
2. **Content Script ACL** - Enforces `networkAccess`, `allowedHosts`, permission grants
3. **Service Worker Validation** - DEFAULT DENY ALL, validates every network request
4. **Read-only Proxy** - DOM elements can be read-only when `domAccess: "read-only"`

## Capabilities vs Permissions

**Permissions** (what APIs agent can access):
- `console.log`, `page.read`, `page.write`, `clipboard.read`, `clipboard.write`, `network.fetch`, `notifications`
- Declared in `permissions.required` array in profile
- User must grant (auto-granted on install currently)

**Capabilities** (execution limits and ACLs):
- `networkAccess` (boolean) - Enable/disable all network access
- `allowedHosts` (array) - Whitelist of allowed domains for network access
- `maxMemory` (number) - Memory limit for WASM execution
- `executionTimeout` (number) - Maximum execution time in ms
- `domAccess` ("none" | "read-only" | "full") - DOM access level

## Current API Surface

**Implemented:**
- ✅ Console logging (`console.log`)
- ✅ Page reading (`page.read` with querySelector, querySelectorAll, getPageText)
- ✅ Page writing (`page.write` with setElementText)
- ✅ Clipboard read/write (`clipboard.read`, `clipboard.write`)
- ✅ Network access (`network.fetch` with ACL enforcement)
- ✅ Notifications (`notifications`)

**Not implemented:**
- ❌ Storage APIs (`storage.local`, `storage.sync`)
- ❌ History APIs
- ❌ Bookmark APIs
- ❌ Tab management APIs

New APIs can be added by extending `createRestrictedAPI()` in permission-mediator.js.
