<template>
	<p>smidgsdg</p>
</template>

<script>
import * as util from '~/assets/libs/util';

export default {
	name: 'articles-index',
	components: {
		'items-index': () => import('~/components/contents/index'),
	},
	validate(cox)
	{
		return cox.params.nest && /^[0-9A-Za-z_-]+$/.test(cox.params.nest);
	},
	async asyncData(cox)
	{
		let params = {
			category: {},
			article: {
				field: 'srl,category_srl,json,title,regdate',
				order: 'regdate',
				sort: 'desc',
				size: cox.store.state.env.api.size,
				page: 1,
				ext_field: 'category_name',
			},
		};

		// TODO: 먼저 api를 새로 제작하고나서 진행하기

		// get nest
		try
		{
			let res = await cox.$axios.$get(`/nests/id/${cox.params.nest}`);
			if (!res.success) throw res.message;
			// check app srl
			if (parseInt(res.data.app_srl) !==  cox.store.state.env.api.app_srl) throw 'Not found data';
			console.log(res.data.app_srl, cox.store.state.env.api.app_srl);
		}
		catch(e)
		{
			return 'Service error';
		}
		return;

		try
		{
			let [ categories, articles ] = await Promise.all([
				null,
				null,
				cox.$axios.$get('/articles' + util.serialize(params.article, true))
			]);
			console.log(nest);
			if (!(nest && categories && articles)) throw 'Service error';
			if (!articles.success) throw articles.message;
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : 'Service error' };
		}
	},
	methods: {
		async onChangePage(page)
		{
			this.params.page = page;
		}
	}
}
</script>