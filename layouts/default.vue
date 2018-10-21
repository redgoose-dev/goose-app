<template>
<main>
	<header class="header">
		<div class="header__body">
			<h1 class="header__logo">
				<a href="/">
					<img src="/images/ico-logo.svg" alt="redgoose">
				</a>
			</h1>
			<nav class="header__navigation" :class="[ showNavigation && 'active' ]">
				<button type="button" title="toggle navigation" @click="onClickToggleNavigation" class="dropdown-button">
					<img src="/images/ico-menu.svg" class="on" alt="menu">
					<img src="/images/ico-close.svg" class="off" alt="close menu">
				</button>
				<div
					@click="onClickDropdown"
					class="header-navigation dropdown-content"
					:class="[ showNavigation && 'active' ]">
					<ul>
						<li v-for="(o,k) in navigation" :class="[ o.active && 'active' ]">
							<a v-if="o.external" :href="o.url" :target="o.target">{{o.label}}</a>
							<a
								v-else
								:href="o.url"
								@click="onClickNavigationMenu">
								{{o.label}}
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div class="header__search" :class="[ showSearchForm && 'active' ]">
			<button type="button" title="toggle search form" @click="onClickToggleSearchForm" class="dropdown-button">
				<img src="/images/ico-search.svg" class="on" alt="search">
				<img src="/images/ico-close.svg" class="off" alt="close menu">
			</button>
			<div
				@click="onClickDropdown"
				class="header-search dropdown-content"
				:class="[ showSearchForm && 'active' ]">
				<form action="/search" method="get" @submit="onSubmitSearchKeyword">
					<fieldset>
						<legend>search keyword form</legend>
						<span>
							<input
								ref="searchKeyword"
								type="text"
								name="q"
								placeholder="Please search keyword"
								:value="searchKeyword">
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
		<p class="footer__copyright">{{copyright}}</p>
	</footer>
</main>
</template>

<style src="./default.scss" lang="scss" scoped></style>
<script>
import * as util from '~/assets/libs/util';

export default {
	data()
	{
		// update search keyword
		this.$store.commit('updateSearchKeyword', (this.$route.query && this.$route.query.q) ? this.$route.query.q : '');

		return {
			showNavigation: false,
			showSearchForm: false,
			copyright: this.$store.state.env.app.copyright,
		};
	},
	computed: {
		navigation()
		{
			let exp = new RegExp(`^${this.$route.path}`);
			return this.$store.state.env.navigation.map((o) => {
				return {
					key: o.key,
					label: o.label,
					url: o.url,
					target: o.target,
					external: /^http/.test(o.url),
					active: this.$route.params.nest && exp.test(o.url),
				};
			});
		},
		searchKeyword()
		{
			return this.$store.state.layout.searchKeyword;
		},
	},
	mounted()
	{
		util.initCustomEvent();
		window.on('click.headerDropdown', this.onClickWindowForHeaderDropdown);

		try
		{
			let getPreference = window.localStorage.getItem('preference');
			if (getPreference)
			{
				this.$store.dispatch('updatePreference', JSON.parse(getPreference));
			}
		}
		catch(e) {}
	},
	methods: {
		onClickToggleNavigation(e)
		{
			e.stopPropagation();
			this.showSearchForm = false;
			this.showNavigation = !this.showNavigation;
		},
		onClickToggleSearchForm(e)
		{
			e.stopPropagation();
			this.showNavigation = false;
			this.showSearchForm = !this.showSearchForm;
			if (this.showSearchForm)
			{
				this.$refs.searchKeyword.focus();
			}
		},
		onClickWindowForHeaderDropdown()
		{
			this.showNavigation = false;
			this.showSearchForm = false;
		},
		onClickDropdown(e)
		{
			e.stopPropagation();
		},
		onClickNavigationMenu(e)
		{
			e.preventDefault();
			this.$router.push(e.currentTarget.getAttribute('href'));
			this.onClickWindowForHeaderDropdown();
		},
		onSubmitSearchKeyword(e)
		{
			if (e.target.q.value && e.target.q.value.length < 2)
			{
				alert('Please input at least 3 characters');
				e.target.q.focus();
				e.preventDefault();
			}
		},
	}
}
</script>