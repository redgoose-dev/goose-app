<template>
<div>
	<div v-if="(index && index.length)" class="articles">
		<div v-for="(item,key) in index" class="item">
			<nuxt-link :to="`/article/${item.srl}`" class="item__wrap">
				<figure class="item__image">
					<img v-if="item.image" :src="`${item.image}`" :alt="item.title">
					<span v-else>
						TODO
						<!--<img src="{{__ROOT__}}/assets/images/empty/{{rand(0,20)}}.svg" alt="">-->
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

	<hr>
	<div class="paginate">
		.paginate
	</div>
</div>
</template>

<style src="./index.scss" lang="scss" scoped></style>
<script>
export default {
	props: {
		index: { type: Array, default: [] },
		total: { type: Number, default: 0 },
	},
}
</script>