<?php
if(!defined("__GOOSE__")){exit();}

/**
 * intro page
 */

/** @var string $title */
/** @var string $pageTitle */
/** @var array $index */
/** @var array $categories */
/** @var int $total */
/** @var object $paginate */
/** @var object $preference */
?>

@extends('layout')

@section('meta')
<title>{{$title}}</title>
<meta name="description" content="{{$preference->description}}"/>
<meta property="og:title" content="{{$title}}"/>
<meta property="og:description" content="{{$preference->description}}">
<meta property="og:image" content="{{__ROOT__}}/user/og-banner.jpg">
@endsection

@section('contents')
<article class="index">
  <header class="index__header">
    <h1 class="index__title">{{$pageTitle}}</h1>
  </header>
  @if (isset($categories) && count($categories) > 0)
  <nav class="categories">
    <ul class="categories__index">
      @foreach ($categories as $k=>$item)
      <li class="categories__item {{$item->active ? 'active' : ''}}">
        <a href="{{$item->link}}">
          <span>{{$item->label}}</span>
          <em>{{$item->count}}</em>
        </a>
      </li>
      @endforeach
    </ul>
  </nav>
  @endif
  <div class="index__body">
    @if (isset($index) && count($index))
    <div class="articles articles--{{$preference->index->skin}}">
      @foreach ($index as $k=>$item)
      <div class="item">
        <a href="{{__ROOT__}}/article/{{$item->srl}}/" class="item__wrap">
          <figure class="item__image">
            @if ($item->image)
            <img src="{{$item->image}}" alt="{{$item->title}}">
            @else
            <span>{!! Core\EmptyIcon::random(0,20) !!}</span>
            @endif
          </figure>
          <div class="item__body">
            <strong>{{$item->title}}</strong>
            <p>
              @if ($preference->index->showMeta->nest && isset($item->nestName))
              <span>{{$item->nestName}}</span>
              @endif
              @if ($preference->index->showMeta->category && isset($item->categoryName))
              <span>{{$item->categoryName}}</span>
              @endif
              @if ($preference->index->showMeta->order && isset($item->order))
              <span>{{$item->order}}</span>
              @endif
              @if ($preference->index->showMeta->regdate && isset($item->regdate))
              <span>{{$item->regdate}}</span>
              @endif
              @if ($preference->index->showMeta->hit && isset($item->hit))
              <span>Hit:{{$item->hit}}</span>
              @endif
              @if ($preference->index->showMeta->like && isset($item->star))
              <span>Like:{{$item->star}}</span>
              @endif
            </p>
          </div>
        </a>
      </div>
      @endforeach
    </div>
    @else
    <article class="index__empty">
      <figure>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" fill="currentColor"/>
        </svg>
      </figure>
      <h2>Not found item.</h2>
    </article>
    @endif
  </div>
  @if (isset($paginate->mobile) && $paginate->mobile)
  <nav class="index__paginate">
    {!! $paginate->mobile !!}
    {!! $paginate->desktop !!}
  </nav>
  @endif
</article>
@endsection

@section('script')
<script>
window.app = {
  mode: 'index',
  url: '{{__URL__}}',
};
</script>
@endsection
