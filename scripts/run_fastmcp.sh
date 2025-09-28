#!/usr/bin/env bash

DIR=`pwd`
echo "Running in: ${DIR}"
PROJECT_ROOT=`dirname $0`/..
echo "* Project root: ${PROJECT_ROOT}"
pushd "${PROJECT_ROOT}" > /dev/null
PROJECT_ROOT=`pwd`
popd > /dev/null
echo "Project root: ${PROJECT_ROOT}"

UV_COMMON_ARGS="--python=3.13"

DEV=0
UV_RUN_ARGS=""
UVX_ARGS=""
if [ "$1" == "dev" ]
then
  echo "* In development mode"
  DEV=1
  RUN_ARGS="dev"
  #UV_COMMON_ARGS=""
  shift
elif [ "$1" == "debug" ]
then
  echo "* Debug logging"
  RUN_ARGS="run --log-level=DEBUG"
  #RUN_ARGS="$RUN_ARGS --skip-env"
  UV_RUN_ARGS="-v"
  UVX_ARGS="-v"
  shift
elif [ "$1" == "trace" ]
then
  echo "* Trace logging"
  RUN_ARGS="run --log-level=DEBUG" # fastmcp run only goes to DEBUG
  #RUN_ARGS="$RUN_ARGS --skip-env"
  UV_RUN_ARGS="-vvv"
  UVX_RUN_ARGS="-vvv"
  shift
else
  RUN_ARGS="run --no-banner"
  #RUN_ARGS="$RUN_ARGS --skip-env"
fi

# Check for the fastmcp files in the current directory or <project_root>/assets/fastmcp
# This path can be overriden by a program argument
JSON_FILE=wasmagents.fastmcp.json
if [ ! -f "$JSON_FILE" ]; then JSON_FILE="${PROJECT_ROOT}/assets/fastmcp/wasmagents.fastmcp.json"; fi
FASTMCP_FILE=wasmagents.py
if [ ! -f "$FASTMCP_FILE" ]; then FASTMCP_FILE="${PROJECT_ROOT}/assets/fastmcp/wasmagents.py"; fi

