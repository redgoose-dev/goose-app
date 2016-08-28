const $ = require('jquery');
const masonry = require('masonry-layout');
const imagesLoaded = require('imagesLoaded');
const Loading = require('./Loading.js');
const article = require('./Article.js');
const hist = require('./History.js');

var loading = null;


module.exports = {

	// set selector
	$grid : null,
	$paginate : null,
	$loading : null,
	$moreItem : null,

	masonryOption : {},

	// delay animation
	masonryDelay : 0,

	// show class name
	showClassName : 'show',

	// paginate navigation
	isPaginate : false,
	isNextpage : false,

	/**
	 * Init loading
	 *
	 * @Param object $target
	 */
	initLoading($target)
	{
		this.$loading = $target;
		loading = new Loading();
	},

	/**
	 * Set masonry
	 *
	 * @Param object options
	 */
	setMasonry(options)
	{
		if (!options.$grid) return false;

		this.$grid = options.$grid || null;
		this.masonryDelay = options.delay || this.masonryDelay;
		this.masonryOption = options.masonryOption || this.masonryOption;
		this.showClassName = options.showClassName || this.showClassName;

		var $items = this.$grid.children(this.masonryOption.itemSelector);

		// show loading
		loading.show(this.$loading);

		// images loaded
		$items.imagesLoaded((e) => {

			// hide loading
			loading.hide();

			// show grid
			this.$grid.addClass('show');

			// init masonry
			this.$grid.masonry(options.masonryOption);
			if (this.masonryDelay > 0)
			{
				// play grid items
				this.playGridItem(
					$items,
					this.masonryDelay,
					this.showClassName
				);

				// initial go to article event
				this.gotoArticle($items);
			}
		});
	},

	/**
	 * Destroy masonry
	 */
	destroyMasonry()
	{
		this.$grid.masonry('destroy');
		this.$grid.children('.grid-item').remove();
	},

	/**
	 * Refresh masonry
	 */
	refreshMasonry()
	{
		this.$grid.masonry('layout');
	},

	/**
	 * Play grid item animation
	 *
	 * @Param array $items
	 * @Param int delay
	 * @Param string className
	 */
	playGridItem($items, delay, className)
	{
		$items.each((k, o) => {
			setTimeout(() => {
				$(o).addClass(className);
			}, k * delay);
		});
	},

	/**
	 * Template
	 *
	 * @Param array data
	 * @Return string
	 */
	template(data)
	{
		var ev = userData.environment;
		return data.map((o, k) => {
			let url = ev.root + '/article/' + o.srl + '/';
			let img = ev.gooseRoot + '/' + o.json.thumbnail.url;
			return ('<div class="grid-item">' +
					'<a href="' + url + '">' +
						'<figure>' +
							'<img src="' + img + '" alt="' + o.title + '">' +
						'</figure>' +
						'<strong>' + o.title + '</strong>' +
						'<div class="meta">' +
							'<span><i class="fa fa-eye"></i><em>' + o.hit + '</em></span>' +
							'<span><i class="fa fa-heart"></i><em>' + ((o.json.like) ? o.json.like : 0) + '</em></span>' +
						'</div>' +
					'</a>' +
				'</div>');
		}).join('');
	},

	/**
	 * Get items
	 *
	 * @Param object params
	 * @Param function callback
	 */
	addItems(params, callback)
	{
		let ev = userData.environment;
		let url = ev.root + '/ajax/';
		let query = '';

		url += (params.nest) ? 'index/' + params.nest + '/' : ((ev.params.nest) ? 'index/' + ev.params.nest + '/' : '');
		url += (params.category) ? params.category + '/' : ((ev.params.category) ? ev.params.category + '/' : '');

		if (!params.nest && (params.category === undefined))
		{
			query += (params.keyword) ? '&keyword=' + params.keyword : ((ev.keyword) ? '&keyword=' + ev.keyword : '');
			query += '&page=' + ((params.page) ? params.page : ev.page);
		}

		query += '&get=';
		query += (this.isPaginate) ? 'print_paginate,' : '';
		query += (this.isNextpage) ? 'print_moreitem,' : '';
		query = query.replace(/^&/i, '?');

		url = url + query;

		$.getJSON(url, (response) => {
			if (callback)
			{
				callback(response);
			}
		});
	},

	/**
	 * Refresh items
	 *
	 * @Param object data
	 * @Param bool isAddItems
	 * @Param function callback
	 */
	refreshItems(data, isAddItems, callback)
	{
		try
		{
			if (data.state == 'success')
			{
				let $items = (data.articles.length) ? $(this.template(data.articles)) : null;
				if ($items && $items.length)
				{
					// load images complete
					$items.imagesLoaded(() => {

						if (!isAddItems)
						{
							this.$grid.masonry(this.masonryOption);
							loading.hide();
						}

						// append items
						this.$grid.append($items).masonry('appended', $items);

						// initial go to article event
						this.gotoArticle($items);

						// play animation
						this.playGridItem($items, this.masonryDelay, this.showClassName);

						// update more item
						if (userData.preference.index.print_paginate && data.pageNavigation)
						{
							this.updatePaginate(data.pageNavigation);
						}

						// update more item page number
						if (userData.preference.index.print_moreitem)
						{
							if (data.nextpage)
							{
								if (this.$moreItem.hasClass('hide'))
								{
									this.$moreItem.removeClass('hide');
								}
								this.updateMoreItemButton(data.nextpage);
							}
							else
							{
								this.$moreItem.addClass('hide');
							}
						}

						// act callback
						if (callback)
						{
							callback();
						}
					});
				}
				else
				{
					throw 'not found items';
				}
			}
			else if (data.state == 'error')
			{
				throw (data.message) ? data.message : 'error';
			}
		}
		catch(e)
		{
			alert(e);
		}
	},


	/**
	 * Load more items event
	 *
	 * @Param object $el
	 */
	loadMoreItems($el)
	{
		this.$moreItem = $el;
		this.$moreItem.on('click', (e) => {
			var $self = $(e.currentTarget);
			var nextpage = parseInt($self.attr('data-nextpage'));
			if ($self && $self.hasClass('loading')) return false;
			$self.addClass('loading');
			this.addItems({ page : nextpage }, (response) => {
				this.refreshItems(response, true, () => {
					$self.removeClass('loading');
				});
				// update URL
				this.updateURL({
					page : nextpage
				});
			});
		});
	},

	/**
	 * Update more item button
	 *
	 * @Param int nextPage
	 */
	updateMoreItemButton(nextPage)
	{
		this.$moreItem.attr('data-nextpage', nextPage);
	},


	/**
	 * Initial paginate event
	 *
	 * @Param object $paginate paginate element
	 */
	initPaginateEvent($buttons)
	{
		$buttons.on('click', (e) => {
			var page = parseInt(e.currentTarget.getAttribute('data-key'));

			// destroy masonry and on loading
			this.destroyMasonry();
			loading.show(this.$loading);

			this.addItems({ page : page }, (response) => {
				if (response.article && response.article.length) return false;
				// refresh items
				this.refreshItems(response, false);
				// update URL
				this.updateURL({
					page : page
				});
			});
			return false;
		});
	},

	/**
	 * Update paginate
	 *
	 * @Param object data
	 */
	updatePaginate(data)
	{
		if (!data.body) return false;

		let keyword = userData.environment.keyword;
		var url = location.pathname + '?';
		var str = '';

		if (data.prev)
		{
			str += '<a href="' + url + data.prev.url + '" title="prev" data-key="' + data.prev.id + '"><i class="fa fa-caret-left"></i></a>';
		}
		str += data.body.map((o, k) => {
			return (o.active) ? '<strong>' + o.name + '</strong>' : '<a href="' + url + o.url + '" data-key="' + o.id + '">' + o.name + '</a>';
		}).join('');
		if (data.next)
		{
			str += '<a href="' + url + data.next.url + '" title="next" data-key="' + data.next.id + '"><i class="fa fa-caret-right"></i></a>';
		}

		this.$paginate.find('a').off('click');
		this.$paginate.html(str);
		this.initPaginateEvent(this.$paginate.find('a'));
	},


	/**
	 * Initial go to article event
	 *
	 * @Param object $items
	 */
	gotoArticle($items)
	{
		$items.children('a').on('click', (e) => {
			let url = e.currentTarget.getAttribute('href');
			article.open(url);
			hist.push({ target : 'article', url : url }, url, url);
			return false;
		});
	},

	/**
	 * Update URL
	 *
	 * @Param object params
	 */
	updateURL(params)
	{
		if (!hist.support()) return false;

		let ev = userData.environment;
		let url = '', query = '';

		if (params.nest)
		{
			url += ev.root + '/';
			url += 'index/' + params.nest + '/';
			url += (params.category) ? params.category + '/' : '';
		}
		else
		{
			url += location.pathname;
		}

		query = (ev.keyword) ? '&keyword=' + ev.keyword : '';
		query += '&page=' + ((params.page) ? params.page : ev.page);
		query = query.replace(/^&/i, '?');

		url = url + query;

		window.currentUrl = url;
		hist.push({ target : 'index', url : url }, url, url);
	}
};