const $ = require('jquery');

module.exports = {

	article : null,

	/**
	 * Init loading
	 *
	 * @Param object $target
	 * @Return bool
	 */
	support()
	{
		return (history.pushState) ? true : false;
	},

	/**
	 * Push state
	 *
	 * @Param object environment
	 * @Param string title
	 * @Param string url
	 */
	push(environment, title, url)
	{
		if (!this.support()) return false;
		if (!url) return false;

		history.pushState(
			environment || null,
			title || url,
			url);
	},

	/**
	 * Push state
	 *
	 * @Param object environment
	 * @Param string title
	 * @Param string url
	 */
	replace(environment, title, url)
	{
		if (!this.support()) return false;
		if (!url) return false;

		history.replaceState(
			environment || null,
			title || url,
			url);
	},

	/**
	 * Initial pop event
	 *
	 * @Param object params : {
	 *   article : article module
	 * }
	 */
	initPopEvent(params)
	{
		var self = this;
		this.article = params.article;

		$(window).on('popstate', (e) => {
			let state = e.originalEvent.state;

			if (state && (window.currentUrl != state.url))
			{

				switch(state.target)
				{
					case 'index':
						if (self.article.isModal)
						{
							self.article.close();
							return false;
						}
						break;

					case 'article':
						if (this.article.isModal)
						{
							self.article.go(state.url);
						}
						else
						{
							self.article.open(state.url);
							return false;
						}
						return false;
						break;
				}
				location.reload();
			}
		});
	}
};