if [ $# -gt 0 ]
then
  JSON_FILE="$1"
  shift
fi

if [ -f "$FASTMCP_FILE" ]
then
  echo "FASTMCP_FILE=${FASTMCP_FILE}"
else
  echo "File \"${FASTMCP_FILE}\" does not exist"
  exit 1
fi

if [ -f "$JSON_FILE" ]
then
  echo "JSON_FILE=${JSON_FILE}"
else
  echo "File \"${JSON_FILE}\" does not exist"
  exit 2
fi

REQUIREMENTS_FILE="${PROJECT_ROOT}/requirements.txt"
if [ -f "${REQUIREMENTS_FILE}" ]
then
  UV_RUN_ARGS="--with-requirements=${REQUIREMENTS_FILE} ${UV_RUN_ARGS}"
  UVX_ARGS="--with-requirements=${REQUIREMENTS_FILE} ${UVX_RUN_ARGS}"
  FASTMCP_ARGS="--with-requirements=${REQUIREMENTS_FILE}"
else
  echo "No requirements file \"${REQUIREMENTS_FILE}\""
  FASTMCP_ARGS=""
fi

UV_RUN_ARGS="--no-cache --managed-python $UV_RUN_ARGS"
UVX_ARGS="--no-cache --managed-python $UVX_ARGS"

#echo UVX_ARGS="${UVX_ARGS}"
#echo UV_RUN_ARGS="${UV_RUN_ARGS}"
#echo RUN_ARGS="${RUN_ARGS}"
#echo FASTMCP_ARGS="${FASTMCP_ARGS}"

#############################################################################

NPX=`which npx`
echo "* npx path: ${NPX}"
NPX_DIR=`dirname "${NPX}"`
echo "* npx dir: ${NPX_DIR}"

NODE=`which node`
echo "* node path: ${NODE}"
NODE_DIR=`dirname "${NODE}"`
echo "* node dir: ${NODE_DIR}"

#############################################################################

VENV_DIR="${PROJECT_ROOT}/.venv"
VENV_FILE="${VENV_DIR}/bin/activate"
if [ ! -f "${VENV_FILE}" ]; then VENV_FILE="${VENV_DIR}/Scripts/activate"; fi

if [ -f "${VENV_FILE}" ]
then
  echo "Loading \"${VENV_FILE}\"" > /dev/stderr
  source "${VENV_FILE}"
  err=$?
  if [ $err -ne 0 ]; then exit $err; fi
else
	echo "No venv activate file found (skipping)" > /dev/stderr
fi

echo
echo "-> uv pip list ${UV_COMMON_ARGS}" > /dev/stderr
uv pip list ${UV_COMMON_ARGS}
err=$?
echo -e "<- uv pip list returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> pip list" > /dev/stderr
pip list
err=$?
echo -e "<- pip list returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

echo "-> python --version" > /dev/stderr
which python
python --version
err=$?
echo -e "<- python --version returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi
echo "$PATH" | awk -v RS=':' '1'
echo "-> uvx ${UVX_ARGS} ${UV_COMMON_ARGS} python --version" > /dev/stderr
uvx ${UVX_ARGS} ${UV_COMMON_ARGS} python --version
err=$?
echo -e "<- uvx python --version returned $err\n" > /dev/stderr
#if [ $err -ne 0 ]; then exit $err; fi

echo "-> uv run ${UV_RUN_ARGS} ${UV_COMMON_ARGS} python --version" > /dev/stderr
uv run ${UV_RUN_ARGS} ${UV_COMMON_ARGS} python --version < /dev/null
err=$?
echo -e "<- uv run python --version returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

SERVER_SPEC="${FASTMCP_FILE}"
#SERVER_SPEC="${FASTMCP_FILE}:${JSON_FILE}"
# No need to include --with-requirements=.../requirements.txt for fastmcp commands
FASTMCP_ARGS="--server-spec=${SERVER_SPEC}"

echo "FASTMCP_ARGS=${FASTMCP_ARGS}"

rm -f *mcp.out

OUTPUT_ARGS="--format=mcp --output=mcp.out"
echo "-> fastmcp inspect ${FASTMCP_ARGS} ${OUTPUT_ARGS} ${UV_COMMON_ARGS}" > /dev/null
fastmcp inspect ${FASTMCP_ARGS} ${OUTPUT_ARGS} ${UV_COMMON_ARGS} < /dev/null
err=$?
ls -l mcp.out
echo -e "<- fastmcp inspect returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi
#echo "*** mcp.out"
#cat mcp.out
#echo

OUTPUT_ARGS="--format=fastmcp --output=fastmcp.out"
echo "-> fastmcp inspect ${FASTMCP_ARGS} ${OUTPUT_ARGS} ${UV_COMMON_ARGS}" > /dev/null
fastmcp inspect ${FASTMCP_ARGS} ${OUTPUT_ARGS} ${UV_COMMON_ARGS} < /dev/null
err=$?
ls -l fastmcp.out
echo -e "<- fastmcp inspect returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi
#echo "*** fastmcp.out"
#cat fastmcp.out
#echo

###################################################################

if [ $DEV -eq 1 ]
then
  echo "Running in dev mode"
elif [ "$1" == "stdio" ]
then
  RUN_ARGS="${RUN_ARGS} --transport=stdio"
  shift
else
  RUN_ARGS="${RUN_ARGS} --transport=streamable-http --port=8080"
fi

if [ $DEV -eq 1 ]
then
  # "fastmcp dev" requires root access


  PATH="$PATH:`dirname $NODE`:`dirname $NPX`"
  echo "-> sudo fastmcp ${RUN_ARGS} ${FASTMCP_ARGS} ${UV_COMMON_ARGS}" > /dev/stderr

  export PATH="${NPX_DIR}:${NODE_DIR}:${PATH}"
  echo -e "* Updated PATH:\n${PATH}\n"

  fastmcp ${RUN_ARGS} ${FASTMCP_ARGS} ${UV_COMMON_ARGS}
  err=$?
  echo -e "<- sudo fastmcp ${RUN_ARGS} returned $err\n" > /dev/stderr
else
  fastmcp ${RUN_ARGS} ${FASTMCP_ARGS} ${UV_COMMON_ARGS}
  err=$?
  echo -e "<- fastmcp ${RUN_ARGS} returned $err\n" > /dev/stderr
fi

echo "*** Exit code $err" exit $err
