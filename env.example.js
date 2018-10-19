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
			color: '#42BA78',
			failedColor: '#f00',
			height: '2px',
		},
		app_srl: 8,
		intro: {
			newest: {
				size: 24,
				pagination: true,
			},
		},
		index: {
			size: 24,
		},
	},
	api: {
		url: 'https://goose.redgoose.me',
		token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZ29vc2UucmVkZ29vc2UubWUiLCJqdGkiOiI3YmNkZWZnaGlqa0Vtbm9SIiwiaWF0IjoxNTM0MzI1MjQwLCJkYXRhIjp7InR5cGUiOiJhbm9ueW1vdXMifX0.ZIBynqxpjjYOwrFVQ3854qhVIP4zICrOKQbAgLCsD0g',
	},
	navigation: [
		{ key: 'development', label: 'Development', url: '/articles/development' },
		{ key: '3d', label: '3D', url: '/articles/3d' },
		{ key: 'review', label: 'Review', url: '/articles/review' },
		{ key: 'redgoose', label: 'redgoose.me', url: 'https://redgoose.me', target: '_blank' },
	],
};