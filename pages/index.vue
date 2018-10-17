<template>
<article class="index">
	<header class="index__header">
		<h1>Newest articles</h1>
	</header>
	<items-index
		:index="index"
		:total="total"
		:loading="loading"
		:error="error"
		:size="params.size"
		@changePage="onChangePage"
		class="index__body"/>
</article>
</template>

<style src="./index.scss" lang="scss" scoped></style>
<script>
import * as util from '~/assets/libs/util';

export default {
	name: 'Intro',
	components: {
		'items-index': () => import('~/components/contents/index'),
	},
	async asyncData(cox)
	{
		try
		{
			let params = {
				field: 'srl,category_srl,json,title,regdate',
				order: 'regdate',
				sort: 'desc',
				app: cox.store.state.env.api.app_srl,
				size: cox.store.state.env.api.size,
				page: 1,
				ext_field: 'category_name',
			};

			let res = await cox.$axios.$get('/articles' + util.serialize(params, true));
			if (!res.success) throw res.message;
			return {
				params,
				total: res.data.total,
				index: res.data.index,
				page: 1,
				loading: false,
				error: null,
			};
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
			try
			{
				this.loading = true;
				let res = await this.$axios.$get('/articles' + util.serialize(this.params, true));
				if (!res.success) throw res.message;
				this.index = res.data.index;
				this.total = res.data.total;
				this.loading = false;
				// TODO: router.push() 작업하기
			}
			catch(e)
			{
				this.loading = false;
				return { error: (typeof e === 'string') ? e : 'Service error' };
			}
		}
	}
}
</script>
