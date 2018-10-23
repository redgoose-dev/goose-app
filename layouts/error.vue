<template>
<article class="error">
	<figure class="error__image">
		<img :src="symbol" alt="redgoose">
	</figure>
	<h1 class="error__title">{{message}}</h1>
	<h2 class="error__message">{{error.message}}</h2>
	<!--<p class="error__code">{{error.statusCode}}</p>-->
</article>
</template>

<script>
export default {
	props: {
		error: {}
	},
	computed: {
		symbol()
		{
			return this.$store.state.env.app.error.symbol;
		},
		message()
		{
			return this.$store.state.env.app.error.message;
		}
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
	&__title {
		margin: 15px 0 0;
		font-weight: 600;
		font-size: 36px;
		line-height: 1;
	}
	&__message {
		margin: 10px 0 0;
		font-size: 13px;
		line-height: 1.25;
		font-weight: 400;
	}

	@include responsive(tablet) {
		&__image {
			img {
				width: 40vw;
				max-width: 400px;
			}
		}
		&__title {
			font-size: 44px;
		}
		&__message {
			font-size: 15px;
		}
	}
}
</style>
