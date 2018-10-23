module.exports = {
	app: {
		name: 'goose-app',
		description: 'gallery app from goose',
		keywords: 'redgoose,redgoose-note,development,graphics,review',
		url: 'http://localhost:3000',
		author: 'redgoose',
		locale: 'ko_KR',
		copyright: 'Copyright 2018 redgoose. All right reserved.',
		loading: {
			color: '#29c37d',
			failedColor: '#f00',
			height: '2px',
		},
		app_srl: 8,
		header: {
			logo: '/user/ico-logo.png',
			navigation: [
				{ key: 'news', label: 'News', url: '/articles/demo-news' },
				{ key: 'visual', label: 'Visual', url: '/articles/demo-visual' },
				{ key: 'fashion', label: 'Fashion', url: '/articles/demo-fashion' },
				{ key: 'review', label: 'Review', url: '/articles/demo-review' },
				{ key: 'note', label: 'Note', url: '/articles/demo-note' },
				{ key: 'redgoose', label: 'redgoose.me', url: 'https://redgoose.me', target: '_blank' },
			],
		},
		intro: {
			newest: {
				size: 24,
				pagination: true,
				listStyle: 'card', // list style. ex)`card,thumbnail`
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
			symbol: '/user/img-error.png',
			message: 'Service error',
		},
	},
	api: {
		url: 'https://goose.redgoose.me',
		token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZ29vc2UucmVkZ29vc2UubWUiLCJqdGkiOiI3YmNkZWZnaGlqa0Vtbm9SIiwiaWF0IjoxNTM0MzI1MjQwLCJkYXRhIjp7InR5cGUiOiJhbm9ueW1vdXMifX0.ZIBynqxpjjYOwrFVQ3854qhVIP4zICrOKQbAgLCsD0g',
	},
};