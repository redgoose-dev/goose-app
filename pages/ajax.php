<?php
if(!defined("__GOOSE__")){exit();}

/**
 * URL Guide
 *
 * {APP}/ajax/ - 모든 article을 불러옵니다.
 * {APP}/ajax/index/{nest_id}/ - {nest_id} 값을가진 둥지의 데이터를 가져옵니다.
 * {APP}/ajax/index/{nest_id}/{category_srl}/ - {nest_id}값과 {category_srl} 값을 가진 데이터를 가져옵니다.
 * {APP}/ajax/article/{article_srl}/ - {article_srl}값을 가진 article 데이터 하나를 가져옵니다.
 * {APP}/ajax/upLike/{article_srl}/ - {article_srl}값을 가진 article의 like 값을 1 올립니다.
 *
 * {APP}/ajax/?page={page} - {page} 페이지 번호로 article 데이터를 가져옵니다.
 * {APP}/ajax/?get={get} - {get}에 입력된 데이터만 가져옵니다. (nest,print_paginate,print_moreitem)
 * {APP}/ajax/?render={render} - {render}에 입력된 형식의 데이터로 가져옵니다. (text,html)
 *
 */

// set api
require_once('lib/ClientAPI.class.php');
$api = new ClientAPI();


// get datas
switch($_name)
{
	case 'index':

		// set page number
		$page = (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;

		// set print data
		if (isset($_GET['get']))
		{
			$get = explode(',', $_GET['get']);
			$printData = 'article';
			$printData .= (searchValueInArray($get, 'nest')) ? ',nest,category' : '';
			$printData .= (searchValueInArray($get, 'print_paginate')) ? ',nav_paginate' : '';
			$printData .= (searchValueInArray($get, 'print_moreitem')) ? ',nav_more' : '';
		}
		else
		{
			$printData = 'article';
			$printData .= (isset($_params['nest'])) ? ',nest,category' : '';
			$printData .= ($pref->json['index']['print_paginate']) ? ',nav_paginate' : '';
			$printData .= ($pref->json['index']['print_moreitem']) ? ',nav_more' : '';
		}

		// get data
		$data = $api->index([
			'app_srl' => $pref->json['srl']['app'],
			'nest_id' => (isset($_params['nest'])) ? $_params['nest'] : null,
			'category_srl' => (isset($_params['category'])) ? (int)$_params['category'] : null,
			'page' => $page,
			'print_data' => $printData,
			'root' => __ROOT__,
			'count' => ($_params['nest']) ? $pref->json['index']['count']['nest'] : $pref->json['index']['count']['newstest'],
			'pageScale' => $pref->json['index']['count']['pageScale'],
		]);

		// get category name
		if ($data->category)
		{
			foreach($data->category as $k=>$v)
			{
				if ($v['active'] && ($v['srl'] > 0))
				{
					$data->category_name = $v['name'];
					break;
				}
			}
		}

		break;

	case 'article':

		// get article
		$data = $api->view([
			'app_srl' => $pref->json['srl']['app'],
			'article_srl' => (isset($_params['article'])) ? $_params['article'] : null,
			'contentType' => $pref->json['article']['type'],
			'updateHit' => false,
			//'print_data' => 'nest,category',
			'print_data' => $_GET['get'],
		]);

		break;

	case 'upLike':

		$srl = (isset($_params['article'])) ? (int)$_params['article'] : null;

		if ($pref->json['article']['updateLike'] && isCookieKey( $pref->json['article']['cookiePrefix'].'like-'.$srl, 7 ))
		{
			$data = $api->upLike([
				'article_srl' => $srl,
				'header_key' => ((isset($pref->json['meta']['headerKey'])) ? $pref->json['meta']['headerKey'] : null),
			]);
		}
		else
		{
			$data = [
				'state' => 'error',
				'message' => 'exist cookie key'
			];
		}

		break;
}


// check render type
switch($_GET['render'])
{
	case 'text':
		$header = 'Content-Type: text/plain; charset=utf-8';
		break;
	case 'html':
		$header = 'Content-Type: text/html; charset=utf-8';
		break;
	default:
		$header = 'Content-Type: text/plain; charset=utf-8';
		break;
}

// RENDER
header($header);
$render_data = json_encode($data, JSON_PRETTY_PRINT);
print_r($render_data);

