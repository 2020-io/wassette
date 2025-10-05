#!/usr/bin/env node

/**
 * Build Content Script Bundle
 *
 * Combines all library modules and content script into a single bundle
 * without ES6 imports/exports (content scripts don't support modules)
 */

const fs = require('fs');
const path = require('path');

const extensionDir = path.join(__dirname, '..', 'extension');

const files = [
  'lib/agent-storage.js',
  'lib/crypto-verify.js',
  'lib/permission-mediator.js',
  'lib/wasm-executor.js',
  'content/content-script.js'
];

console.log('Building content script bundle...');

let bundle = `/**
 * Content Script Bundle
 *
 * Combined bundle of all dependencies since content scripts don't support ES modules
 */

`;

for (const file of files) {
  console.log(`  Adding: ${file}`);

  const filePath = path.join(extensionDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove export statements
  content = content.replace(/^export\s+(class|const|function|let|var)/gm, '$1');
  content = content.replace(/^export\s+\{[^}]+\};?/gm, '');

  // Remove import statements
  content = content.replace(/^import\s+.+from\s+.+;?\s*$/gm, '');

  // Add section header
  bundle += `// ============================================================================\n`;
  bundle += `// ${file}\n`;
  bundle += `// ============================================================================\n\n`;
  bundle += content;
  bundle += '\n\n';
}

const outputPath = path.join(extensionDir, 'content', 'content-script-bundle.js');
fs.writeFileSync(outputPath, bundle);

console.log(`Bundle created: ${outputPath}`);
console.log(`Bundle size: ${(bundle.length / 1024).toFixed(2)} KB`);
