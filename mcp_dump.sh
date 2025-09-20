#!/usr/bin/env bash

if [ $# -gt 0 ]
then
  URL="$1"
  shift
else
  URL="http://localhost:9001"
fi

echo "MCP server @ $URL"
curl --insecure --verbose "$URL"
err=$?
echo "curl returned $err"

exit $err
