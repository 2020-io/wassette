#!/usr/bin/env bash

if [ -z `which fastmcp` ]
then
  echo "-> pip install fastmcp" > /dev/stderr
  pip install fastmcp
  err=$?
  echo -e "<- fastmcp returned $err\n" > /dev/stderr
fi

FASTMCP_FILE=echo.py
FASTMCP_ARGS="run --no-banner"

if [ "$1" == "debug" ]
then
  FASTMCP_ARGS="$FASTMCP_ARGS --log-level=DEBUG"
  shift
fi

if [ "$1" == "stdio" ]
then
  FASTMCP_ARGS="$FASTMCP_ARGS --transport=stdio"
  shift
else
  FASTMCP_ARGS="$FASTMCP_ARGS --transport=streamable-http"
fi

if [ $# -gt 0 ]
then
  FASTMCP_FILE="$1"
  shift
fi

echo "-> fastmcp $FASTMCP_ARGS \"$FASTMCP_FILE\"" > /dev/stderr
fastmcp $FASTMCP_ARGS "$FASTMCP_FILE"
err=$?
echo "<- fastmcp returned $err" > /dev/stderr
