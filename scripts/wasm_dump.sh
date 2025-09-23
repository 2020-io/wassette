#!/usr/bin/env bash

# Debugger listening on ws://127.0.0.1:9229/a167690d-7caf-4f64-907c-1d02a2243fea
# https://nodejs.org/en/docs/inspector
# https://nodejs.org/en/learn/getting-started/debugging

NODE_DEBUG="*"
NODE_DEBUG_NATIVE="*"
unset NODE_DEBUG # NODE_PATH=`pwd`

#NODE_ARGS=""
NODE_ARGS="--inspect"
if [ "$1" == "debug" ]
then
  NODE_ARGS="$NODE_ARGS --inspect-brk"
  shift
fi

WASM_FILE=wasmagent.wasm
if [ $# -gt 0 ]
then
  WASM_FILE="$1"
  shift
fi
if [ ! -f "$WASM_FILE" ]
then
  echo "WASM file $WASM_FILE does not exist"
  exit 1
fi

WASMTOOLS_ARGS="--color=never -vvv"
wasm-tools validate $WASMTOOLS_ARGS "$WASM_FILE"
err=$?
if [ $err -ne 0 ]
then
  echo "wasm-tools valid \"$WASM_FILE\" returned $err"
  exit $err
fi
#wasm-tools parse $WASMTOOLS_ARGS -t "$WASM_FILE"
#wasm-tools print $WASMTOOLS_ARGS --print-offsets "$WASM_FILE"
wasm-tools objdump $WASMTOOLS_ARGS "$WASM_FILE"

echo "-> wasmtime run \"$WASM_FILE\""
wasmtime run "$WASM_FILE"
err=$?
echo "<- wasmtime returned $err"

exit $err
