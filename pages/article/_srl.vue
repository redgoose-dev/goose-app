<template>
<article v-if="!error" class="article">
	<header class="article__header">
		<h1>{{fields.title}}</h1>
		<p>
			<span>{{fields.nest}}{{fields.category && ` / ${fields.category}`}}</span>
			<span>Hit:{{fields.hit}}</span>
			<span>{{fields.regdate}}</span>

		</p>
	</header>

	<div v-html="fields.body" class="article__content" :class="[ showBody && 'article__content--show' ]"></div>

	<nav class="article__nav">
		<nuxt-link :to="beforePath" title="back" class="list">
			<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12">
				<g fill="none" fill-rule="evenodd">
					<path fill="#000" d="M7.41 1.41L6 0 0 6l6 6 1.41-1.41L2.83 6z"/>
					<path d="M-8-6h24v24H-8z"/>
				</g>
			</svg>
		</nuxt-link>
		<button
			type="button"
			data-srl="11"
			class="like"
			@click="onClickStar"
			:class="[ !!fields.selectedStar && 'on' ]"
			:disabled="!!fields.selectedStar">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="129.184 102.606 25.632 23.517">
				<path d="M13,24.123l-1.858-1.692C4.542,16.446.184,12.5.184,7.655A6.981,6.981,0,0,1,7.233.606,7.673,7.673,0,0,1,13,3.285,7.676,7.676,0,0,1,18.767.606a6.981,6.981,0,0,1,7.049,7.049c0,4.844-4.358,8.791-10.958,14.789Z" transform="translate(129 102)"></path>
			</svg>
			<em>{{fields.star}}</em>
		</button>
	</nav>
</article>
<div v-else>
	.error-body
</div>
</template>

<script>
import marked from 'marked';
import * as util from '~/assets/libs/util';
import * as datasets from '~/assets/libs/datasets';

export default {
	name: 'page-article',
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	head()
	{
		const { fields, $store } = this;
		let title = `${fields.title} on ${$store.state.env.app.name}`;
		let meta = [
			{ hid: 'og:title', property: 'og:title', content: title },
		];
		if (fields.coverImage)
		{
			meta.push({
				hid: 'og:image',
				property: 'og:image',
				content: fields.coverImage
			});
		}
		return {
			title: title,
			meta,
		};
	},
	async asyncData(cox)
	{
		const { req, res } = cox;
		let srl = cox.params.srl;
		let checkStar = util.getCookie(req || null, `redgoose-like-${srl}`);
		let checkHit = util.getCookie(req || null, `redgoose-hit-${srl}`);

		// if cookie has hit, hit +1
		if (!checkHit)
		{
			util.setCookie(res || null, `redgoose-hit-${srl}`, 1);
		}

		let params = {
			hit: checkHit ? 0 : 1,
			ext_field: 'category_name,nest_name',
		};
		try
		{
			let res = await cox.$axios.$get(`/articles/${srl}${util.serialize(params, true)}`);
			if (!(res.success && res.data)) throw res.message;
			return {
				data: {
					...res.data,
					content: marked(res.data.content),
					selectedStar: !!checkStar,
				},
				beforePath: '/',
				error: null,
				showBody: false,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : 'no item' };
		}
	},
	computed: {
		fields()
		{
			const { $store, data } = this;
			return {
				title: data.title,
				nest: data.nest_name,
				category: data.category_name,
				regdate: datasets.getFormatDate(data.regdate, false),
				body: data.content,
				hit: parseInt(data.hit || 0),
				star: parseInt(data.star || 0),
				selectedStar: !!data.selectedStar,
				coverImage: (data.json && data.json.thumbnail && data.json.thumbnail.path) ? $store.state.env.api.url + '/' + data.json.thumbnail.path : null,
			};
		}
	},
	beforeRouteEnter(to, from, next)
	{
		next(vm => {
			vm.beforePath = from.fullPath;
			next();
		});
	},
	mounted()
	{
		// filtering content body
		this.data.content = this.filteringContentBody(this.fields.body);
		this.showBody = true;
	},
	methods: {
		async onClickStar(e)
		{
			this.data.selectedStar = true;
			try
			{
				let srl = parseInt(this.data.srl);
				let res = await this.$axios.$get(`/articles/${srl}/update?type=star`);
				if (!res.success) throw 'Failed update';
				this.data.star = res.data.star;
				util.setCookie(res || null, `redgoose-like-${srl}`, 1);
			}
			catch(e)
			{
				alert('Failed update like');
				this.data.selectedStar = false;
			}
		},
		filteringContentBody(body)
		{
			function wrap(elem)
			{
				const span = document.createElement('span');
				span.classList.add('image');
				elem.parentElement.insertBefore(span, elem);
				span.appendChild(elem);
			}

			let html = document.createElement('div');
			html.innerHTML = body;
			let images = html.querySelectorAll('img');
			images.forEach((img) => wrap(img));

			return html.innerHTML;
		}
	}
}
</script>