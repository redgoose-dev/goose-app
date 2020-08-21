<?php
if(!defined("__GOOSE__")){exit();}

/**
 * error
 */

/** @var string $title */
/** @var int $code */
/** @var string $message */
/** @var string $icon */
/** @var object $preference */
?>

@extends('layout')

@section('meta')
@endsection

@section('contents')
<article class="error">
  <figure class="error__image">
    {!! $icon !!}
  </figure>
  <h1 class="error__code">{{$code}}</h1>
  <p class="error__message">{{$message}}</p>
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
