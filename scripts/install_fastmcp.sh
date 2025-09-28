#!/usr/bin/env bash

DIR=`pwd`
echo "* Running in: ${DIR}"
PROJECT_ROOT=../`dirname $0`
pushd "${PROJECT_ROOT}" > /dev/null
PROJECT_ROOT=`pwd`
popd > /dev/null
echo "* Project root: ${PROJECT_ROOT}"

#
# Configure args that are command-specific
#

UV_PIP_LIST_ARGS="--strict"

UV_PIP_INSTALL_ARGS="--strict --refresh"
#UV_PIP_INSTALL_ARGS="${UV_PIP_INSTALL_ARGS} --no-build-isolation"

UV_SYNC_ARGS="--no-editable"
#UV_SYNC_ARGS="${UV_SYNC_ARGS} --no-build-isolation" # [env: UV_NO_BUILD_ISOLATION=1]

if [[ "$1" == "dev" ]] || [[ "$1" == "devel" ]] || [[ "$1" == "develop" ]] || [[ "$1" == "development" ]]
then 
  echo "* In development mode"
  UV_SYNC_ARGS="${UV_SYNC_ARGS} --all-packages"
  #UV_SYNC_ARGS="${UV_SYNC_ARGS} --dev"
  shift
elif [[ "$1" == "rel" ]] || [[ "$1" == "release" ]]
then 
  echo "* In release mode"
  UV_SYNC_ARGS="${UV_SYNC_ARGS} --no-dev"
  shift
else
  echo "* In default mode"
fi

#
# Configure args that are common across multiple commands
#

COMMON_ARGS="--no-cache" # Avoid reading from or writing to the cache (use a temp directory instead)
if [ "$1" == "debug" ]
then 
  echo "* Debug logging"
  COMMON_ARGS="${COMMON_ARGS} -v"
  shift
elif [ "$1" == "trace" ]
then 
  echo "* Trace logging"
  COMMON_ARGS="${COMMON_ARGS} -vvv"
  shift
fi

UV_COMMON_ARGS="--python=3.13"
UV_COMMON_ARGS="${UV_COMMON_ARGS} --managed-python" # Require use of uv-managed Python versions [env: UV_NO_MANAGED_PYTHON=0]
#UV_COMMON_ARGS="${UV_COMMON_ARGS} --no-managed-python" # Disable use of uv-managed Python versions [env: UV_NO_MANAGED_PYTHON=0]

#############################################################################

function check_nodejs_package {
  NODEJS_ROOT="$1"

  if [ -f "${NODEJS_ROOT}/package.json" ]
  then
    echo "* Found nodejs package found in \"${NODEJS_ROOT}"
    pushd "$NODEJS_ROOT" > /dev/null
    err=$?
    if [ $err -ne 0 ]; then exit $err; fi

    echo "-> npm install" > /dev/stderr
    npm install
    err=$?
    echo
    echo -e "<- npm install returned $err\n" > /dev/stderr
    if [ $err -ne 0 ]; then exit $err; fi

    echo "-> npm list"
    npm list
    err=$?
    echo -e "<- npm list\n"
    if [ $err -ne 0 ]; then exit $err; fi

    popd > /dev/null
    err=$?
    if [ $err -ne 0 ]; then exit $err; fi
  else
    echo "* No nodejs package found in \"${NODEJS_ROOT}\""
    return
  fi
}

check_nodejs_package "${PROJECT_ROOT}"
check_nodejs_package "${PROJECT_ROOT}/assets"
check_nodejs_package "${PROJECT_ROOT}/assets/fastmcp"

#############################################################################

PIP_INSTALL_ARGS="--upgrade"
REQUIREMENTS_FILE="${PROJECT_ROOT}/requirements.txt"
if [ -f "${REQUIREMENTS_FILE}" ]
then
  UV_RUN_ARGS="--with-requirements=${REQUIREMENTS_FILE}"
  UVX_ARGS="--with-requirements=${REQUIREMENTS_FILE}"
  #PIP_INSTALL_ARGS="${PIP_INSTALL_ARGS} -r ${REQUIREMENTS_FILE}"
  PIP_INSTALL_ARGS="${PIP_INSTALL_ARGS} -r ${REQUIREMENTS_FILE}"
else
  echo -e "No requirements file \"${REQUIREMENTS_FILE}\"\n"
  UV_RUN_ARGS=""
  UVX_ARGS=""
fi

echo "--> pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} uv_build" > /dev/stderr
pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} uv_build
err=$?
echo -e "<- pip install uv_build returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "--> pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} setuptools" > /dev/stderr
pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} setuptools
err=$?
echo -e "<- pip install setuptools returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

