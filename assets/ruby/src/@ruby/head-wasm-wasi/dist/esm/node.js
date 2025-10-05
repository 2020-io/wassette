console.warn(`[33mDEPRECATED(ruby-head-wasm-wasi): "dist/node" will be moved to "@ruby/wasm-wasi" in the next major release.
Please replace your \`import * from 'ruby-head-wasm-wasi/dist/node';\` with \`import * from '@ruby/wasm-wasi/dist/node';\`[0m`);

export * from '@ruby/wasm-wasi/dist/node';