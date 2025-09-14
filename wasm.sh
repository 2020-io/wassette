#!/usr/bin/env bash

pushd assets >/dev/null
dos2unix *.html *.js 2>/dev/null

ARGS="-d ."
#ARGS="$ARGS --protocol=HTTP/1.0"
ARGS="$ARGS --bind=127.0.0.1"
ARGS="$ARGS 8080"

#python -m http.server -d assets
echo "-> python -m http.server $ARGS"
python -m http.server $ARGS
ret=$?
echo "<- python returned $ret"

popd >/dev/null
exit $ret
