/**
 * Content Script Bundle
 *
 * Combined bundle of all dependencies since content scripts don't support ES modules
 */

// ============================================================================
// lib/agent-storage.js
// ============================================================================

/**
 * Agent Storage
 *
 * IndexedDB wrapper for storing WASM agents, profiles, and metadata.
 * Handles large WASM binaries (50MB+) efficiently.
 */

const DB_NAME = 'mcp-extension-db';
const DB_VERSION = 1;

const STORES = {
  AGENTS: 'agents',           // WASM binaries
  PROFILES: 'profiles',       // Agent profiles
  USER_GRANTS: 'user-grants', // Permission approvals
  METADATA: 'metadata'        // Agent metadata
};

class AgentStorage {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database connection
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains(STORES.AGENTS)) {
          db.createObjectStore(STORES.AGENTS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.PROFILES)) {
          const profileStore = db.createObjectStore(STORES.PROFILES, { keyPath: 'agentId' });
          profileStore.createIndex('version', 'version', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.USER_GRANTS)) {
          db.createObjectStore(STORES.USER_GRANTS, { keyPath: 'agentId' });
        }

        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          const metadataStore = db.createObjectStore(STORES.METADATA, { keyPath: 'agentId' });
          metadataStore.createIndex('installedAt', 'installedAt', { unique: false });
          metadataStore.createIndex('lastUsed', 'lastUsed', { unique: false });
        }
      };
    });
  }

  /**
   * Store agent WASM binary
   */
  async storeAgent(agentId, wasmBytes) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.AGENTS], 'readwrite');
      const store = transaction.objectStore(STORES.AGENTS);

      const request = store.put({
        id: agentId,
        wasm: wasmBytes,
        storedAt: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve agent WASM binary
   */
  async getAgent(agentId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.AGENTS], 'readonly');
      const store = transaction.objectStore(STORES.AGENTS);
      const request = store.get(agentId);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.wasm : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store agent profile
   */
  async storeProfile(profile) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.PROFILES], 'readwrite');
      const store = transaction.objectStore(STORES.PROFILES);

      const request = store.put({
        ...profile,
        updatedAt: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve agent profile
   */
  async getProfile(agentId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.PROFILES], 'readonly');
      const store = transaction.objectStore(STORES.PROFILES);
      const request = store.get(agentId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store user permission grants for an agent
   */
  async storeUserGrants(agentId, grants) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.USER_GRANTS], 'readwrite');
      const store = transaction.objectStore(STORES.USER_GRANTS);

      const request = store.put({
        agentId,
        grants,
        grantedAt: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve user permission grants for an agent
   */
  async getUserGrants(agentId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.USER_GRANTS], 'readonly');
      const store = transaction.objectStore(STORES.USER_GRANTS);
      const request = store.get(agentId);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.grants : {});
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store agent metadata
   */
  async storeMetadata(agentId, metadata) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.METADATA], 'readwrite');
      const store = transaction.objectStore(STORES.METADATA);

      const request = store.put({
        agentId,
        ...metadata,
        updatedAt: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve agent metadata
   */
  async getMetadata(agentId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.METADATA], 'readonly');
      const store = transaction.objectStore(STORES.METADATA);
      const request = store.get(agentId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * List all installed agents
   */
  async listAgents() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.METADATA], 'readonly');
      const store = transaction.objectStore(STORES.METADATA);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete an agent and all its data
   */
  async deleteAgent(agentId) {
    if (!this.db) await this.init();

    const promises = [
      new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORES.AGENTS], 'readwrite');
        const request = transaction.objectStore(STORES.AGENTS).delete(agentId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORES.PROFILES], 'readwrite');
        const request = transaction.objectStore(STORES.PROFILES).delete(agentId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORES.USER_GRANTS], 'readwrite');
        const request = transaction.objectStore(STORES.USER_GRANTS).delete(agentId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORES.METADATA], 'readwrite');
        const request = transaction.objectStore(STORES.METADATA).delete(agentId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
    ];

    await Promise.all(promises);
  }

  /**
   * Update last used timestamp
   */
  async updateLastUsed(agentId) {
    const metadata = await this.getMetadata(agentId);
    if (metadata) {
      metadata.lastUsed = Date.now();
      await this.storeMetadata(agentId, metadata);
    }
  }

  /**
   * Get storage usage estimate
   */
  async getStorageEstimate() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate();
    }
    return null;
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
const agentStorage = new AgentStorage();


// ============================================================================
// lib/crypto-verify.js
// ============================================================================

