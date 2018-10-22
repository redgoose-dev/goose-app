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
		header: {
			bgColor: 'rgba(200,200,100,1)',
			activeBgColor: 'rgba(0,0,0,.2)',
			fillColor: 'rgba(255,0,0,1)',
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
	},
	api: {
		url: 'https://goose.redgoose.me',
		token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZ29vc2UucmVkZ29vc2UubWUiLCJqdGkiOiI3YmNkZWZnaGlqa0Vtbm9SIiwiaWF0IjoxNTM0MzI1MjQwLCJkYXRhIjp7InR5cGUiOiJhbm9ueW1vdXMifX0.ZIBynqxpjjYOwrFVQ3854qhVIP4zICrOKQbAgLCsD0g',
	},
	navigation: [
		{ key: 'news', label: 'News', url: '/articles/demo-news' },
		{ key: 'visual', label: 'Visual', url: '/articles/demo-visual' },
		{ key: 'fashion', label: 'Fashion', url: '/articles/demo-fashion' },
		{ key: 'review', label: 'Review', url: '/articles/demo-review' },
		{ key: 'note', label: 'Note', url: '/articles/demo-note' },
		{ key: 'redgoose', label: 'redgoose.me', url: 'https://redgoose.me', target: '_blank' },
	],
};