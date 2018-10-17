<template>
<article v-if="!error" class="article">
	<header class="article__header">
		<h1>{{fields.title}}</h1>
		<p>
			<span>{{fields.nest}}{{fields.category && ` / ${fields.category}`}}</span>
			<span>{{fields.regdate}}</span>
		</p>
	</header>

	<div v-html="fields.body" class="article__content" :class="[ showBody && 'article__content--show' ]"></div>

	<nav class="article__nav">
		<nuxt-link :to="beforePath" class="list">
			<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12">
				<g fill="none" fill-rule="evenodd">
					<path fill="#000" d="M7.41 1.41L6 0 0 6l6 6 1.41-1.41L2.83 6z"/>
					<path d="M-8-6h24v24H-8z"/>
				</g>
			</svg>
			<em>back</em>
		</nuxt-link>
		<button
			type="button"
			id="button_like"
			data-srl="11"
			class="like"
			@click="onClickStar"
			:class="[ !!false && 'on' ]"
			:disabled="!!false">
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

<style src="./_srl.scss" lang="scss"></style>
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
	async asyncData(cox, app)
	{
		let srl = cox.params.srl;
		let params = {
			hit: 0, // TODO: 쿠키에 따라 1로 바꿔야함
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
			return {
				title: this.data.title,
				nest: this.data.nest_name,
				category: this.data.category_name,
				regdate: datasets.getFormatDate(this.data.regdate, false),
				body: this.data.content,
				star: parseInt(this.data.star || 0),
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
		onClickStar(e)
		{
			console.log('on click star');
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