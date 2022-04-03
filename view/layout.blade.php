<!doctype html>
<?php
if(!defined("__GOOSE__")){ exit(); }

/**
 * layout
 */

/** @var object $preference */
/** @var object $keyword */

// set class in html
$classNameInHtml = [];
if ($preference->darkMode) $classNameInHtml[] = 'mode-dark';
if ($preference->responsive) $classNameInHtml[] = 'mode-responsive';
?>
<html lang="ko" class="{{join(' ', $classNameInHtml)}}">
<head>
@include('head')
</head>
<body ontouchstart="">
<main>
  <header class="layout-header">
    <div class="layout-header__wrap">
      <div class="layout-header__body">
        <div class="layout-header__logo">
          <a href="{{__ROOT__}}/">
            <img src="{{$preference->header->logoPath}}" alt="{{$preference->title}}">
          </a>
        </div>
        @if (count($preference->header->navigation) > 0)
        <nav class="layout-header__navigation">
          <button type="button" title="toggle navigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
              <g fill="none" fill-rule="evenodd">
                <path d="M-3-6h24v24H-3z"/>
                <path fill="currentColor" fill-rule="nonzero" d="M0 12h18v-2H0v2zm0-5h18V5H0v2zm0-7v2h18V0H0z"/>
              </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <g fill="none" fill-rule="evenodd">
                <path fill="currentColor" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/>
                <path d="M-5-5h24v24H-5z"/>
              </g>
            </svg>
          </button>
          <div class="header-navigation">
            <ul>
              @foreach ($preference->header->navigation as $k=>$o)
              <li class="{{$o->active ? 'active' : ''}}">
                <a href="{{$o->link}}" target="{{$o->target}}">{{$o->label}}</a>
                @if (isset($o->children) && count($o->children) > 0)
                <div>
                  <ul>
                    @foreach ($o->children as $k2=>$o2)
                    <li class="{{$o2->active ? 'active' : ''}}">
                      <a href="{{$o2->link}}" target="{{$o2->target}}">{{$o2->label}}</a>
                    </li>
                    @endforeach
                  </ul>
                </div>
                @endif
              </li>
              @endforeach
            </ul>
          </div>
        </nav>
        @endif
      </div>
      <div class="layout-header__search">
        <button type="button" title="toggle search form" class="{{(isset($keyword) && !!$keyword) ? 'on' : ''}}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" fill-rule="nonzero" d="M12.5 11h-.79l-.28-.27A6.471 6.471 0 0 0 13 6.5 6.5 6.5 0 1 0 6.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L17.49 16l-4.99-5zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z"/>
              <path d="M-3-3h24v24H-3z"/>
            </g>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/>
              <path d="M-5-5h24v24H-5z"/>
            </g>
          </svg>
        </button>
        <div class="header-search">
          <form action="{{__ROOT__}}/" method="get">
            <fieldset>
              <legend>search keyword form</legend>
              <label>
                <input type="text" name="q" value="{{(isset($keyword) && !!$keyword) ? $keyword : ''}}" placeholder="Please search keyword" maxlength="24"/>
              </label>
            </fieldset>
            <nav>
              <button type="button" title="Reset keyword" {!! !(isset($keyword) && !!$keyword) ? 'disabled' : '' !!}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </button>
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <g fill="none" fill-rule="evenodd">
                    <path fill="currentColor" fill-rule="nonzero" d="M12.5 11h-.79l-.28-.27A6.471 6.471 0 0 0 13 6.5 6.5 6.5 0 1 0 6.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L17.49 16l-4.99-5zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z"/>
                    <path d="M-3-3h24v24H-3z"/>
                  </g>
                </svg>
              </button>
            </nav>
          </form>
        </div>
      </div>
    </div>
  </header>
  <div class="container">
    @yield('contents')
  </div>
  <footer class="layout-footer">
    <p class="layout-footer__copyright">
      {{$preference->footer->copyright}}
    </p>
  </footer>
</main>
@yield('script')
<script type="module" src="{{__ROOT__}}/assets/dist/app.es.js"></script>
</body>
</html>
