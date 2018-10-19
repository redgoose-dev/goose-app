<template>
<article class="index">
	<header class="index__header">
		<h1>Newest articles</h1>
	</header>
	<items-index :index="index" :loading="loading" :error="error" class="index__body"/>
	<div v-if="usePagination" class="nav-paginate">
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
			const { state } = cox.store;
			let page = (cox.route.query && cox.route.query.page) ? parseInt(cox.route.query.page) : 1;
			let params = {
				field: 'srl,nest_srl,json,title,regdate',
				order: 'regdate',
				sort: 'desc',
				page,
				ext_field: 'nest_name',
			};
			if (state.env.app.app_srl) params.app = state.env.app.app_srl;
			if (state.env.app.intro.newest.size) params.size = state.env.app.intro.newest.size;

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
	computed: {
		usePagination()
		{
			try
			{
				return !!this.$store.state.env.app.intro.newest.pagination;
			}
			catch(e)
			{
				return false;
			}
		},
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
