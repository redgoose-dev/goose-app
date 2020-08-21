import $ from 'cash-dom';
import * as util from './util';

const $html = $('html');
const $header = $('.layout-header');

/**
 * initial toggle buttons in header
 * 네비게이션과 키워드 검색창 버튼 토글링 이벤트
 */
function initToggleButtonsInHeader()
{
  const $wraps = $header.find('.layout-header__search, .layout-header__navigation');
  const $buttons = $wraps.children('button');
  $wraps.on('click', (e) => e.stopPropagation());
  $buttons.on('click', function(e) {
    const $parent = $(this).parent();
    const active = $parent.hasClass('active');
    $wraps.removeClass('active');
    $html.off('click.headerButtons');
    if (active)
    {
      $parent.removeClass('active');
    }
    else
    {
      $parent.addClass('active');
      if ($parent.hasClass('layout-header__search'))
      {
        $parent.find('input[type=text]').get(0).focus();
      }
      $html.on('click.headerButtons', () => {
        $wraps.removeClass('active');
      });
    }
  });
}

/**
 * initial navigation
 * 네비게이션 부분 이벤트 초기화
 */
function initNavigation()
{
  const $depth1Links = $('.header-navigation > ul > li > a');
  $depth1Links.on('click', function(e) {
    if (!$(this).attr('href') || $(this).attr('href') === '#') return false;
    // 하위메뉴가 있고 터치 디바이스라면 클릭진행을 막는다.
    if ($(window).width() < 768) return true;
    return !(util.isTouchDevice() && $(this).next().length);
  });
}

/**
 * initial search form
 * 검색폼 이벤트
 */
function initSearchForm()
{
  const $wrap = $header.find('.header-search');
  const $input = $wrap.find('input[type=text]');
  const $button = $wrap.find('button[type=button]');
  $input.on('keyup', function(e) {
    $button.prop('disabled', !this.value);
  });
  // on click reset button
  $button.on('click', function() {
    $input.val('');
    $input.get(0).focus();
    $button.prop('disabled', true);
  });
}

export default function()
{
  initToggleButtonsInHeader();
  initNavigation();
  initSearchForm();
}
