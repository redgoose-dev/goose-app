<template>
<article class="index">
	<header class="index__header">
		<h1>Newest articles</h1>
	</header>

	<items-index :index="index" :total="total"/>
</article>
</template>

<style src="./index.scss" lang="scss" scoped></style>
<script>
import * as util from '~/assets/libs/util';
import * as datasets from '~/assets/libs/datasets';

export default {
	name: 'Intro',
	components: {
		'items-index': () => import('~/components/contents/index'),
	},
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get('/articles' + util.serialize({
				field: 'srl,category_srl,json,title,regdate',
				order: 'regdate',
				sort: 'desc',
				app: cox.store.state.env.api.app_srl,
				size: cox.store.state.env.api.size,
				page: 1,
				ext_field: 'category_name',
			}, true));
			if (!res.success) throw res.message;
			return {
				total: res.data.total,
				index: datasets.convertIndex(res.data.index, cox.store.state),
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : 'Service error' };
		}
	},
	methods: {}
}
</script>
