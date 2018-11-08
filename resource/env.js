module.exports = {
	app: {
		name: 'goose-app',
		description: 'website description',
		keywords: 'development,graphics,review',
		url: 'http://localhost:3000',
		author: 'redgoose',
		lang: 'ko',
		locale: 'ko_KR',
		copyright: 'Copyright 2018 redgoose. All right reserved.',
		loading: {
			color: '#29c37d',
			failedColor: '#f00',
			height: '2px',
		},
		app_srl: 8,
		header: {
			logo: '/ico-logo.png',
			navigation: [
				{ key: 'menu1', label: 'Menu1', url: '/articles/menu1' },
				{ key: 'menu2', label: 'Menu2', url: '/articles/menu2' },
				{ key: 'menu3', label: 'Menu3', url: '/articles/menu3' },
				{ key: 'redgoose', label: 'redgoose', url: 'https://redgoose.me', target: '_blank' },
			],
		},
		intro: {
			newest: {
				size: 24,
				pagination: true,
				listStyle: 'thumbnail', // list style. ex)`card,thumbnail`
				showMeta: {
					date: true,
					nestName: true,
					hit: false,
					star: false,
				},
			},
		},
		index: {
			size: 24,
			listStyle: 'card', // list style. ex)`card,thumbnail`
			showMeta: {
				date: true,
				categoryName: true,
				hit: false,
				star: false,
			},
		},
		search: {
			size: 24,
			listStyle: 'card', // list style. ex)`card,thumbnail`
			showMeta: {
				date: true,
				nestName: true,
				hit: false,
				star: false,
			},
		},
		error: {
			symbol: '/img-error.png',
			message: 'Service error',
		},
	},
	api: {
		url: '', // goose-api address
		token: '', // goose-api public token
	},
};