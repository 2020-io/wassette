#!/usr/bin/env bash

SCRIPT_DIR=`dirname $0`
pushd "$SCRIPT_DIR" > /dev/null
SCRIPT_DIR=`pwd`
popd > /dev/null
echo SCRIPT_DIR=$SCRIPT_DIR

PYTHON_FILE="${SCRIPT_DIR}/cors_http_server.py"
echo PYTHON_FILE=$PYTHON_FILE

if [ $# -gt 1 ]
then
   ASSETS="$1"
   shift
else
   ASSETS="${SCRIPT_DIR}/../assets"
   echo "Using default assets directory \"${ASSETS}\""
fi

if [ -d "${ASSETS}/" ]
then 
  echo Serving assets in "${ASSETS}"
else
  echo "Assets directory \"${ASSETS}\" does not exist"
  echo "Serving assets in current directory"
  ASSETS=.
fi

ARGS=8080
# ARGS=-d "${ASSETS}"
# ARGS="$ARGS --protocol=HTTP/1.0"
# ARGS="$ARGS --bind=127.0.0.1"
# ARGS="$ARGS 8080"
# echo -> python -m http.server $ARGS
# python -m http.server %ARGS%
echo "-> python \"${PYTHON_FILE}\" $ARGS"
pushd "${ASSETS}"
ASSETS=%`pwd`
echo Running "{$PYTHON_FILE}" from "${ASSETS}"
call python "${PYTHON_FILE}" $ARGS
set ret=$?
popd
echo -e "<- python returned ${ret}\n"

exit $ret
