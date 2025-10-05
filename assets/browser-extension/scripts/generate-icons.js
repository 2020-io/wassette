#!/usr/bin/env node

/**
 * Generate PNG icons from base64 data URIs
 * Since we don't have image processing libraries, we create simple colored PNGs
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'extension', 'icons');

// Minimal valid PNG file (1x1 purple pixel)
// This is a base64-encoded PNG that browsers will accept
const PNG_SIZES = {
  16: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAE0lEQVR42mNk+P+fgYGBgYEOAAAAUgAf8KqRBgAAAABJRU5ErkJggg==',
  48: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAOklEQVR42u3QMQEAAAjDMMC/5+ECvp0JEhVBR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR39oAH0HAwJBOEVyAAAAAElFTkSuQmCC',
  128: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAk0lEQVR42u3QMQEAAAjDMMC/5+ECvp0JEhVBR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0cjQAFhh1QCrDZzhAAAAABJRU5ErkJggg=='
};

console.log('Generating extension icons...');

for (const [size, base64] of Object.entries(PNG_SIZES)) {
  const filename = `icon${size}.png`;
  const filepath = path.join(ICONS_DIR, filename);

  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filepath, buffer);

  console.log(`Created: ${filename} (${buffer.length} bytes)`);
}

console.log('Done! Icons generated successfully.');
