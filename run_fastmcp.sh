#!/usr/bin/env bash

if [ -z `which fastmcp` ]
then
  echo "-> pip install fastmcp" > /dev/stderr
  pip install fastmcp
  echo -e "<- pip install fastmcp returned $err\n" > /dev/stderr

  echo "-> pip install httpx" > /dev/stderr
  pip install httpx
  err=$?
  echo -e "<- pip install http returned $err\n" > /dev/stderr

  echo "-> pip install asyncio" > /dev/stderr
  pip install asyncio
  err=$?
  echo -e "<- pip install fastmcp returned $err\n" > /dev/stderr
fi

FASTMCP_FILE=echo.py

if [ "$1" == "dev" ]
then
  FASTMCP_ARGS="dev --python=3.13 --server-spec=wasmagents.py" # "--server-spec=wasmagents.fastmcp.json:wasmagents.py"
  shift
elif [ "$1" == "debug" ]
then
  FASTMCP_ARGS="run --log-level=DEBUG --python=3.13"
  shift
else
  FASTMCP_ARGS="run --no-banner --python=3.13"
fi

if [ "$FASTMCP_ARGS" == "dev" ]
then
  echo "Running in dev mode"
elif [ "$1" == "stdio" ]
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

fastmcp inspect --python=3.13 --server-spec=wasmagents.py # --server-spec="wasmagents.fastmcp.json:wasmagents.py"

echo "-> fastmcp $FASTMCP_ARGS \"$FASTMCP_FILE\"" > /dev/stderr
fastmcp $FASTMCP_ARGS "$FASTMCP_FILE"
err=$?
echo "<- fastmcp returned $err" > /dev/stderr
