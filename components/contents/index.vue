<template>
<div class="body" :class="[ loading && 'body--loading' ]">
	<div v-if="(computedIndex && computedIndex.length)" class="articles">
		<div v-for="(item) in computedIndex" class="item">
			<nuxt-link :to="`/article/${item.srl}`" class="item__wrap">
				<figure class="item__image">
					<img v-if="item.image" :src="`${item.image}`" :alt="item.title">
					<span v-else>
						<img :src="`/images/empty/${randomNumber(0,20)}.svg`" alt="">
					</span>
				</figure>
				<div class="item__body">
					<strong>{{item.title}}</strong>
					<p>
						<span>{{item.date}}</span>
						<span>{{item.categoryName}}</span>
					</p>
				</div>
			</nuxt-link>
		</div>
	</div>
	<article v-else class="empty">
		<figure>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<path d="M0 0h24v24H0z" fill="none"/>
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" fill="currentColor"/>
			</svg>
		</figure>
		<h1>no item</h1>
	</article>

	<div v-if="loading" class="loading">
		<loading :show="true"/>
	</div>
</div>
</template>

<style src="./index.scss" lang="scss" scoped></style>
<script>
import * as datasets from '~/assets/libs/datasets';

export default {
	components: {
		'loading': () => import('~/components/loading'),
	},
	props: {
		index: { type: Array, default: [] },
		loading: { type: Boolean, default: false },
		error: { type: String, default: null },
	},
	computed: {
		computedIndex()
		{
			return this.index.map((o) => {
				return {
					srl: o.srl,
					url: `/article/${o.srl}`,
					title: o.title,
					date: datasets.getFormatDate(o.regdate, false),
					categoryName: o.category_name,
					image: (o.json && o.json.thumbnail && o.json.thumbnail.path) ? `${this.$store.state.env.api.url}/${o.json.thumbnail.path}` : null,
				};
			});
		},
	},
	methods: {
		randomNumber(min, max)
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
	}
}
</script>
