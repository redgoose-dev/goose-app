<template>
<article class="index">
	<header class="index__header">
		<h1>Search result: {{keyword}}</h1>
	</header>
</article>
</template>

<script>
import * as util from '~/assets/libs/util';

export default {
	name: 'searchResult',
	components: {
		'items-index': () => import('~/components/contents/index'),
		'nav-paginate': () => import('~/components/navigation/paginate'),
	},
	async asyncData(cox)
	{
		const { route, store } = cox;
		const { state } = store;
		let keyword = route.query.q;
		let page = (cox.route.query && cox.route.query.page) ? parseInt(cox.route.query.page) : 1;

		try
		{
			let params = {
				field: 'srl,nest_srl,json,title',
				order: 'regdate',
				sort: 'desc',
				page,
				ext_field: '',
			};
			if (state.env.app.app_srl) params.app = state.env.app.app_srl;
			if (state.env.app.search.size) params.size = state.env.app.search.size;
			if (state.env.app.search.showMeta.nestName) params.ext_field += 'nest_name';
			if (state.env.app.search.showMeta.date) params.field += ',regdate';
			if (state.env.app.search.showMeta.hit) params.field += ',hit';
			if (state.env.app.search.showMeta.star) params.field += ',star';
			if (keyword) params.q = keyword;

			let res = await cox.$axios.$get('/articles' + util.serialize(params, true));
			if (!res.success) throw res.message;

			return {
				keyword,
				total: res.data.total,
				index: res.data.index,
				page: params.page,
				size: params.size,
				loading: false,
				error: null,
			};
		}
		catch(e)
		{
			return {
				keyword,
				error: (typeof e === 'string') ? e : 'Service error',
				index: null,
				total: 0,
			};
		}
	}
};
</script>