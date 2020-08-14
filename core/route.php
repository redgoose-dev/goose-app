<?php
if (!defined('__GOOSE__')) exit();

return [

  [ 'GET', '', 'index' ],
  [ 'GET', '/', 'index' ],

  [ 'GET', '/nest/[char:id]', 'index/nest' ],
  [ 'GET', '/nest/[char:id]/', 'index/nest' ],
  [ 'GET', '/nest/[char:id]/[i:srl]', 'index/nest' ],
  [ 'GET', '/nest/[char:id]/[i:srl]/', 'index/nest' ],

  [ 'GET', '/article/[i:srl]', 'article' ],
  [ 'GET', '/article/[i:srl]/', 'article' ],

  [ 'GET', '/page/[char:name]', 'page' ],
  [ 'GET', '/page/[char:name]/', 'page' ],

  [ 'GET', '/rss', 'rss' ],

  [ 'POST', '/on-like/[i:srl]', 'on-like' ],

];
