#!/usr/bin/env bash
# https://github.com/astral-sh/uv-docker-example

# ghcr.io/astral-sh/uv:alpine3.22

echo "-> docker pull ghcr.io/astral-sh/uv:trixie"
docker pull ghcr.io/astral-sh/uv:trixie
err=$?
echo "<- docker pull returned $err"
if [ $err -ne 0]; then exit $err; fi

echo "-> docker run --rm -it ghcr.io/astral-sh/uv:trixie \"apt update && apt install nodejs\""
docker run -it ghcr.io/astral-sh/uv:trixie "apt update && apt install nodejs"
err=$?
echo "<- docker run returned $err"
if [ $err -ne 0]; then exit $err; fi

exit $err
