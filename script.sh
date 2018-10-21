#!/usr/bin/env bash

case "$1" in
	install)
		# make config dir
		mkdir ./config
		#chmod 707 ./config

		# copy env files
		cp ./assets/example-config/env.js ./config/env.js
		cp ./assets/example-config/env.scss ./config/env.scss
		;;

	remove-config)
		rm -rf ./config
		;;

	*)
		echo "Usage: ./script.sh {install|remove-config}" >&2
		exit 3
		;;
esac
