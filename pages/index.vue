<template>
<article class="index">
	<header class="index__header">
		<h1>Newest articles</h1>
	</header>
	<items-index :index="index" :loading="loading" :error="error" class="index__body"/>
	<div class="nav-paginate">
		<div class="nav-paginate__mobile">
			<nav-paginate
				v-if="!!total"
				v-model="page"
				:total="total"
				:size="size"
				:pageRange="2"
				:firstLastButton="false"
				:hidePrevNext="true"
				@input="onChangePage"/>
		</div>
		<div class="nav-paginate__desktop">
			<nav-paginate
				v-if="!!total"
				v-model="page"
				:total="total"
				:size="size"
				:page-range="8"
				:firstLastButton="false"
				:hidePrevNext="true"
				@input="onChangePage"/>
		</div>
	</div>
</article>
</template>

<script>
import * as util from '~/assets/libs/util';

export default {
	name: 'Intro',
	components: {
		'items-index': () => import('~/components/contents/index'),
		'nav-paginate': () => import('~/components/navigation/paginate'),
	},
	async asyncData(cox)
	{
		try
		{
			let page = (cox.route.query && cox.route.query.page) ? parseInt(cox.route.query.page) : 1;
			let params = {
				field: 'srl,category_srl,json,title,regdate',
				order: 'regdate',
				sort: 'desc',
				page,
				ext_field: 'category_name',
			};
			if (cox.store.state.env.api.app_srl) params.app = cox.store.state.env.api.app_srl;
			if (cox.store.state.env.api.size) params.size = cox.store.state.env.api.size;

			let res = await cox.$axios.$get('/articles' + util.serialize(params, true));
			if (!res.success) throw res.message;
			return {
				params,
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
			return { error: (typeof e === 'string') ? e : 'Service error' };
		}
	},
	methods: {
		async onChangePage(page)
		{
			this.$router.push(`${this.$route.path}${page > 1 ? `?page=${page}` : ''}`);
			this.params.page = page;

			try
			{
				this.loading = true;
				let res = await this.$axios.$get('/articles' + util.serialize(this.params, true));
				if (!res.success) throw res.message;
				this.index = res.data.index;
				this.total = res.data.total;
				await util.sleep(100);
				this.loading = false;
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
