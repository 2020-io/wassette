#!/usr/bin/env bash

# Debugger listening on ws://127.0.0.1:9229/a167690d-7caf-4f64-907c-1d02a2243fea
# https://nodejs.org/en/docs/inspector
# https://nodejs.org/en/learn/getting-started/debugging

#NODE_ARGS=""
NODE_ARGS="--inspect"
if [ "$1" == "debug" ]
then
  NODE_DEBUG="*"
  NODE_DEBUG_NATIVE="*"
  #NODE_ARGS="$NODE_ARGS --inspect-brk"
  shift
fi

NODEJS_FILE=""
if [ "$1" == "client" ]
then
  NODEJS_FILE=wasmagent_client.mjs
  shift
elif [ "$1" == "server" ]
then
  NODEJS_FILE=wasmagent_server.mjs
  shift
fi

if [ ! -f "$NODEJS_FILE" ]
then
  echo "Usage: $0 [debug] server [args]"
  echo "Usage: $0 [debug] client [args]"
  echo "Usage: $0 [debug] path_to_wasmagent.mjs [args]"
  exit 1
fi

echo "-> node $NODE_ARGS \"$NODEJS_FILE\" $*"
node $NODE_ARGS "$NODEJS_FILE" $*
echo "<- node returned $?"
