#!/usr/bin/env bash

if [ "$1" == "debug" ]
then
  CURL_ARGS="--insecure --verbose"
  shift
else
  CURL_ARGS="--insecure"
fi

if [ $# -gt 0 ]
then
  URL="$1"
  shift
else
  URL="http://localhost:8000/mcp" # fastmcp
  #URL="http://localhost:9001/mcp" # wassette
fi

JSON_RPC_DATA=

echo "MCP server @ $URL"
curl $CURL_ARGS \
-H "Content-Type: application/json" \
-H "Accept: application/json, text/event-stream" \
-d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {}
    },
    "clientInfo": {
      "name": "wasmagent-client",
      "version": "1.0.0"
    }
  }
}' "$URL"

err=$?
echo "curl returned $err"

exit $err
