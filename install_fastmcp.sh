#!/usr/bin/env bash

DIR=`pwd`
echo "Running in: ${DIR}"
PROJECT_ROOT=`dirname $0`
pushd "${PROJECT_ROOT}" > /dev/null
PROJECT_ROOT=`pwd`
popd > /dev/null
echo "Project root: ${PROJECT_ROOT}"

DEV=0
if [ "$1" == "dev" ]
then 
  DEV=1
  COMMON_ARGS="-vv"
  shift
elif [ "$1" == "debug" ]
then 
  COMMON_ARGS="-vvv"
  shift
else
  COMMON_ARGS=""
fi

UVCOMMON_ARGS="${UVCOMMON_ARGS} --no-cache" # Avoid reading from or writing to the cache, instead using a temporary directory for the duration of
#UVCOMMON_ARGS="${UVCOMMON_ARGS} --no-managed-python" # Disable use of uv-managed Python versions [env: UV_NO_MANAGED_PYTHON=0]

#############################################################################

echo "-> uv lock --check ${COMMON_ARGS}" > /dev/stderr
uv lock --check ${COMMON_ARGS}
err=$?
echo -e "<- uv lock --check returned $err\n" > /dev/stderr

#############################################################################

PIP_ARGS="install --upgrade"
REQUIREMENTS_FILE="${PROJECT_ROOT}/requirements.txt"

if [ -f "${REQUIREMENTS_FILE}" ]
  COMMON_ARGS="--requirement=${REQUIREMENTS_FILE}"
then
  echo "No requirements file \"${REQUIREMENTS_FILE}\""
  COMMON_ARGS=""
fi

echo -e "--> sudo pip ${PIP_ARGS} uv_build returned $err\n" > /dev/stderr
sudo pip ${PIP_ARGS} ${COMMON_ARGS} uv_build
err=$?
echo -e "<- sudo pip ${PIP_ARGS} uv_build returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

UVCOMMON_ARGS="--python=3.13 --managed-python --refresh"
#UVCOMMON_ARGS="${UVCOMMON_ARGS} --no-index" # Ignore the registry index (e.g., PyPI), instead relying on direct URL dependencies and those
#UVCOMMON_ARGS="${UVCOMMON_ARGS} --no-progress" # Hide all progress outputs [env: UV_NO_PROGRESS=1]
#UVCOMMON_ARGS="${UVCOMMON_ARGS} --no-config" # Avoid discovering configuration files (`pyproject.toml`, `uv.toml`) [env: UV_NO_CONFIG=1]
#UVCOMMON_ARGS="${UVCOMMON_ARGS} --no-python-downloads" # Disable automatic downloads of Python. [env: "UV_PYTHON_DOWNLOADS=never"]

echo "-> uv venv --clear ${UVCOMMON_ARGS} ${COMMON_ARGS}" > /dev/stderr
uv venv --clear ${UVCOMMON_ARGS} ${COMMON_ARGS}
err=$?
echo -e "<- uv venv returned $err\n" > /dev/stderr
source "${PROJECT_ROOT}/.venv/bin/activate"

UVPIP_ARGS="--strict"
#UVPIP_ARGS="${UVPIP_ARGS} --no-break-system-packages"
UVPIP_ARGS="${UVPIP_ARGS} --no-build" # Don't build source distributions
UVPIP_ARGS="${UVPIP_ARGS} --no-build-isolation" # [env: UV_NO_BUILD_ISOLATION=1]
UVPIP_ARGS="${UVPIP_ARGS} --no-deps" # Ignore package dependencies, instead only installing those packages explicitly listed on the
UVPIP_ARGS="${UVPIP_ARGS} --no-sources" # Ignore the `tool.uv.sources` table when resolving dependencies. Used to lock against the
#UVPIP_ARGS="${UVPIP_ARGS} --no-verify-hashes" # Disable validation of hashes in the requirements file [env: UV_NO_VERIFY_HASHES=1]

