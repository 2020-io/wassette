#!/usr/bin/env bash

if [ $# -gt 0 ]
then
  URL="$1"
  shift
else
  #URL="http://127.0.1.1:9001/mcp" # running on host
  URL="http://localhost:9001/mcp"
fi

JSON_RPC_DATA=

echo "MCP server @ $URL"
curl --insecure --verbose -H "Content-Type: application/json" -d '{
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
