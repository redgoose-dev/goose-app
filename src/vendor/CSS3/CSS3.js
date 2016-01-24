/**
 * CSS3 class
 */
var CSS3 = {

	eventNames : {
		WebkitTransition : 'webkitTransitionEnd',
		MozTransition    : 'transitionend',
		OTransition      : 'oTransitionEnd otransitionend',
		transition       : 'transitionend'
	},

	isSupport : function()
	{
		var el = document.createElement('div');
		for (var name in this.eventNames) {
			if (el.style[name] !== undefined) {
				return this.eventNames[name];
			}
		}
		el = null;
		return false;
	},

	transitionEnd : function(el, callback)
	{
		if (this.isSupport())
		{
			if (callback)
			{
				$(el).one(this.isSupport(), callback);
			}
		}
		else
		{
			$(el).one(this.isSupport(), callback);
		}
	}
};
