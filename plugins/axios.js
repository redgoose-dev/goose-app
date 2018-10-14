export default function (cox, aa) {

	const { $axios, redirect } = cox;

	// set header
	$axios.setHeader('Authorization', cox.env.API_TOKEN);

	$axios.onRequest(config => {
		console.log('Making request to ' + config.url);
	});

	$axios.onError(error => {
		const code = parseInt(error.response && error.response.status);
		if (code === 400) {
			redirect('/400')
		}
	});

}