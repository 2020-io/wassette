#!/usr/bin/env bash

echo "-> wassette serve --stdio" > /dev/stderr
json_rpc_response=`wassette serve --stdio`
err=$?
echo $json_rpc_response | jq
echo "<- wassette returned $err" > /dev/stderr

exit $err