/**
 * Crypto Verification
 *
 * Verifies WASM agent integrity using SHA256 hashing and RSA signature verification.
 * Platform public key is embedded in extension for signature verification.
 */

// Platform public key (PEM format)
const PLATFORM_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0lhVVfyrAEYatT0rEYLf
gIj0+jnowMeK3ihZ2gKJuQ88d8p97picXJyD8XbTNJSQChjo8ndKKqtSTSzvHxYS
OH12ovtuZm3ueCGXUHIQa9Wk7/KasS3rfKi3E7oCDx7gvLSHMPoPMcXKxyOYqqdU
MxRT4nnKFwYvsCbNL4HFWvjeKJAmEW8p5HiaJDDjcMOJvsSBrHOtdCUhXy557YxU
n/iLGes74zOxDYVU/2sg+4AVsTGzwyJmQ7cRt2RsNNNp6lHId7aEJ0HQovFL76Hr
AImJECOtygU2zXP+N8oUqhP6VO+VrRjjdycu3Wu9n8J5WTkNi+x1ZK0PaYnV5vsi
nQIDAQAB
-----END PUBLIC KEY-----`;

class CryptoVerifier {
  constructor() {
    this.publicKey = null;
  }

  /**
   * Initialize by importing the platform public key
   */
  async init() {
    if (this.publicKey) return;

    try {
      // Convert PEM to ArrayBuffer
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';
      const pemContents = PLATFORM_PUBLIC_KEY_PEM
        .replace(pemHeader, '')
        .replace(pemFooter, '')
        .replace(/\s/g, '');

      const binaryDer = this.base64ToArrayBuffer(pemContents);

      // Import the key
      this.publicKey = await crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        true,
        ['verify']
      );
    } catch (error) {
      console.error('[CryptoVerifier] Failed to import public key:', error);
      throw error;
    }
  }

  /**
   * Calculate SHA256 hash of WASM bytes
   */
  async calculateHash(wasmBytes) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', wasmBytes);
    return this.arrayBufferToHex(hashBuffer);
  }

  /**
   * Verify agent signature
   */
  async verifySignature(wasmBytes, signatureBase64) {
    if (!this.publicKey) await this.init();

    try {
      // Decode signature from base64
      const signature = this.base64ToArrayBuffer(signatureBase64);

      // Verify signature
      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        this.publicKey,
        signature,
        wasmBytes
      );

      return isValid;
    } catch (error) {
      console.error('[CryptoVerifier] Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Verify agent integrity (hash + signature)
   */
  async verifyAgent(wasmBytes, profile) {
    // Check if profile has required fields
    if (!profile.hash || !profile.signature) {
      console.error('[CryptoVerifier] Profile missing hash or signature');
      return {
        valid: false,
        reason: 'Profile missing hash or signature'
      };
    }

    // Verify hash
    const calculatedHash = await this.calculateHash(wasmBytes);
    console.log('[CryptoVerifier] Hash verification:', {
      agentId: profile.agentId,
      calculated: calculatedHash,
      expected: profile.hash,
      match: calculatedHash === profile.hash,
      wasmSize: wasmBytes.byteLength
    });
    if (calculatedHash !== profile.hash) {
      console.error('[CryptoVerifier] Hash mismatch - calculated:', calculatedHash, 'expected:', profile.hash);
      return {
        valid: false,
        reason: 'Hash mismatch - agent may be tampered'
      };
    }

    // Verify signature
    const signatureValid = await this.verifySignature(wasmBytes, profile.signature);
    if (!signatureValid) {
      console.error('[CryptoVerifier] Invalid signature');
      return {
        valid: false,
        reason: 'Invalid signature - agent not signed by platform'
      };
    }

    // Check expiration if present
    if (profile.expiresAt && Date.now() > profile.expiresAt) {
      console.error('[CryptoVerifier] Agent expired');
      return {
        valid: false,
        reason: 'Agent signature expired'
      };
    }

    // TODO: Check revocation list

    return {
      valid: true,
      reason: 'Agent verified successfully'
    };
  }

  /**
   * Check if agent is revoked
   */
  async checkRevocation(agentId, version) {
    // TODO: Implement revocation list check
    // This should query the backend API for revoked agents

    try {
      // Placeholder for revocation check
      // const response = await fetch(
      //   `https://mcp-server.company.com/api/revocation/check?agentId=${agentId}&version=${version}`
      // );
      // const data = await response.json();
      // return data.revoked;

      return false; // Not revoked
    } catch (error) {
      console.error('[CryptoVerifier] Revocation check failed:', error);
      // Fail open or closed? For security, fail closed
      return true; // Treat as revoked if check fails
    }
  }

  /**
   * Helper: Convert base64 to ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Helper: Convert ArrayBuffer to hex string
   */
  arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Helper: Convert ArrayBuffer to base64
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

