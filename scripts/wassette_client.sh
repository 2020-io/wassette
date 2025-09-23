#!/usr/bin/env bash
echo "-> cat assets/fastmcp/mcp_initialize.json | ./run_wassette.sh stdio"
cat assets/fastmcp/mcp_initialize.json | ./run_wassette.sh stdio
err=$?
echo "<- run_wasset.sh returned $err"
exit $err
