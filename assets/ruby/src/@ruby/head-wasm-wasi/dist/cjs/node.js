console.warn(`[33mDEPRECATED(ruby-head-wasm-wasi): "dist/node" will be moved to "@ruby/wasm-wasi" in the next major release.
Please replace your \`require('ruby-head-wasm-wasi/dist/node');\` with \`require('@ruby/wasm-wasi/dist/node');\`[0m`);

module.exports = require('@ruby/wasm-wasi/dist/node');