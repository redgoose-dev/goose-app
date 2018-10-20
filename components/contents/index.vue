<template>
<div class="body" :class="[ loading && 'body--loading' ]">
	<div v-if="loading" class="loading">
		<loading :show="true"/>
	</div>
	<div v-else-if="!loading && (computedIndex && computedIndex.length)" class="articles">
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
						<span v-if="item.date">{{item.date}}</span>
						<span v-if="item.nestName">{{item.nestName}}</span>
						<span v-if="item.categoryName">{{item.categoryName}}</span>
						<span v-if="item.hit">Hit:{{item.hit}}</span>
						<span v-if="item.star">Like:{{item.star}}</span>
					</p>
				</div>
			</nuxt-link>
		</div>
	</div>
	<error-body v-else :message="error"/>
</div>
</template>

<style src="./index.scss" lang="scss" scoped></style>
<script>
import * as datasets from '~/assets/libs/datasets';

export default {
	components: {
		'loading': () => import('~/components/loading'),
		'error-body': () => import('~/components/error/body'),
	},
	props: {
		index: { type: Array, default: [] },
		loading: { type: Boolean, default: false },
		error: { type: String, default: null },
	},
	computed: {
		computedIndex()
		{
			if (!this.index) return [];
			return this.index.map((o) => {
				let result = {
					srl: o.srl,
					url: `/article/${o.srl}`,
					title: o.title,
					date: o.regdate ? datasets.getFormatDate(o.regdate, false) : null,
					image: (o.json && o.json.thumbnail && o.json.thumbnail.path) ? `${this.$store.state.env.api.url}/${o.json.thumbnail.path}` : null,
					star: o.star,
					hit: o.hit,
				};
				if (o.category_name) result.categoryName = o.category_name;
				if (o.nest_name) result.nestName = o.nest_name;
				return result;
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
