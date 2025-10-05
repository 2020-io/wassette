console.warn(`[33mDEPRECATED(ruby-head-wasm-wasi): "dist/browser.script" will be moved to "@ruby/wasm-wasi" in the next major release.
Please replace your \`require('ruby-head-wasm-wasi/dist/browser.script');\` with \`require('@ruby/wasm-wasi/dist/browser.script');\`[0m`);

module.exports = require('@ruby/wasm-wasi/dist/browser.script');