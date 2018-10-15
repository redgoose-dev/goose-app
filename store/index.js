export const state = () => ({
	env: null,
	preference: {},
});

export const actions = {
	async nuxtServerInit({ commit }, { req, env })
	{
		if (env)
		{
			commit('setupEnv', env)
		}
	},
	updatePreference($store, value)
	{
		let computedPreference = {
			...this.state.preference,
			...value,
		};
		$store.commit('updatePreference', computedPreference);
		if (window)
		{
			window.localStorage.setItem('preference', JSON.stringify(computedPreference));
		}
	}
};

export const mutations = {
	setupEnv(state, value)
	{
		state.env = value;
	},
	updatePreference(state, value)
	{
		state.preference = {
			...state.preference,
			...value,
		};
	}
};
