#!/bin/bash

# set port
[[ -z "$2" ]] && port=3000 || port=$2

# func / start server
start() {
  php -S 0.0.0.0:$port -t ./
}

# switching
case "$1" in
  start)
    start
    ;;

  setup)
    # make cache directory
    if [ ! -d cache ]; then
      mkdir cache
      chmod 707 cache
      mkdir cache/view
      chmod 707 cache/view
    fi
    # copy .env
    if [ ! -f .env ]; then
      cp resource/.env .env
    fi
    ;;

  *)
    echo "Usage: ./action.sh {setup|start}" >&2
    exit 3
    ;;
esac
