<template>
	<svg v-if="type === 'prev'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
		<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
		<path d="M0 0h24v24H0z" fill="none"/>
	</svg>
	<svg v-else-if="type === 'next'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
		<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
		<path d="M0 0h24v24H0z" fill="none"/>
	</svg>
	<svg v-else-if="type === 'first'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
		<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
		<path fill="none" d="M24 24H0V0h24v24z"/>
	</svg>
	<svg v-else-if="type === 'last'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
		<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
		<path fill="none" d="M0 0h24v24H0V0z"/>
	</svg>
</template>

<script>
export default {
	props: {
		type: { type: String, default: 'prev' }, // prev,next,first,last
		size: { type: Number, default: 24 },
	},
}
</script>