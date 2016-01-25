const $ = require('jquery');
const layout = require('./Layout.js');
const index = require('./Index.js');
const article = require('./Article.js');
const hist = require('./History.js');
const fastclick = require('fastclick');

// set current url
let url = location.pathname + location.search;

window.currentUrl = url;
window.modules = {
	index : index,
	article : article,
	layout : layout
};


// set support css3
if (CSS3.isSupport()) $('html').addClass('css3');



// Header
// -----------------------------------

let $header = $('#header');
if ($header.length)
{
	layout.init({
		$header : $header
	});

	// act event layout
	layout.setEventGnbFromMobile({
		selector_toggleButtons: $header.find('.toggle-buttons > button'),
		selector_targetElements: $header.find('.gnb, .keyword-search, .profile')
	});

	// init scroll event
	layout.initScrollEventFromHeader();
}



// Index
// -----------------------------------

let $photoIndex = $('#photoIndex');
if ($photoIndex.length)
{
	// init loading
	index.initLoading($photoIndex.children('.loading-wrap'));

	// set masonry
	index.setMasonry({
		masonryOption : {
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			transitionDuration : '0s',
			hiddenStyle : {},
			visibleStyle : {}
		},
		delay : 100,
		showClassName : 'show',
		$grid : $photoIndex.children('.index')
	});

	// more item event
	let $moreItem = $photoIndex.children('.more-item');
	if (userData.preference.index.print_moreitem && $moreItem.length)
	{
		index.isNextpage = true;
		index.loadMoreItems($moreItem.children('button'));
	}

	// paginate
	let $paginate = $photoIndex.children('.paginate');
	if (userData.preference.index.print_paginate && $paginate.length)
	{
		index.isPaginate = true;
		index.$paginate = $paginate;
		index.initPaginateEvent(index.$paginate.find('a'));
	}

	// set History
	hist.replace({ target : 'index', url : url }, url, url);
}



// Article
// -----------------------------------

let $article = $('#article');
if ($article.length)
{
	article.init($article);

	// set History
	hist.replace({ target : 'article', url : url }, url, url);
}



// on popstate
hist.initPopEvent({
	article : article
});


fastclick(document.body);