#!/usr/bin/env bash

ASSETS="assets"
if [[ ! -d "$ASSETS/" ]]
then
  echo "directory \"$ASSETS\" does not exist"
  ASSETS=.
fi
ARGS="-d $ASSETS"

#ARGS="$ARGS --protocol=HTTP/1.0"
ARGS="$ARGS --bind=127.0.0.1"
ARGS="$ARGS 8080"

#python -m http.server -d assets
echo "-> python -m http.server $ARGS"
python -m http.server $ARGS
ret=$?
echo "<- python returned $ret"

exit $ret
