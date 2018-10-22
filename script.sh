#!/bin/bash

# function / install
install() {
	# make config dir
	mkdir ./config

	# copy env files
	cp ./assets/example-config/env.js ./config/env.js
	cp ./assets/example-config/env.scss ./config/env.scss

	# install node_module
	yarn install
}

# action
case "$1" in
	install)
		install
		;;

	reinstall)
		if [ "$2" = "-y" ]
		then
			yn="y"
		else
			read -p "Do you really want to reinstall it? (y/N) " yn
		fi
		case ${yn} in
			[Yy]* )
				rm -rf ./config/
				rm -rf ./node_modules/
				install
				;;
			* )
				exit
				;;
		esac
		;;

	remove-config)
		rm -rf ./config/
		;;

	*)
		echo "Usage: ./script.sh {install|reinstall|remove-config}" >&2
		exit 3
		;;
esac