// Singleton instance
const cryptoVerifier = new CryptoVerifier();


// ============================================================================
// lib/permission-mediator.js
// ============================================================================

/**
 * Permission Mediator
 *
 * Enforces agent permission profiles by creating restricted API objects
 * and passing only approved APIs to WASM via the import object.
 */

class PermissionMediator {
  constructor(profile, userGrants) {
    this.profile = profile;
    this.userGrants = userGrants || {};
    this.denialLog = [];
  }

  /**
   * Check if agent has a specific permission
   */
  hasPermission(permission) {
    const declared = this.profile.permissions.required.includes(permission) ||
                     (this.profile.permissions.optional &&
                      this.profile.permissions.optional.includes(permission));

    const granted = this.userGrants[permission] === true;

    return declared && granted;
  }

  /**
   * Log permission denial for audit
   */
  logDenial(permission, context = {}) {
    const denial = {
      agentId: this.profile.agentId,
      permission,
      timestamp: Date.now(),
      context
    };

    this.denialLog.push(denial);
    console.warn(`[PermissionMediator] Denied: ${this.profile.agentId} attempted ${permission}`);

    // TODO: Send to backend audit API
  }

  /**
   * Create restricted API object based on granted permissions
   */
  createRestrictedAPI() {
    const api = {};

    // Console logging
    if (this.hasPermission('console.log')) {
      api.log = (message) => {
        console.log(`[${this.profile.agentId}]`, message);
      };
    } else {
      api.log = () => {
        this.logDenial('console.log');
      };
    }

    // Page read access
    if (this.hasPermission('page.read')) {
      api.querySelector = (selector) => {
        try {
          const element = document.querySelector(selector);

          // Enforce read-only if specified
          if (this.profile.capabilities.domAccess === 'read-only') {
            return this.createReadOnlyProxy(element);
          }

          return element;
        } catch (error) {
          console.error(`[${this.profile.agentId}] querySelector error:`, error);
          return null;
        }
      };

      api.querySelectorAll = (selector) => {
        try {
          const elements = document.querySelectorAll(selector);

          if (this.profile.capabilities.domAccess === 'read-only') {
            return Array.from(elements).map(el => this.createReadOnlyProxy(el));
          }

          return Array.from(elements);
        } catch (error) {
          console.error(`[${this.profile.agentId}] querySelectorAll error:`, error);
          return [];
        }
      };

      api.getPageText = () => {
        return document.body.innerText;
      };
    } else {
      api.querySelector = () => { this.logDenial('page.read'); return null; };
      api.querySelectorAll = () => { this.logDenial('page.read'); return []; };
      api.getPageText = () => { this.logDenial('page.read'); return ''; };
    }

    // Page write access
    if (this.hasPermission('page.write') &&
        this.profile.capabilities.domAccess !== 'read-only') {
      api.setElementText = (selector, text) => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            element.textContent = text;
            return true;
          }
          return false;
        } catch (error) {
          console.error(`[${this.profile.agentId}] setElementText error:`, error);
          return false;
        }
      };
    } else {
      api.setElementText = () => { this.logDenial('page.write'); return false; };
    }

    // Clipboard write
    if (this.hasPermission('clipboard.write')) {
      api.writeToClipboard = async (text) => {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (error) {
          console.error(`[${this.profile.agentId}] clipboard write error:`, error);
          return false;
        }
      };
    } else {
      api.writeToClipboard = () => { this.logDenial('clipboard.write'); return Promise.resolve(false); };
    }

    // Clipboard read
    if (this.hasPermission('clipboard.read')) {
      api.readFromClipboard = async () => {
        try {
          return await navigator.clipboard.readText();
        } catch (error) {
          console.error(`[${this.profile.agentId}] clipboard read error:`, error);
          return '';
        }
      };
    } else {
      api.readFromClipboard = () => { this.logDenial('clipboard.read'); return Promise.resolve(''); };
    }

    // Network access
    if (this.hasPermission('network.fetch') && this.profile.capabilities.networkAccess) {
      api.fetch = async (url, options) => {
        // Check allowedHosts ACL if specified
        if (this.profile.capabilities.allowedHosts) {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname;

          const allowed = this.profile.capabilities.allowedHosts.some(allowedHost => {
            // Exact match or subdomain match
            return hostname === allowedHost || hostname.endsWith('.' + allowedHost);
          });

          if (!allowed) {
            this.logDenial('network.fetch', { url, reason: 'Host not in allowedHosts' });
            return Promise.resolve('[Permission denied: host not in allowedHosts]');
          }
        }

        try {
          // Proxy through service worker - content scripts are CORS-restricted
          // Service worker validates against agent profile (default DENY ALL)
          const response = await chrome.runtime.sendMessage({
            type: 'network-fetch',
            url,
            options,
            agentId: this.profile.agentId
          });

          if (!response.success) {
            throw new Error(response.error || 'Fetch failed');
          }

          return response.data;
        } catch (error) {
          console.error(`[${this.profile.agentId}] fetch error:`, error);
          return `[Fetch error: ${error.message}]`;
        }
      };
    } else {
      api.fetch = (url) => {
        this.logDenial('network.fetch', { url, reason: 'networkAccess disabled or permission not granted' });
        return Promise.resolve('[Permission denied: network.fetch]');
      };
    }

    // Notifications
    if (this.hasPermission('notifications')) {
      api.showNotification = (title, options) => {
        try {
          new Notification(title, options);
          return true;
        } catch (error) {
          console.error(`[${this.profile.agentId}] notification error:`, error);
          return false;
        }
      };
    } else {
      api.showNotification = () => { this.logDenial('notifications'); return false; };
    }

    return api;
  }

  /**
   * Create read-only proxy for DOM elements
   */
  createReadOnlyProxy(element) {
    if (!element) return null;

    return new Proxy(element, {
      set(target, property, value) {
        console.warn(`[PermissionMediator] Blocked write to ${property} (read-only mode)`);
        return false;
      },

      get(target, property) {
        const value = target[property];

        // Allow reading properties
        if (typeof value === 'function') {
          // Block mutating methods
          const mutatingMethods = ['appendChild', 'removeChild', 'replaceChild',
                                   'insertBefore', 'remove', 'setAttribute',
                                   'removeAttribute', 'addEventListener'];

          if (mutatingMethods.includes(property)) {
            return () => {
              console.warn(`[PermissionMediator] Blocked call to ${property} (read-only mode)`);
            };
          }

          return value.bind(target);
        }

        return value;
      }
    });
  }

  /**
   * Get denial log for audit
   */
  getDenialLog() {
    return this.denialLog;
  }
}


