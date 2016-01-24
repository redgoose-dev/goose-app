const $ = require('jquery');

module.exports = function()
{
	this.$el = null;
	this.full = false;

	// loading elemnt
	this.init = ($target) => {
		// set loading element
		let $dom = $(this.template());

		// set element
		this.$el = $dom;

		// set is full
		if (this.full)
		{
			$dom.addClass('full');
		}

		// append loading element
		$target.append($dom);
	};

	this.template = () => {
		return '<div class="loading">' +
			'<div class="wrap">' +
			'<div class="ui-loader"></div>' +
			'<span class="message">loading...</span>' +
			'</div>' +
			'</div>';
	};

	// show loading
	this.show = ($target) => {
		$target = $target || $('body');
		this.full = ($target) ? true : false;
		this.init($target);
		this.$el.addClass('show');
	};

	// hide loading
	this.hide = () => {
		this.$el.removeClass('show');
		this.$el.remove();
		this.$el = null;
	}
};
