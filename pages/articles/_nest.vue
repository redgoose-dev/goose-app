<template>
<article class="index">
	<header class="index__header">
		<h1>{{title}}</h1>
		<nav v-if="computedCategories && computedCategories.length">
			<ul>
				<li v-for="(o,k) in computedCategories" :class="[o.active && 'on']">
					<a :href="o.url" :data-srl="o.srl" @click="onClickCategoryItem">
						<span>{{o.name}}</span>
						<em>{{o.count}}</em>
					</a>
				</li>
			</ul>
		</nav>

		<div>
			<p>category: {{$route.query.category}}</p>
		</div>
	</header>
</article>
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
		const { state } = cox.store;
		const { query } = cox.route;
		let nest_id = cox.route.params.nest;
		let category_srl = query.category ? parseInt(query.category) : null;
		let page = (query && query.page) ? parseInt(query.page) : 1;

		// set params
		let params = {
			nest_id,
			field: 'srl,category_srl,json,title,regdate',
			page,
			ext_field: 'category_name,count_article',
		};
		if (state.env.app.app_srl) params.app = state.env.app.app_srl;
		if (category_srl) params.category = category_srl;
		if (state.env.app.index.size) params.size = state.env.app.index.size;

		// get data
		try
		{
			let res = await cox.$axios.$get('/articles/extend' + util.serialize(params, true));
			if (!res.success) throw res.message;
			return {
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
			return { error: (typeof e === 'string') ? e : 'Service error' };
		}
	},
	computed: {
		title()
		{
			return this.nest.name || 'Articles index';
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
		}
	},
	methods: {
		async onChangePage(page)
		{
			//
		},
		async onClickCategoryItem(e)
		{
			e.preventDefault();
			let srl = e.currentTarget.dataset.srl || null;

			console.log('on click category item', srl);
		}
	}
}
</script>