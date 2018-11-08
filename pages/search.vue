<template>
<article class="index">
	<header class="index__header">
		<h1>Search keyword: {{keyword}}</h1>
	</header>
	<items-index
		:index="index"
		:loading="loading"
		:error="error"
		:skin="indexSkin"
		class="index__body"/>
	<nav class="nav-paginate">
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
	</nav>
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
	head()
	{
		return {
			title: `Search result ${this.keyword} on ${this.$store.state.env.app.name}`,
		};
	},
	async asyncData(cox)
	{
		const { route, store } = cox;
		const { state } = store;
		let keyword = route.query.q;
		let page = (cox.route.query && cox.route.query.page) ? parseInt(cox.route.query.page) : 1;

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

		try
		{
			let res = await cox.$axios.$get('/articles' + util.serialize(params, true));
			if (!res.success) throw res.message;

			return {
				keyword,
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
			return {
				keyword,
				params,
				error: (typeof e === 'string') ? e : 'Service error',
				index: null,
				total: 0,
				loading: false,
			};
		}
	},
	computed: {
		indexSkin()
		{
			return this.$store.state.env.app.search.listStyle;
		},
	},
	methods: {
		async onChangePage(page)
		{
			let params = { q: this.params.q };
			if (page > 1) params.page = page;
			this.$router.push(`${this.$route.path}${util.serialize(params, true)}`);
			this.params.page = page;
			try
			{
				this.loading = true;
				let res = await this.$axios.$get('/articles' + util.serialize(this.params, true));
				if (!res.success) throw res.message;
				this.index = res.data.index;
				this.total = res.data.total;
				this.error = null;
				await util.sleep(100);
				this.loading = false;
			}
			catch(e)
			{
				this.loading = false;
				this.error = (typeof e === 'string') ? e : 'Service error';
				this.index = null;
				this.total = 0;
			}
		},
	},
};
</script>