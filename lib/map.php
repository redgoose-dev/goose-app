<?php
if(!defined("__GOOSE__")){exit();}


$router->route->addMatchTypes([ 'key' => '[0-9A-Za-z_-]++' ]);


// index
$router->route->map('GET', '/', 'intro');


// page
$router->route->map('GET', '/page/[key:page]', 'page');
$router->route->map('GET', '/page/[key:page]/', 'page');


// index
$router->route->map('GET', '/index/[key:nest]', 'index');
$router->route->map('GET', '/index/[key:nest]/', 'index');
$router->route->map('GET', '/index/[key:nest]/[i:category]', 'index');
$router->route->map('GET', '/index/[key:nest]/[i:category]/', 'index');


// article
$router->route->map('GET', '/article/[i:article]', 'article');
$router->route->map('GET', '/article/[i:article]/', 'article');


// items
$router->route->map('GET', '/ajax/', 'ajax#index');
$router->route->map('GET', '/ajax/index/[key:nest]/', 'ajax#index');
$router->route->map('GET', '/ajax/index/[key:nest]/[i:category]/', 'ajax#index');
$router->route->map('GET', '/ajax/article/[i:article]/', 'ajax#article');
$router->route->map('GET', '/ajax/upLike/[i:article]/', 'ajax#upLike');
