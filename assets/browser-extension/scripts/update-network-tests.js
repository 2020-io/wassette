#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', 'backend', 'agents');
const scriptPath = path.join(AGENTS_DIR, 'network-test-script.py');
const script = fs.readFileSync(scriptPath, 'utf8');

const agents = ['network-test-blocked', 'network-test-restricted', 'network-test-open'];

for (const agentId of agents) {
  const profilePath = path.join(AGENTS_DIR, agentId, '1.0.0', 'profile.json');
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

  profile.defaultCode = script;

  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  console.log(`Updated ${agentId}`);
}

console.log('All profiles updated with new test script');
