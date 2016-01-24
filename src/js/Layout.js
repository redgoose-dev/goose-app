const $ = require('jquery');


module.exports = {

	$dom : {},

	/**
	 * Initial scroll event
	 *
	 * @Param object params
	 */
	init(params)
	{
		this.$dom.header = params.$header;
	},

	/**
	 * set event GNB form mobile
	 * set event toggle header contents from mobile
	 *
	 * @Param object params
	 */
	setEventGnbFromMobile(params)
	{
		var $navToggleButtons = params.selector_toggleButtons;
		var $toggleTargets = params.selector_targetElements;

		$navToggleButtons.on('click', (e) => {
			let $current = $(e.currentTarget);
			let target = $current.attr('data-target');

			if ($current.hasClass('on'))
			{
				$current.removeClass('on');
				$toggleTargets.removeClass('show');
			}
			else
			{
				$navToggleButtons.removeClass('on');
				$toggleTargets.removeClass('show');
				$current.addClass('on');
				$toggleTargets.filter('.' + target).addClass('show');
			}
		});
	},

	/**
	 * Initial scroll event from header
	 */
	initScrollEventFromHeader()
	{
		var self = this;
		var $window = $(window);
		var scrollTop = 0;
		var hideHeader = false;
		var timestamp = 0;

		this.$dom.header.removeClass('hide');

		function on()
		{
			self.$dom.header.removeClass('hide');
			if (modules.article.$body)
			{
				modules.article.$body.children('.external-buttons').removeClass('hide');
			}
			hideHeader = false;
		}
		function off()
		{
			self.$dom.header.addClass('hide');
			if (modules.article.$body)
			{
				modules.article.$body.children('.external-buttons').addClass('hide');
			}
			hideHeader = true;
		}

		$window.on('scroll.header', (e) => {
			var sctop = $window.scrollTop();
			if (sctop > ($window.height() * 0.3))
			{
				if (scrollTop > sctop)
				{
					if (hideHeader)
					{
						if ((e.timeStamp - timestamp) < 300) return false;
						on();
					}
				}
				else
				{
					if (!hideHeader)
					{
						if ((e.timeStamp - timestamp) < 100) return false;
						off();
					}
				}
			}
			else
			{
				if (hideHeader)
				{
					on();
				}
			}
			scrollTop = sctop;
			timestamp = e.timeStamp;
		});
	},

	/**
	 * Destroy scroll event from header
	 */
	destroyScrollEventFromHeader()
	{
		$(window).off('scroll.header');
	}
};
