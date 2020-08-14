<template>
<div :class="[
	'loading',
	move && 'loading-move',
]">
	<div v-if="show" class="loading__loader">
		<div class="loading__shadow"></div>
		<div class="loading__box"></div>
	</div>
</div>
</template>

<script>
let mounted = false;
export default {
	props: {
		move: { type: Boolean, default: false }
	},
	data()
	{
		return { show: false };
	},
	mounted()
	{
		mounted = true;
		setTimeout(() => {
			if (mounted) this.show = true;
		}, 200);
	},
	beforeDestroy()
	{
		mounted = false;
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/css/libs/valiables";

// loading
.loading {
	$self: '.rg-loading';

	position: relative;
	height: 20vw;
	min-height: 250px;
	width: 40%;
	min-width: 300px;
	margin: 0 auto;
	background: transparent;

	&__loader {
		position: absolute;
		top: calc(50% - 30px);
		left: calc(50% - 30px);
	}
	&__box {
		width: 50px;
		height: 50px;
		background: $color-key;
		animation: animate .5s linear infinite;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 3px;
		@keyframes animate {
			17% { border-bottom-right-radius: 3px; }
			25% { transform: translateY(9px) rotate(22.5deg); }
			50% {
				transform: translateY(18px) scale(1,.9) rotate(45deg) ;
				border-bottom-right-radius: 40px;
			}
			75% { transform: translateY(9px) rotate(67.5deg); }
			100% { transform: translateY(0) rotate(90deg); }
		}
	}
	&__shadow {
		width: 50px;
		height: 5px;
		background: #000;
		opacity: 0.1;
		position: absolute;
		top: 59px;
		left: 0;
		border-radius: 50%;
		animation: shadow .5s linear infinite;
		@keyframes shadow {
			50% {
				transform: scale(1.2,1);
			}
		}
	}

	&-move {
		#{$self}__loader {
			animation: loader 3s linear infinite;
			@keyframes loader {
				0% { left: -20px }
				100% { left: 90%; }
			}
		}
	}
}
</style>