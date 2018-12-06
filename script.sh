#!/bin/bash

# function / install
install() {
	# make user dir
	mkdir ./user
	mkdir ./static/user

	# copy env files
	cp ./resource/env.js ./user/env.js
	cp ./resource/env.scss ./user/env.scss

	# copy image files
	cp ./resource/ico-logo.png ./static/ico-logo.png
	cp ./resource/img-error.png ./static/img-error.png
	cp ./resource/og-image.jpg ./static/og-image.jpg
	cp ./resource/favicon.ico ./static/favicon.ico

	# install node_module
	yarn install
}

# function / uninstall
uninstall() {
	rm -rf ./user/
	rm -rf ./node_modules/
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
				uninstall
				install
				;;
			* )
				exit
				;;
		esac
		;;

	uninstall)
		uninstall
		;;

	*)
		echo "Usage: ./script.sh {install|reinstall|uninstall}" >&2
		exit 3
		;;
esac
