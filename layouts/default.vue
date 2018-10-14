<template>
<main>
	<header class="header">
		<div class="header__body">
			<h1 class="header__logo">
				<nuxt-link to="/">
					<img src="/images/ico-logo.svg" alt="redgoose">
				</nuxt-link>
			</h1>
		</div>
		<nav class="header__navigation" id="headerNavigation">
			<button type="button" title="toggle navigation" class="dropdown-button">
				<img src="/images/ico-menu.svg" class="on" alt="menu">
				<img src="/images/ico-close.svg" class="off" alt="close menu">
			</button>
		</nav>
	</header>

	<div class="container">
		<nuxt/>
	</div>

	<footer class="footer">
		<p class="footer__copyright">
			{{copyright}}
		</p>
	</footer>
</main>
</template>

<script>
export default {
	computed: {
		copyright()
		{
			// TODO
			return '0000';
		},
	},
}
</script>