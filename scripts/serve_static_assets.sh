#!/usr/bin/env bash

DIR=`pwd`
echo "Running in: ${DIR}"
PROJECT_ROOT=`dirname $0`/..
echo "* Project root: ${PROJECT_ROOT}"
pushd "${PROJECT_ROOT}" > /dev/null
PROJECT_ROOT=`pwd`
popd > /dev/null
echo "Project root: ${PROJECT_ROOT}"

pushd "${PROJECT_ROOT}/assets" >/dev/null
dos2unix *.html *.js 2>/dev/null

ARGS="-d ."
#ARGS="$ARGS --protocol=HTTP/1.0"
ARGS="$ARGS --bind=127.0.0.1"
#ARGS="$ARGS 8080"

#python -m http.server -d assets
echo "-> python -m http.server $ARGS"
python -m http.server $ARGS
ret=$?
echo "<- python returned $ret"

popd >/dev/null
exit $ret
