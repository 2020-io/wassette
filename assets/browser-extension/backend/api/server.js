/**
 * MCP Backend API Server
 *
 * Serves agent catalog, profiles, and handles installation requests
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Version info
app.get('/api/version', (req, res) => {
  res.json({
    extensionVersion: {
      current: '1.0.0',
      minimum: '1.0.0'
    },
    apiVersion: '1.0.0',
    serverTime: Date.now()
  });
});

// List available agents
app.get('/api/agents', (req, res) => {
  const agents = [
    {
      agentId: 'pyodide-test',
      name: 'Pyodide Test Agent',
      version: '1.0.0',
      description: 'Test agent using Pyodide runtime for infrastructure validation',
      runtime: 'pyodide',
      author: 'MCP Platform',
      category: 'testing',
      permissions: {
        required: ['page.read', 'console.log'],
        optional: ['clipboard.write']
      },
      size: 8,
      publishedAt: '2025-10-02T00:00:00Z',
      downloads: 0
    },
    {
      agentId: 'network-test-blocked',
      name: 'Network Test - No Network Access',
      version: '1.0.0',
      description: 'Tests network access with networkAccess: false - both requests should fail',
      runtime: 'pyodide',
      author: 'MCP Platform',
      category: 'testing',
      permissions: {
        required: ['console.log'],
        optional: []
      },
      size: 8,
      publishedAt: '2025-10-02T00:00:00Z',
      downloads: 0
    },
    {
      agentId: 'network-test-restricted',
      name: 'Network Test - Yahoo Blocked',
      version: '1.0.0',
      description: 'Tests network access with ACL - only google.com allowed, yahoo.com blocked',
      runtime: 'pyodide',
      author: 'MCP Platform',
      category: 'testing',
      permissions: {
        required: ['console.log', 'network.fetch'],
        optional: []
      },
      size: 8,
      publishedAt: '2025-10-02T00:00:00Z',
      downloads: 0
    },
    {
      agentId: 'network-test-open',
      name: 'Network Test - Full Network Access',
      version: '1.0.0',
      description: 'Tests google.com and yahoo.com with full networkAccess - both should succeed',
      runtime: 'pyodide',
      author: 'MCP Platform',
      category: 'testing',
      permissions: {
        required: ['console.log', 'network.fetch'],
        optional: []
      },
      size: 8,
      publishedAt: '2025-10-02T00:00:00Z',
      downloads: 0
    }
  ];

  res.json({
    success: true,
    agents,
    total: agents.length
  });
});

// Get agent details
app.get('/api/agents/:id', (req, res) => {
  const { id } = req.params;

  const profilePath = path.join(__dirname, '../agents', id, '1.0.0', 'profile.json');

  if (!fs.existsSync(profilePath)) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

  res.json({
    success: true,
    agent: profile
  });
});

// Download agent profile
app.get('/agents/:id/:version/profile.json', (req, res) => {
  const { id, version } = req.params;

  const profilePath = path.join(__dirname, '../agents', id, version, 'profile.json');

  if (!fs.existsSync(profilePath)) {
    return res.status(404).send('Profile not found');
  }

  res.sendFile(profilePath);
});

// Download agent WASM
app.get('/agents/:id/:version/agent.wasm', (req, res) => {
  const { id, version } = req.params;

  const wasmPath = path.join(__dirname, '../agents', id, version, 'agent.wasm');

  if (!fs.existsSync(wasmPath)) {
    return res.status(404).send('WASM file not found');
  }

  res.setHeader('Content-Type', 'application/wasm');
  res.sendFile(wasmPath);
});

// Analytics endpoint (stub)
app.post('/api/analytics/usage', (req, res) => {
  console.log('Analytics:', req.body);
  res.json({ success: true });
});

// Audit log endpoint (stub)
app.post('/api/audit/log', (req, res) => {
  console.log('Audit:', req.body);
  res.json({ success: true });
});

// Revocation check endpoint
app.get('/api/revocation/check', (req, res) => {
  const { agentId, version } = req.query;

  // For now, no agents are revoked
  res.json({
    success: true,
    revoked: false,
    agentId,
    version
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('==========================================');
  console.log('  MCP Backend API Server');
  console.log('==========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`API endpoint: http://0.0.0.0:${PORT}/api/agents`);
  console.log('==========================================');
});
