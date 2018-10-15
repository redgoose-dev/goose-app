<template>
<article class="error">
	<figure class="error__image">
		<img src="/images/img-symbol-line.png" alt="redgoose">
	</figure>
	<p class="error__code">{{error.statusCode}}</p>
	<h1 class="error__message">{{error.message}}</h1>
</article>
</template>

<script>
export default {
	props: {
		error: {}
	},
}
</script>
<style lang="scss" scoped>
@import "../assets/css/libs/valiables";
@import "../assets/css/libs/mixins";

.error {
	padding: 0;
	text-align: center;

	&__image {
		margin: 0;
		img {
			display: block;
			width: 60vw;
			min-width: 240px;
			margin: 0 auto;
		}
	}
	&__code {
		margin: 10px 0 0;
		font-size: 14px;
		font-family: $font-console;
		line-height: 1;
	}
	&__message {
		margin: 5px 0 0;
		font-size: 24px;
		font-family: $font-eng;
		line-height: 1.25;
	}

	@include responsive(tablet) {
		&__image {
			img {
				width: 40vw;
				max-width: 400px;
			}
		}
	}
}
</style>