// ============================================================================
// lib/wasm-executor.js
// ============================================================================

/**
 * WASM Executor
 *
 * Handles WASM instantiation and execution with timeout and memory limits.
 * Creates restricted import objects based on permission mediator.
 */


class WasmExecutor {
  constructor(profile, userGrants) {
    this.profile = profile;
    this.userGrants = userGrants;
    this.mediator = new PermissionMediator(profile, userGrants);
    this.instance = null;
  }

  /**
   * Load and instantiate WASM module
   */
  async loadModule(wasmBytes) {
    try {
      // Create import object with restricted APIs
      const imports = this.createImportObject();

      // Instantiate WASM module
      const result = await WebAssembly.instantiate(wasmBytes, imports);

      this.instance = result.instance;

      console.log(`[WasmExecutor] Loaded agent: ${this.profile.agentId}`);

      return this.instance;
    } catch (error) {
      console.error(`[WasmExecutor] Failed to load module:`, error);
      throw error;
    }
  }

  /**
   * Execute WASM function with timeout
   */
  async execute(functionName = 'main', args = []) {
    if (!this.instance) {
      throw new Error('WASM module not loaded');
    }

    const timeout = this.profile.capabilities.executionTimeout || 5000;

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(
        () => this.instance.exports[functionName](...args),
        timeout
      );

      console.log(`[WasmExecutor] Execution completed: ${this.profile.agentId}.${functionName}`);

      return result;
    } catch (error) {
      console.error(`[WasmExecutor] Execution failed:`, error);
      throw error;
    }
  }

  /**
   * Create import object with restricted APIs
   */
  createImportObject() {
    const restrictedAPI = this.mediator.createRestrictedAPI();

    // Calculate maximum memory pages (1 page = 64KB)
    const maxMemory = this.profile.capabilities.maxMemory || 52428800; // 50MB default
    const maxPages = Math.floor(maxMemory / 65536);

    const imports = {
      env: {
        // Memory with limits
        memory: new WebAssembly.Memory({
          initial: 256,    // 16MB initial
          maximum: maxPages
        }),

        // Console API
        log: restrictedAPI.log,

        // Page read/write APIs
        querySelector: this.wrapAsync(restrictedAPI.querySelector),
        querySelectorAll: this.wrapAsync(restrictedAPI.querySelectorAll),
        getPageText: this.wrapAsync(restrictedAPI.getPageText),
        setElementText: this.wrapAsync(restrictedAPI.setElementText),

        // Clipboard APIs
        writeToClipboard: this.wrapAsync(restrictedAPI.writeToClipboard),
        readFromClipboard: this.wrapAsync(restrictedAPI.readFromClipboard),

        // Network APIs
        fetch: this.wrapAsync(restrictedAPI.fetch),

        // Notifications
        showNotification: restrictedAPI.showNotification,

        // Utility functions
        abort: (message) => {
          console.error(`[WasmExecutor] Agent aborted: ${message}`);
          throw new Error(`Agent aborted: ${message}`);
        }
      },

      // For Pyodide and other complex WASM modules
      js: {
        // Expose restricted API to JavaScript-like interface
        ...restrictedAPI
      }
    };

    return imports;
  }

  /**
   * Wrap async functions for WASM compatibility
   */
  wrapAsync(fn) {
    if (!fn) return () => {};

    // For WASM, we can't directly return promises
    // The agent needs to handle async via callbacks or polling
    return (...args) => {
      const result = fn(...args);

      // If it's a promise, handle it
      if (result instanceof Promise) {
        // Store promise for later retrieval
        // WASM agent can poll for result
        return result;
      }

      return result;
    };
  }

  /**
   * Execute function with timeout
   */
  async executeWithTimeout(fn, timeout) {
    return Promise.race([
      Promise.resolve(fn()),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Execution timeout after ${timeout}ms`)), timeout)
      )
    ]);
  }

  /**
   * Get permission denial log from mediator
   */
  getDenialLog() {
    return this.mediator.getDenialLog();
  }

  /**
   * Cleanup
   */
  destroy() {
    this.instance = null;
    this.mediator = null;
  }
}

/**
 * Execute Pyodide-specific agent
 */
class PyodideExecutor extends WasmExecutor {
  constructor(profile, userGrants) {
    super(profile, userGrants);
    this.pyodide = null;
  }

  /**
   * Load Pyodide WASM module
   */
  async loadModule(wasmBytes) {
    try {
      // For Pyodide, we need special loading
      // Pyodide expects to be loaded via its loader script

      console.log(`[PyodideExecutor] Loading Pyodide for agent: ${this.profile.agentId}`);

      // Create import object
      const imports = this.createImportObject();

      // Load Pyodide
      // Note: In production, we'd load from CDN or bundled files
      // For now, we'll assume loadPyodide is available globally
      if (typeof loadPyodide === 'undefined') {
        throw new Error('Pyodide loader not available');
      }

      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });

      // Inject restricted API into Python environment
      this.injectAPIs(imports.env);

      console.log(`[PyodideExecutor] Pyodide loaded successfully`);

      return this.pyodide;
    } catch (error) {
      console.error(`[PyodideExecutor] Failed to load Pyodide:`, error);
      throw error;
    }
  }

  /**
   * Inject restricted APIs into Python environment
   */
  injectAPIs(apis) {
    // Create JavaScript objects accessible from Python
    this.pyodide.globals.set('restricted_api', apis);
    this.pyodide.globals.set('agent_id', this.profile.agentId);
  }

  /**
   * Execute Python code
   */
  async executePython(code) {
    if (!this.pyodide) {
      throw new Error('Pyodide not loaded');
    }

    const timeout = this.profile.capabilities.executionTimeout || 30000;

    try {
      const result = await this.executeWithTimeout(
        () => this.pyodide.runPythonAsync(code),
        timeout
      );

      console.log(`[PyodideExecutor] Python execution completed`);

      return result;
    } catch (error) {
      console.error(`[PyodideExecutor] Python execution failed:`, error);
      throw error;
    }
  }

  /**
   * Execute Python file
   */
  async executePythonFile(filename, filesystem) {
    if (!this.pyodide) {
      throw new Error('Pyodide not loaded');
    }

    // Mount filesystem if provided
    if (filesystem) {
      for (const [path, content] of Object.entries(filesystem)) {
        this.pyodide.FS.writeFile(path, content);
      }
    }

    // Run the file
    return this.executePython(`
      with open('${filename}', 'r') as f:
        exec(f.read())
    `);
  }
}


// ============================================================================
// content/content-script.js
// ============================================================================

/**
 * Content Script
 *
 * Executes in page context to:
 * - Receive agent execution requests from service worker
 * - Load WASM from IndexedDB
 * - Instantiate and execute agents with restricted APIs
 * - Return results to service worker
 */




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


