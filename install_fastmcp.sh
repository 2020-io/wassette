#!/usr/bin/env bash

export UV_NO_BUILD_ISOLATION=1

#sudo uv pip uninstall --python=3.13 --system fastmcp
#sudo uv pip uninstall --python=3.13 --system httpxx
#sudo uv pip uninstall --python=3.13 --system asyncio
#sudo uv pip uninstall --python=3.13 --system pandas
#uv pip uninstall --python=3.13 fastmcp
#uv pip uninstall --python=3.13 httpxx
#uv pip uninstall --python=3.13 asyncio
#uv pip uninstall --python=3.13 pandas

ROOT=`dirname $0`
pushd $ROOT >/dev/null
export ROOT=`pwd`
popd >/dev/null

echo "Project root: $ROOT"
ls -l "${ROOT}/requirements.txt"

if [ ! -f "${ROOT}/requirements.txt" ]
then
  echo "Unable to locate requirements.txt"
  echo "Re-run \"$0\" from the project root"
  exit 1
fi

echo "-> pip install -r requirements.txt"
#pip install -r "${ROOT}/requirements.txt"
err=$?
echo -e "<- pip install -r \"requirements.txt\" returned $err\n"
if [ $err -ne 0 ]; then exit $err; fi

which python
python --version
#echo "-> uv run --python=3.13 python --version" > /dev/stderr
#uv run --python=3.13 python --version
#err=$?
#echo -e "<- uv run python --version returned $err\n" > /dev/stderr

echo "-> install fastmcp" > /dev/stderr
#pip install --no-build-isolation fastmcp
uv pip install --python=3.13 fastmcp
err=$?
echo -e "<- install fastmcp returned $err\n" > /dev/stderr

echo "-> install httpx" > /dev/stderr
#pip install --no-build-isolation httpx
uv pip install --no-build-isolation --python=3.13 httpx
err=$?
echo -e "<- install httpx returned $err\n" > /dev/stderr

#echo "-> install asyncio" > /dev/stderr
#pip install --no-build-isolation asyncio
#uv pip install --no-build-isolation --python=3.13 asyncio
#err=$?
#echo -e "<- install asyncio returned $err\n" > /dev/stderr

echo "-> install pandas" > /dev/stderr
#pip install --no-build-isolation pandas
uv pip install --no-build-isolation --python=3.13 pandas
err=$?
echo -e "<- install pandas returned $err\n" > /dev/stderr

uv pip list --python=3.13
err=$?

exit $err
