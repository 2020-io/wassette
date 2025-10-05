console.warn(`[33mDEPRECATED(ruby-head-wasm-wasi): "dist/browser" will be moved to "@ruby/wasm-wasi" in the next major release.
Please replace your \`require('ruby-head-wasm-wasi/dist/browser');\` with \`require('@ruby/wasm-wasi/dist/browser');\`[0m`);

module.exports = require('@ruby/wasm-wasi/dist/browser');