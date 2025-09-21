#!/usr/bin/env bash

if [ -z `which fastmcp` ]
then
  echo "-> pip install fastmcp" > /dev/stderr
  pip install fastmcp
  err=$?
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

#JSON_FILE=# fastmcp.json
JSON_FILE=wasmagents.fastmcp.json
FASTMCP_FILE=wasmagents.py
# --server-spec="wasmagents.fastmcp.json:${FASTMCP_FILE}"

rm -f inspect_output.*

which python
python --version
echo

echo "-> fastmcp inspect --server-spec=${FASTMCP_FILE} --format=mcp --output=inspect_output.mcp" > /dev/null
fastmcp inspect --python=3.11 --skip-env --server-spec=${FASTMCP_FILE} --format=mcp --output=inspect_output.mcp
#fastmcp inspect --skip-env --server-spec=${FASTMCP_FILE} --format=mcp --output=inspect_output.mcp
err=$?
ls -l inspect_output.mcp
echo -e "<- fastmcp inspect returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi
#more inspect_output.mcp
echo

echo "-> fastmcp inspect --server-spec=${FASTMCP_FILE} --format=fastmcp --output=inspect_output.fastmcp" > /dev/null
fastmcp inspect --python=3.11 --skip-env --server-spec=${FASTMCP_FILE} --format=fastmcp --output=inspect_output.fastmcp
#fastmcp inspect --skip-env --server-spec=${FASTMCP_FILE} --format=fastmcp --output=inspect_output.fastmcp
err=$?
ls -l inspect_output.fastmcp
echo -e "<- fastmcp inspect returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi
#more inspect_output.fastmcp
echo

DEV=0
if [ "$1" == "dev" ]
then
  DEV=1
  #FASTMCP_ARGS="dev --python=3.13 --server-spec=${FASTMCP_FILE}" # "--server-spec=${JSON_FILE}:${FASTMCP_FILE}"
  FASTMCP_ARGS="dev --server-spec=${FASTMCP_FILE}" # "--server-spec=${JSON_FILE}:${FASTMCP_FILE}"
  shift
elif [ "$1" == "debug" ]
then
  #FASTMCP_ARGS="run --log-level=DEBUG --python=3.13"
  FASTMCP_ARGS="run --log-level=DEBUG"
  shift
else
  #FASTMCP_ARGS="run --no-banner --python=3.13"
  FASTMCP_ARGS="run --no-banner"
fi
FASTMCP_ARGS="$FASTMCP_ARGS --skip-env --with-requirements=${ROOT}/requirements.txt"

if [ $DEV -eq 1 ]
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

echo "-> fastmcp $FASTMCP_ARGS \"$FASTMCP_FILE\"" > /dev/stderr
fastmcp $FASTMCP_ARGS "$FASTMCP_FILE"
err=$?
echo "<- fastmcp returned $err" > /dev/stderr
