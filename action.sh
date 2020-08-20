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
    # copy .env
    if [ ! -f .env ]; then
      cp resource/.env .env
    fi
    # copy user files
    if [ ! -f user/app-icon.png ]; then
      cp resource/app-icon.png user/app-icon.png
    fi
    if [ ! -f user/custom.css ]; then
      cp resource/custom.css user/custom.css
    fi
    if [ ! -f user/favicon.ico ]; then
      cp resource/favicon.ico user/favicon.ico
    fi
    if [ ! -f view/head-user.blade.php ]; then
      cp resource/head-user.blade.php view/head-user.blade.php
    fi
    if [ ! -f user/manifest.json ]; then
      cp resource/manifest.json user/manifest.json
    fi
    if [ ! -f user/preference.php ]; then
      cp resource/preference.php user/preference.php
    fi
    if [ ! -f user/route.php ]; then
      cp resource/route.php user/route.php
    fi
    ;;

  *)
    echo "Usage: ./action.sh {setup|start}" >&2
    exit 3
    ;;
esac
