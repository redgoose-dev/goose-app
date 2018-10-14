// set env
require('dotenv').config();

module.exports = {
	mode: 'universal', // spa,universal

	head: {
		title: process.env.APP_NAME,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.APP_DESCRIPTION }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	loading: { color: '#ff0000' },

	css: [
		'~assets/css/app.scss'
	],

	env: {
		API_TOKEN: process.env.API_TOKEN,
		PAGE_PER_SIZE: process.env.PAGE_PER_SIZE,
		APP_NAME: process.env.APP_NAME,
		APP_DESCRIPTION: process.env.APP_DESCRIPTION,
	},

	plugins: [
		'~/plugins/axios'
	],

	modules: [
		'@nuxtjs/axios'
	],
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
		baseURL: process.env.API_URL,
	},

	build: {
		extractCSS: true,
		extend(config, ctx) {
			//
		}
	}
};
