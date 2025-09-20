#!/usr/bin/env bash

echo "-> uv run --python=3.13 python --version" > /dev/stderr
uv run --python=3.13 python --version
err=$?
echo -e "<- uv run python --version returned $err\n" > /dev/stderr

echo "-> uv pip install fastmcp" > /dev/stderr
#pip install fastmcp
sudo uv pip install --python=3.13 --system fastmcp
echo -e "<- uv pip install fastmcp returned $err\n" > /dev/stderr

echo "-> uv pip install httpx" > /dev/stderr
#pip install httpx
sudo uv pip install --python=3.13 --system httpx
err=$?
echo -e "<- uv pip install httpx returned $err\n" > /dev/stderr

echo "-> uv pip install pandas" > /dev/stderr
#pip install pandas
sudo uv pip install --python=3.13 --system pandas
err=$?
echo -e "<- uv pip install pandas returned $err\n" > /dev/stderr

#echo "-> uv pip install asyncio" > /dev/stderr
#pip install asyncio
#sudo uv pip install --python=3.13 --system asyncio
#err=$?
#echo -e "<- uv pip install asyncio returned $err\n" > /dev/stderr

uv pip list --python=3.13
