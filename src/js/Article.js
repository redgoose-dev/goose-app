const $ = require('jquery');
const Loading = require('./Loading.js');
const hist = require('./History.js');

var loading = null;

module.exports = {

	// set elements
	$body : null,
	$modal : null,
	scrollTop : 0,
	isModal : false,
	saveURL : '',
	loading : new Loading(),
	actResize : false,

	/**
	 * Keyboard event
	 */
	keyboardEvent : {

		self : null,

		init(getThis)
		{
			this.self = getThis;
		},

		on()
		{
			var self = this.self;
			var $externalButtons = self.$body.find('.external-buttons a.btn');

			$(window).on('keyup.article', (e) => {
				switch(e.keyCode)
				{
					// esc
					case 27:
						self.onClose();
						break;
					// left
					case 37:
						self.onGo($externalButtons.filter('.prev').get(0));
						break;
					// right
					case 39:
						self.onGo($externalButtons.filter('.next').get(0));
						break;
				}
			});
		},

		off()
		{
			$(window).off('keyup.article');
		}
	},

	/**
	 * Get cookie value
	 *
	 * @Param string name
	 * @Return string
	 */
	getCookie(name)
	{
		name += '=';
		let cookieData = document.cookie;
		let start = cookieData.indexOf(name);
		let value = '';

		if (start != -1)
		{
			start += name.length;
			let end = cookieData.indexOf(';', start);
			if(end == -1)end = cookieData.length;
			value = cookieData.substring(start, end);
		}
		return value;
	},

	/**
	 * Set cookie value
	 *
	 * @Param string name
	 * @Param string value
	 * @Param int cDay
	 */
	setCookie(name, value, cDay)
	{
		let expire = new Date();
		let cookies = name + '=' + value + '; path=/ ';
		expire.setDate(expire.getDate() + cDay);
		cookies += (typeof cDay != 'undefined') ? ';expires=' + expire.toGMTString() + ';' : '';
		document.cookie = cookies;
	},

	/**
	 * Initial
	 *
	 * @Param object $getArticle
	 */
	init($getArticle)
	{
		if (!$getArticle || !$getArticle.length) return false;

		// set article body element
		this.$body = $getArticle;

		// act init on like event
		this.initButtonsEvent();

		// init keyboard event
		this.keyboardEvent.init(this);

		// on keyboard event
		this.keyboardEvent.on();

		// init resize event
		this.initResizeEvent();
	},

	/**
	 * On like
	 *
	 * @Param object e
	 */
	onLike(e)
	{
		let btn = e.currentTarget;
		let srl = parseInt(btn.getAttribute('data-srl'), 10);
		let url = userData.environment.root + '/ajax/upLike/' + srl + '/';

		jQuery.ajax({
			url: url,
			method: 'get',
			dataType: 'json',
			headers: {'Accept': 'application=' + userData.preference.meta.headerKey + ';'}
		}).done((response) => {
			if (response.state == 'success')
			{
				let $like = modules.article.$body.find('[data-bind=like]');
				let count_like = parseInt($like.text(), 10);
				$like.text(count_like + 1);
				$(btn).prop('disabled', true);
			}
			else
			{
				log('db error');
				log(response);
			}
		}).fail((e) => {
			log('server error');
			log(e.responseText);
		});
	},

	/**
	 * Initial on like event
	 */
	initButtonsEvent()
	{
		// on like
		this.$body.find('.nav-bottom > .like').on('click', this.onLike);

		if (this.isModal)
		{
			let $externalButtons = this.$body.find('.external-buttons .btn');

			// close
			$externalButtons.filter('.close').on('click', () => {
				this.onClose()
				return false;
			});

			// prev and next
			$externalButtons.filter('a.prev,a.next').on('click', (e) => {
				this.onGo(e.currentTarget);
				return false;
			});
		}
	},

	/**
	 * Initial on resize event
	 */
	initResizeEvent()
	{
		if (!this.isModal) return false;

		this.actResize = false;
		$(window).one('resize.article', () => {
			this.actResize = true;
		});
	},

	/**
	 * Modal template
	 *
	 * @Param object data
	 */
	modalTemplate()
	{
		return '<div class="modal animate fixed">' +
			'<span class="bg"></span>' +
			'<div class="wrap"></div>' +
			'</div>';
	},

	/**
	 * Open modal
	 *
	 * @Param string url
	 */
	open(url)
	{
		if (!url) return false;

		this.isModal = true;

		// save scroll top
		this.scrollTop = $(window).scrollTop();

		// set modal element
		this.$modal = $(this.modalTemplate());
		$('body').append(this.$modal);

		// set param 'get'
		this.get = '';
		if (userData.environment.params.nest)
		{
			this.get = '&get=nest';
			this.get += (userData.environment.params.category) ? ',category' : '';
		}
		else
		{
			this.get = '&get=all';
		}

		setTimeout(() => {
			this.$modal.addClass('show');
		}, 30);

		CSS3.transitionEnd(this.$modal.get(0), (e) => {
			$('html').addClass('mode-modal');
			this.$modal.removeClass('fixed animate show');
			this.loading.show();

			this.$modal.children('.wrap').load(url + '?popup=1' + this.get, (res) => {
				this.loading.hide();
				this.init(this.$modal.find('> .wrap > .article'));
			});
		});

		// save url
		this.saveURL = location.pathname + location.search;

		// save current url
		window.currentUrl = url;

		// off scroll event from header
		window.modules.layout.destroyScrollEventFromHeader();
	},

	/**
	 * On close
	 */
	onClose()
	{
		if (this.isModal)
		{
			hist.push({ target : 'index', url : this.saveURL }, this.saveURL, this.saveURL);
			this.close();
		}
		else
		{
			let url = this.$body.find('.external-buttons .close').attr('href');
			hist.push({ target : 'index', url : url }, url, url);
			location.href = url;
		}
	},

	/**
	 * Close modal
	 */
	close()
	{
		if (!this.isModal) return false;

		var scrollTopInModal = $(window).scrollTop();

		// disabled keyboard event
		this.keyboardEvent.off();

		// set isModal is false
		this.isModal = false;
		this.$modal.addClass('fixed animate show');
		this.$modal.children('.wrap').scrollTop(scrollTopInModal);

		setTimeout(() => {
			$('html').removeClass('mode-modal').addClass('hidden-scroll');
			$(window).scrollTop(this.scrollTop);
			this.$modal.removeClass('show');

			// refresh masonry from index
			window.modules.index.refreshMasonry();

			// set current url
			window.currentUrl = this.saveURL;
		}, 30);

		CSS3.transitionEnd(this.$modal.get(0), (e) => {
			$('html').removeClass('hidden-scroll');
			this.$modal.remove();
			this.$modal = null;
			this.$body = null;
			this.scrollTop = 0;

			// on scroll event from header
			window.modules.layout.initScrollEventFromHeader();
		});
	},

	/**
	 * On go
	 *
	 * @Param object btn
	 */
	onGo(btn)
	{
		if (!btn) return false;
		let url = btn.getAttribute('href');

		hist.push({ target : 'article', url : url }, url, url);

		if (this.isModal)
		{
			this.go(url);
		}
		else
		{
			location.reload();
		}
	},

	/**
	 * Go url in article
	 */
	go(url)
	{
		let $wrap = this.$modal.children('.wrap');
		// disabled keyboard event
		this.keyboardEvent.off();

		// clear article
		$wrap.html('');

		// show loading
		this.loading.show();

		$wrap.load(url + '?popup=1' + this.get, () => {
			this.loading.hide();
			this.init(this.$modal.find('> .wrap > .article'));
		});

		// save current url
		window.currentUrl = url;
	}
};