<template>
<article class="index">
	<header class="index__header">
		<h1 class="index__title">Newest articles</h1>
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
				:page-range="2"
				:first-last-button="false"
				:hide-prev-next="true"
				@input="onChangePage"/>
		</div>
		<div class="nav-paginate__desktop">
			<nav-paginate
				v-if="!!total"
				v-model="page"
				:total="total"
				:size="size"
				:page-range="8"
				:first-last-button="false"
				:hide-prev-next="true"
				@input="onChangePage"/>
		</div>
	</nav>
</article>
</template>

<script>
import * as util from '~/assets/libs/util';

export default {
	name: 'page-intro',
	components: {
		'items-index': () => import('~/components/contents/index'),
		'nav-paginate': () => import('~/components/navigation/paginate'),
	},
	async asyncData(cox)
	{
		try
		{
			const { state } = cox.store;
			const { env } = state;
			let page = (cox.route.query && cox.route.query.page) ? parseInt(cox.route.query.page) : 1;
			let params = {
				field: 'srl,nest_srl,json,title',
				order: 'regdate',
				sort: 'desc',
				page,
				ext_field: '',
			};
			if (env.app.app_srl) params.app = env.app.app_srl;
			if (env.app.intro.newest.size) params.size = env.app.intro.newest.size;
			if (env.app.intro.newest.showMeta.nestName) params.ext_field += 'nest_name';
			if (env.app.intro.newest.showMeta.date) params.field += ',regdate';
			if (env.app.intro.newest.showMeta.hit) params.field += ',hit';
			if (env.app.intro.newest.showMeta.star) params.field += ',star';

			let res = await cox.$axios.$get('/articles/' + util.serialize(params, true));
			if (!res.success) throw new Error(res.message);
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
				error: e.message || 'Service error',
				index: null,
				total: 0,
				loading: false,
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
}
</script>

<style src="./index.scss" lang="scss" scoped/>
