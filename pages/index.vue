<template>
<article class="index">
	<h1 class="index__hidden-title">{{title}}</h1>
	<header class="index__header">
		<h2 class="index__title">Newest articles</h2>
	</header>
	<items-index
		:index="index"
		:loading="loading"
		:error="error"
		:skin="indexSkin"
		class="index__body"/>
	<nav v-if="usePagination" class="nav-paginate">
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
				field: 'srl,nest_srl,json,title',
				order: 'regdate',
				sort: 'desc',
				page,
				ext_field: '',
			};
			if (state.env.app.app_srl) params.app = state.env.app.app_srl;
			if (state.env.app.intro.newest.size) params.size = state.env.app.intro.newest.size;
			if (state.env.app.intro.newest.showMeta.nestName) params.ext_field += 'nest_name';
			if (state.env.app.intro.newest.showMeta.date) params.field += ',regdate';
			if (state.env.app.intro.newest.showMeta.hit) params.field += ',hit';
			if (state.env.app.intro.newest.showMeta.star) params.field += ',star';

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
			return {
				error: (typeof e === 'string') ? e : 'Service error',
				index: null,
				total: 0,
			};
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
		indexSkin()
		{
			return this.$store.state.env.app.intro.newest.listStyle;
		},
		title()
		{
			return this.$store.state.env.app.name;
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
		}
	}
}
</script>
