<template>
<main>
	<header class="header">
		<div class="header__body">
			<h1 class="header__logo">
				<a href="/">
					<img src="/images/ico-logo.svg" alt="redgoose">
				</a>
			</h1>
			<nav class="header__navigation" id="headerNavigation">
				<button type="button" title="toggle navigation" class="dropdown-button">
					<img src="/images/ico-menu.svg" class="on" alt="menu">
					<img src="/images/ico-close.svg" class="off" alt="close menu">
				</button>
				<div class="header-navigation dropdown-content">
					<ul>
						<li v-for="(o,k) in navigation">
							<a v-if="o.external" :href="o.url" :target="o.target">
								{{o.label}}
							</a>
							<nuxt-link v-else :to="o.url">
								{{o.label}}
							</nuxt-link>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div class="header__search" id="headerSearch">
			<button type="button" title="toggle search form" class="dropdown-button">
				<img src="/images/ico-search.svg" class="on" alt="search">
				<img src="/images/ico-close.svg" class="off" alt="close menu">
			</button>
			<div class="header-search dropdown-content">
				<form action="/search" method="get" @submit="onSubmit">
					<fieldset>
						<legend>search keyword form</legend>
						<span>
							<input type="text" name="q" placeholder="Please search keyword" value="">
							<button type="reset" title="clear search keyword">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"/>
									<path d="M0 0h24v24H0z" fill="none"/>
								</svg>
							</button>
						</span>
					</fieldset>
					<nav>
						<button type="submit">
							<img src="/images/ico-search.svg" alt="search">
						</button>
					</nav>
				</form>
			</div>
		</div>
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

<style src="./default.scss" lang="scss" scoped></style>
<script>
export default {
	computed: {
		navigation()
		{
			return this.$store.state.env.navigation.map((o) => {
				return {
					key: o.key,
					label: o.label,
					url: o.url,
					target: o.target,
					external: /^http/.test(o.url),
					active: false, // TODO
				};
			});
		},
	},
	data()
	{
		return {
			copyright: this.$store.state.env.app.copyright,
		};
	},
	mounted()
	{
		try
		{
			let getPreference = window.localStorage.getItem('preference');
			if (getPreference)
			{
				this.$store.dispatch('updatePreference', JSON.parse(getPreference));
			}
		}
		catch(e)
		{}
	},
	methods: {
		onSubmit(e)
		{
			e.preventDefault();
		}
	}
}
</script>