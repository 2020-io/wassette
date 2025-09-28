#!/usr/bin/env bash

DIR=`pwd`
echo "* Running in: ${DIR}"
PROJECT_ROOT=`dirname $0`/..
echo "* Project root: ${PROJECT_ROOT}"
pushd "${PROJECT_ROOT}" > /dev/null
PROJECT_ROOT=`pwd`
popd > /dev/null
echo "* Project root: ${PROJECT_ROOT}"

ARGS--python=3.13
REQUIREMENTS=$PROJECT_ROOT/pyproject.toml
SERVER_SPEC=$PROJECT_ROOT/assets/fastmcp/wasmagents.fastmcp.json

if [ ! -f "$REQUIREMENTS" ]
then
	echo "Missing requirements file \"$REQUIREMENTS\""
	exit 1
fi
if [ ! -f "$SERVER_SPEC" ]
then
	echo "Missing server spec file \"$SERVER_SPEC\""
	exit 1
fi

ARGS=$ARGS --with-requirements="$REQUIREMENTS" --server-spec="$SERVER_SPEC"
echo "-> fastmcp install mcp-json $ARGS"
fastmcp install mcp-json $ARGS
err=$?
echo "<- fastmcp install mcp-json returned $err"

exit $err
