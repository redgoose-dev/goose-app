<template>
<article class="error-body">
	<figure>
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
			<path d="M0 0h24v24H0z" fill="none"/>
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" fill="currentColor"/>
		</svg>
	</figure>
	<h1>{{message}}</h1>
</article>
</template>

<script>
export default {
	props: {
		message: { type: String, default: 'Service error' },
	},
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/libs/valiables";
@import "../../assets/css/libs/mixins";

.error-body {
	text-align: center;
	padding: 10vh 0 12vh;
	figure {
		margin: 0;
		svg {
			color: $color-key;
			width: 100px;
			height: 100px;
		}
	}
	h1 {
		margin: 10px 0 0;
		font-size: 24px;
		font-weight: 600;
	}

	@include responsive(tablet) {
		margin-top: 10px;
		padding: 12vh 0;
	}
}
</style>