#UV_COMMON_ARGS="${UV_COMMON_ARGS} --no-index" # Ignore the registry index (e.g., PyPI), instead relying on direct URL dependencies and those
#UV_COMMON_ARGS="${UV_COMMON_ARGS} --no-progress" # Hide all progress outputs [env: UV_NO_PROGRESS=1]
#UV_COMMON_ARGS="${UV_COMMON_ARGS} --no-config" # Avoid discovering configuration files (`pyproject.toml`, `uv.toml`) [env: UV_NO_CONFIG=1]
#UV_COMMON_ARGS="${UV_COMMON_ARGS} --no-python-downloads" # Disable automatic downloads of Python. [env: "UV_PYTHON_DOWNLOADS=never"]

#
# Create virtual environment (.venv in project root)
#
echo "-> uv venv --clear --directory="${PROJECT_ROOT}" ${UV_COMMON_ARGS} ${COMMON_ARGS}"

VENV_DIR="${PROJECT_ROOT}/.venv"

if [ -d "${VENV_DIR}/bin" ]
then
  VENV_FILE="${VENV_DIR}/bin/activate"
else
  VENV_FILE="${VENV_DIR}/Scripts/activate"
fi

if [ -d "${VENV_DIR}" ]
then
  echo "* Directory already exists: ${VENV_DIR}"

  # keep an audit record (but ignore if this fails)
  find "${VENV_DIR}" -type f -printf "%p - %s\n" | sort > "${PROJECT_ROOT}/venv.before.txt"
  echo "* Before uv venv: `ls -l "${PROJECT_ROOT}/venv.before.txt"`"

  # move .venv to .venv.old
  rm -rf "${VENV_DIR}.old" # replace any existing old folder
  echo "* mv \"${VENV_DIR}\"" \"${VENV_DIR}.old\"
  mv "${VENV_DIR}" "${VENV_DIR}.old"
  if [ $err -ne 0 ]; then exit $err; fi # this shouldn't fail
fi

pushd "${PROJECT_ROOT}" > /dev/null
#echo "* pushd: `pwd`" > /dev/stderr
uv venv --clear --directory="${PROJECT_ROOT}" ${UV_COMMON_ARGS} ${COMMON_ARGS}
err=$?
popd > /dev/null
#echo -e "* popd `pwd`\n" > /dev/stderr

# keep an audit record (but ignore if this fails)
find "${PROJECT_ROOT}/.venv" -type f -printf "%p - %s\n" | sort > "${PROJECT_ROOT}/venv.after.txt"
echo "* After uv venv: `ls -l "${PROJECT_ROOT}/venv.after.txt"`"

echo -e "<- uv venv returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#########################################################################

echo "Loading \"${VENV_FILE}\""  > /dev/stderr

# Preserve the previous env.* records if they exist
if [ -f "${VENV_DIR}/env.before.txt" ]
then
  mv -f "${VENV_DIR}/env.before.txt" "${VENV_DIR}/env.before.old"
  mv -f "${VENV_DIR}/env.after.txt" "${VENV_DIR}/env.after.old"
fi

date > "${VENV_DIR}/env.before.txt"
env >> "${VENV_DIR}/env.before.txt"
which python >> "${VENV_DIR}/env.before.txt"
python --version >> "${VENV_DIR}/env.before.txt"

which pip >> "${VENV_DIR}/env.before.txt"
pip list ${COMMON_ARGS} >> "${VENV_DIR}/env.before.txt"
echo "pip list returned $?" > /dev/stderr
uv pip list ${UV_PIP_LIST_ARGS} ${COMMON_ARGS} >> "${VENV_DIR}/env.before.txt" < /dev/null
echo "uv pip list ${UV_PIP_LIST_ARGS} returned $?" > /dev/stderr
echo "-> before venv activate: `ls -l "${VENV_DIR}/env.before.txt"`"

source "${VENV_FILE}"
err=$?
if [ $err -ne 0 ]; then exit $err; fi

date > "${VENV_DIR}/env.after.txt"
env >> "${VENV_DIR}/env.after.txt"
which python >> "${VENV_DIR}/env.after.txt"
python --version >> "${VENV_DIR}/env.after.txt"

which pip >> "${VENV_DIR}/env.after.txt"
pip list >> "${VENV_DIR}/env.after.txt"
echo "pip list returned $?" > /dev/stderr
uv pip list ${UV_PIP_LIST_ARGS} ${COMMON_ARGS} >> "${VENV_DIR}/env.after.txt" < /dev/null
echo "uv pip list ${UV_PIP_LIST_ARGS} returned $?" > /dev/stderr
echo "<- after venv activate: `ls -l "${VENV_DIR}/env.after.txt"`"

#############################################################################

