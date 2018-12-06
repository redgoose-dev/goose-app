const env = require('./user/env');

module.exports = {
	mode: 'universal', // spa,universal

	head: {
		title: env.app.name,
		htmlAttrs: {
			lang: env.app.lang,
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: env.app.description },
			{ name: 'author', content: env.app.author },
			{ name: 'keywords', content: env.app.keywords },
			{ hid: 'og:site_name', property: 'og:site_name', content: env.app.name },
			{ hid: 'og:url', property: 'og:url', content: env.app.url },
			{ hid: 'og:locale', property: 'og:locale', content: env.app.locale },
			{ hid: 'og:type', property: 'og:type', content: 'website' },
			{ hid: 'og:title', property: 'og:title', content: env.app.name },
			{ hid: 'og:description', property: 'og:description', content: env.app.description },
			{ hid: 'og:image', property: 'og:image', content: '/og-image.jpg' },
		],
		link: [
			{ hid: 'canonical', rel: 'canonical', href: env.app.url },
			{ hid: 'favicon', rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		],
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
