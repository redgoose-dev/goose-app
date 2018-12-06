<template>
<article class="index" :class="[ `index--skin-${indexSkin}` ]">
	<header v-if="title" class="index__header">
		<h1 class="index__title">{{title}}</h1>
		<nav v-if="computedCategories && computedCategories.length">
			<ul>
				<li v-for="(o,k) in computedCategories" :key="k" :class="[o.active && 'on']">
					<a :href="o.url" :data-srl="o.srl" @click="onClickCategoryItem">
						<span>{{o.name}}</span>
						<em>{{o.count}}</em>
					</a>
				</li>
			</ul>
		</nav>
	</header>

	<items-index
		:index="index"
		:loading="loading"
		:error="error"
		:skin="indexSkin"
		class="index__body"/>

	<nav v-if="usePagination && total > 0" class="nav-paginate">
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
	name: 'articles-index',
	components: {
		'items-index': () => import('~/components/contents/index'),
		'nav-paginate': () => import('~/components/navigation/paginate'),
	},
	validate(cox)
	{
		return cox.params.nest && /^[0-9A-Za-z_-]+$/.test(cox.params.nest);
	},
	head()
	{
		let title = `${this.title} on ${this.$store.state.env.app.name}`;
		return {
			title,
			meta: [
				{ hid: 'og:title', property: 'og:title', content: title },
			],
		};
	},
	data()
	{
		return {
			index: null,
			total: 0,
			loading: false,
			error: null,
		};
	},
	async asyncData(cox)
	{
		const { state } = cox.store;
		const { query } = cox.route;
		let nest_id = cox.route.params.nest;
		let category_srl = query.category ? parseInt(query.category) : null;
		let page = (query && query.page) ? parseInt(query.page) : 1;

		// set params
		let params = {
			nest_id,
			field: 'srl,category_srl,json,title',
			order: 'srl',
			sort: 'desc',
			page,
			ext_field: 'count_article',
		};
		if (state.env.app.app_srl) params.app = state.env.app.app_srl;
		if (category_srl) params.category = category_srl;
		if (state.env.app.index.size) params.size = state.env.app.index.size;
		if (state.env.app.index.showMeta.categoryName) params.ext_field += ',category_name';
		if (state.env.app.index.showMeta.date) params.field += ',regdate';
		if (state.env.app.index.showMeta.hit) params.field += ',hit';
		if (state.env.app.index.showMeta.star) params.field += ',star';

		// get data
		try
		{
			let res = await cox.$axios.$get('/articles/extend' + util.serialize(params, true));
			if (!res.success) throw res.message;
			delete params.nest_id;
			return {
				params: {
					...params,
					nest: parseInt(res.data.nest.srl),
					ext_field: 'category_name',
				},
				nest_id,
				category_srl,
				nest: res.data.nest,
				categories: res.data.categories,
				index: res.data.index,
				total: res.data.total,
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
				loading: false,
			};
		}
	},
	computed: {
		title()
		{
			if (this.nest && this.nest.name)
			{
				return this.nest.name;
			}
			else
			{
				let exp = new RegExp(`^${this.$route.path}`);
				let label = null;
				this.$store.state.env.app.header.navigation.forEach((o) => {
					if (exp.test(o.url)) label = o.label;
				});
				return label || null;
			}
		},
		computedCategories()
		{
			if (!(this.categories && this.categories.length)) return [];

			return this.categories.map((o, k) => {
				let srl = o.srl ? parseInt(o.srl) : null;
				return {
					srl,
					name: o.name,
					count: o.count_article || 0,
					url: `/articles/${this.nest_id}${srl ? `?category=${srl}` : ''}`,
					active: srl === this.category_srl,
				};
			});
		},
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
			return this.$store.state.env.app.index.listStyle;
		},
	},
	methods: {
		async onChangePage(page)
		{
			this.params.page = page;

			// change route
			let paramsForRoute = {};
			if (this.params.category) paramsForRoute.category = this.params.category;
			if (page > 1) paramsForRoute.page = page;
			this.$router.push(`${this.$route.path}${util.serialize(paramsForRoute, true)}`);

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
				this.index = null;
				this.total = 0;
				this.error = (typeof e === 'string') ? e : 'Service error';
			}
		},
		async onClickCategoryItem(e)
		{
			e.preventDefault();
			if (this.loading) return;

			// set srl
			let srl = e.currentTarget.dataset.srl ? parseInt(e.currentTarget.dataset.srl) : null;
			if (srl)
			{
				this.params.category = srl;
			}
			else if (this.params.category)
			{
				delete this.params.category;
			}

			// change status
			this.loading = true;
			this.category_srl = srl;
			this.page = 1;
			this.params.page = 1;

			// change route
			this.$router.push(`${this.$route.path}${util.serialize(srl ? { category: srl } : null, true)}`);

			try
			{
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
				this.index = null;
				this.total = 0;
				this.error = (typeof e === 'string') ? e : 'Service error';
			}
		},
	}
}
</script>