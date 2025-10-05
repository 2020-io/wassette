#!/usr/bin/env node

/**
 * Agent Signing Script
 *
 * Signs WASM agents with platform private key
 * Usage: node sign-agent.js <agent-id>
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEYS_DIR = path.join(__dirname, '..', 'keys');
const AGENTS_DIR = path.join(__dirname, '..', 'backend', 'agents');

async function signAgent(agentId) {
  console.log(`Signing agent: ${agentId}`);

  const agentDir = path.join(AGENTS_DIR, agentId, '1.0.0');
  const profilePath = path.join(agentDir, 'profile.json');
  const privateKeyPath = path.join(KEYS_DIR, 'platform-private-key.pem');

  // Check if agent exists
  if (!fs.existsSync(agentDir)) {
    throw new Error(`Agent directory not found: ${agentDir}`);
  }

  // Read profile
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile not found: ${profilePath}`);
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

  // For Pyodide agents, we create a placeholder WASM file
  // In production, this would be the actual WASM binary
  const wasmPath = path.join(agentDir, 'agent.wasm');

  let wasmBytes;
  if (!fs.existsSync(wasmPath)) {
    console.log('Creating placeholder WASM file for Pyodide agent');
    // Create a minimal valid WASM module
    wasmBytes = Buffer.from([
      0x00, 0x61, 0x73, 0x6d, // magic number
      0x01, 0x00, 0x00, 0x00  // version
    ]);
    fs.writeFileSync(wasmPath, wasmBytes);
  } else {
    wasmBytes = fs.readFileSync(wasmPath);
  }

  // Calculate SHA256 hash
  const hash = crypto.createHash('sha256').update(wasmBytes).digest('hex');
  console.log(`Hash: ${hash}`);

  // Read private key
  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`Private key not found: ${privateKeyPath}`);
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  // Sign the WASM bytes
  const sign = crypto.createSign('SHA256');
  sign.update(wasmBytes);
  sign.end();

  const signature = sign.sign(privateKey, 'base64');
  console.log(`Signature: ${signature.substring(0, 50)}...`);

  // Update profile
  profile.hash = hash;
  profile.signature = signature;

  // Write updated profile
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));

  console.log(`Agent signed successfully: ${agentId}`);
  console.log(`Profile updated: ${profilePath}`);
}

// Main
const agentId = process.argv[2];

if (!agentId) {
  console.error('Usage: node sign-agent.js <agent-id>');
  process.exit(1);
}

signAgent(agentId)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