#############################################################################

echo "-> uv pip ${PIP_ARGS} ${UVPIP_ARGS} ${UVCOMMON_ARGS} ${COMMON_ARGS} uv_build" > /dev/stderr
uv pip ${PIP_ARGS} ${UVPIP_ARGS} ${UVCOMMON_ARGS} ${COMMON_ARGS} uv_build
err=$?
echo -e "<- uv pip install uv_build returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uv pip list --python=3.13 ${COMMON_ARGS}" > /dev/stderr
uv pip list --python=3.13 ${COMMON_ARGS}
echo -e "<- uv pip list returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

echo "-> pip list ${COMMON_ARGS}" > /dev/stderr
pip list ${COMMON_ARGS}
echo -e "<- pip list returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> python --version" > /dev/stderr
which python
python --version
err=$?
echo -e "<- python --version returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uvx ${UVCOMMON_ARGS} ${COMMON_ARGS} python --version" > /dev/stderr
uvx ${UVCOMMON_ARGS} ${COMMON_ARGS} python --version
err=$?
echo -e "<- uvx python returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

if [ $DEV -ne 0 ]
then
  echo "-> uv sync ${UVCOMMON_ARGS} ${COMMON_ARGS} --dev" > /dev/stderr
  uv sync ${UVCOMMON_ARGS} ${COMMON_ARGS} --dev
  err=$?
  echo -e "<- uv sync --dev returned $err\n" > /dev/stderr
  if [ $err -ne 0 ]; then exit $err; fi
else
  echo "-> uv sync ${UVCOMMON_ARGS} ${COMMON_ARGS}" > /dev/stderr
  uv sync ${UVCOMMON_ARGS} ${COMMON_ARGS}
  err=$?
  echo -e "<- uv sync returned $err\n" > /dev/stderr
  if [ $err -ne 0 ]; then exit $err; fi
fi

#echo "-> uv run ${UVCOMMON_ARGS} ${COMMON_ARGS} python --version" > /dev/stderr
#uv run ${UVCOMMON_ARGS} ${COMMON_ARGS} python --version
#err=$?
#echo -e "<- uv run python returned $err\n" > /dev/stderr
#if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

echo "-> uv pip install fastmcp"
uv pip ${PIP_ARGS} ${UVPIP_ARGS} ${UVCOMMON_ARGS} ${COMMON_ARGS} fastmcp
#pip $PIP_ARGS} {COMMON_ARGS} fastmcp
err=$?
echo -e "<- uv pip install fastmcp returned $err\n" > /dev/stderr

echo "-> uv pip install httpx" > /dev/stderr
uv pip ${PIP_ARGS} ${UVPIP_ARGS} ${UVCOMMON_ARGS} ${COMMON_ARGS} httpx
#pip $PIP_ARGS} {COMMON_ARGS} httpx
err=$?
echo -e "<- uv pip install httpx returned $err\n" > /dev/stderr

echo "-> install asyncio" > /dev/stderr
uv pip ${PIP_ARGS} ${UVPIP_ARGS} ${UVCOMMON_ARGS} ${COMMON_ARGS} asyncio
#pip $PIP_ARGS} {COMMON_ARGS} asyncio
err=$?
echo -e "<- install asyncio returned $err\n" > /dev/stderr

echo "-> install pandas" > /dev/stderr
uv pip ${PIP_ARGS} ${UVPIP_ARGS} ${UVCOMMON_ARGS} ${COMMON_ARGS} pandas
#pip $PIP_ARGS} {COMMON_ARGS} pandas
err=$?
echo -e "<- install pandas returned $err\n" > /dev/stderr

#############################################################################

echo "-> uv pip list ${UVPIP_ARGS} ${COMMON_ARGS}" > /dev/stderr
uv pip list ${UVPIP_ARGS} ${COMMON_ARGS}
echo -e "<- pip list ${UVPIP_ARGS} ${COMMON_ARGS}\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

exit $err
