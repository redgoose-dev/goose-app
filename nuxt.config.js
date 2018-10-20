const env = require('./env.config');

module.exports = {
	mode: 'universal', // spa,universal

	head: {
		title: env.app.name,
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

	loading: {
		color: env.app.loading.color,
		failedColor: env.app.loading.failedColor,
		height: env.app.loading.height,
	},

	css: [
		'~assets/css/app.scss'
	],

	env: {
		...env,
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

	router: {
		middleware: 'hook',
	},

	build: {
		extractCSS: true,
		extend(config, ctx) {
			//
		}
	}
};
