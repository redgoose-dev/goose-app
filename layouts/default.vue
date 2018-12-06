<template>
<main>
	<header class="header">
		<div class="header__body">
			<div class="header__logo">
				<a href="/">
					<img :src="logo" alt="redgoose">
				</a>
			</div>
			<nav class="header__navigation" :class="[ showNavigation && 'active' ]">
				<button type="button" title="toggle navigation" @click="onClickToggleNavigation" class="dropdown-button">
					<icon-menu class="on" title="open menu"/>
					<icon-close class="off" title="close menu"/>
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
				<icon-search class="on" title="open menu"/>
				<icon-close class="off" title="close menu"/>
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
						</span>
					</fieldset>
					<nav>
						<button type="submit">
							<icon-search title="search"/>
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
	components: {
		'icon-menu': () => import('@/components/icons/menu'),
		'icon-search': () => import('@/components/icons/search'),
		'icon-close': () => import('@/components/icons/close'),
	},
	head()
	{
		const { $store, $route } = this;
		let currentUrl = `${$store.state.env.app.url}${$route.path}`;
		return {
			meta: [
				{ hid: 'og:url', property: 'og:url', content: currentUrl },
			],
			link: [
				{ hid: 'canonical', rel: 'canonical', href: currentUrl },
			],
		};
	},
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
			return this.$store.state.env.app.header.navigation.map((o) => {
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
		logo()
		{
			return this.$store.state.env.app.header.logo;
		}
	},
	mounted()
	{
		util.initCustomEvent();
		window.on('click.headerDropdown', this.onClickWindowForHeaderDropdown);

		//document.querySelector('body').setAttribute('')
		document.body.addEventListener('touchstart', function(){}, false);

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