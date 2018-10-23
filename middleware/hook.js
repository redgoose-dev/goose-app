export default function (context)
{
	const { route, store } = context;

	// update search keyword
	let keyword = (route.query && route.query.q) ? route.query.q : '';
	store.commit('updateSearchKeyword', keyword);
}