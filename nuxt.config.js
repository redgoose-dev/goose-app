const env = require('./env.config');

module.exports = {
	mode: 'universal', // spa,universal

	head: {
		title: process.env.APP_NAME,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: env.app.description },
			{ name: 'author', content: env.app.author },
			{ name: 'keywords', content: env.app.keywords },
			{ property: 'og:site_name', content: env.app.name },
			{ property: 'og:url', content: env.app.url },
			{ property: 'og:locale', content: env.app.locale },
			{ property: 'og:type', content: 'website' },
		],
		link: [
			{ rel: 'canonical', href: env.app.url },
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	loading: { color: '#ff0000' },

	css: [
		'~assets/css/app.scss'
	],

	env: {
		API_TOKEN: env.api.token,
		PAGE_PER_SIZE: env.page.size,
		APP_NAME: env.app.name,
		APP_AUTHOR: env.app.author,
		APP_COPYRIGHT: env.app.copyright,
	},

	plugins: [
		'~/plugins/axios'
	],

	modules: [
		'@nuxtjs/axios'
	],
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
		baseURL: env.api.url,
	},

	build: {
		extractCSS: true,
		extend(config, ctx) {
			//
		}
	}
};
