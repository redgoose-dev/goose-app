#!/usr/bin/env bash

case "$1" in
	install)
		# make config dir
		mkdir ./config
		#chmod 707 ./config

		# copy env files
		cp ./assets/config/env.js ./config/env.js
		cp ./assets/config/env.scss ./config/env.scss
		;;
	*)
		echo "Usage: ./script.sh {install}" >&2
		exit 3
		;;
esac
