<template>
	<p>articles page: {{id}}</p>
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
		let id = cox.route.params.nest;
		return { id };

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
			//console.log(res.data.app_srl, cox.store.state.env.api.app_srl);
		}
		catch(e)
		{
			return 'Service error';
		}
		return;

		try
		{
			// TODO: call api
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : 'Service error' };
		}
	},
	methods: {}
}
</script>