echo "-> uv lock --check ${UV_COMMON_ARGS} ${COMMON_ARGS}" > /dev/stderr
uv lock --check ${UV_COMMON_ARGS} ${COMMON_ARGS} < /dev/null
err=$?
echo -e "<- uv lock --check returned $err\n" > /dev/stderr

if [ $err -ne 0 ]
then
  echo "-> uv lock ${UV_COMMON_ARGS} ${COMMON_ARGS}" > /dev/stderr
  uv lock ${UV_COMMON_ARGS} ${COMMON_ARGS} < /dev/null
  err=$?
  echo -e "<- uv lock returned $err\n" > /dev/stderr
  exit $err
fi

#############################################################################

UV_PIP_ARGS=""
#UV_PIP_ARGS="${UV_PIP_ARGS} --no-break-system-packages"
#UV_PIP_ARGS="${UV_PIP_ARGS} --no-build" # Don't build source distributions
#UV_PIP_ARGS="${UV_PIP_ARGS} --no-deps" # Ignore package dependencies, instead only installing those packages explicitly listed on the
#UV_PIP_ARGS="${UV_PIP_ARGS} --no-sources" # Ignore the `tool.uv.sources` table when resolving dependencies. Used to lock against the
#UV_PIP_ARGS="${UV_PIP_ARGS} --no-verify-hashes" # Disable validation of hashes in the requirements file [env: UV_NO_VERIFY_HASHES=1]

echo "-> uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} uv_build" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} uv_build < /dev/null
err=$?
echo -e "<- uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} uv_build returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} setuptools" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} setuptools < /dev/null
err=$?
echo -e "<- uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} setuptools returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uv pip list ${UV_PIP_LIST_ARGS} --python=3.13 ${COMMON_ARGS}" > /dev/stderr
uv pip list ${UV_PIP_LIST_ARGS} --python=3.13 ${COMMON_ARGS} < /dev/null
echo -e "<- uv pip list ${UV_PIP_LIST_ARGS} returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> pip list ${COMMON_ARGS}" > /dev/stderr
pip list ${COMMON_ARGS}
echo -e "<- pip list returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

echo "-> python --version" > /dev/stderr
which python
python --version
err=$?
echo -e "<- python --version returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uvx ${UVX_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} python --version" > /dev/stderr
uvx ${UVX_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} python --version
err=$?
echo -e "<- uvx python returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uv sync ${UV_SYNC_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS}" > /dev/stderr
uv sync ${UV_SYNC_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} < /dev/null
err=$?
echo -e "<- uv sync returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "-> uv run ${UV_RUN_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} python --version" > /dev/stderr
uv run ${UV_RUN_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} python --version < /dev/null
err=$?
echo -e "<- uv run python returned $err\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

#############################################################################

echo "-> uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} fastmcp" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} fastmcp # TODO: < /dev/null
#pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} fastmcp
err=$?
echo -e "<- uv pip install fastmcp returned $err\n" > /dev/stderr

echo "-> uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} httpx" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} httpx # TODO: < /dev/null
#pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} httpx
err=$?
echo -e "<- uv pip install httpx returned $err\n" > /dev/stderr

echo "-> uv pip install ${PIP_INSTALL_ARGS} asyncio" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} asyncio # TODO: < /dev/null
#pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} asyncio
err=$?
echo -e "<- uv pip install ${PIP_INSTALL_ARGS} asyncio returned $err\n" > /dev/stderr

echo "-> uv pip install ${PIP_INSTALL_ARGS} numpy" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} numpy # TODO: < /dev/null
#pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} numpy
err=$?
echo -e "<- uv pip install ${PIP_INSTALL_ARGS} numpy returned $err\n" > /dev/stderr

echo "-> uv pip install ${PIP_INSTALL_ARGS} pandas" > /dev/stderr
uv pip install ${PIP_INSTALL_ARGS} ${UV_PIP_ARGS} ${UV_COMMON_ARGS} ${COMMON_ARGS} pandas # TODO: < /dev/null 
#pip install ${PIP_INSTALL_ARGS} ${COMMON_ARGS} pandas
err=$?
echo -e "<- uv pip install ${PIP_INSTALL_ARGS} pandas returned $err\n" > /dev/stderr

#############################################################################

echo "-> uv pip list ${UV_PIP_LIST_ARGS} ${COMMON_ARGS}" > /dev/stderr
uv pip list ${UV_PIP_LIST_ARGS} ${COMMON_ARGS} # TODO: < /dev/null
echo -e "<- uv pip list ${UV_PIP_LIST_ARGS} ${COMMON_ARGS}\n" > /dev/stderr
if [ $err -ne 0 ]; then exit $err; fi

echo "*** Exit code $err"
exit $err
