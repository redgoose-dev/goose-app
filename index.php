<?php
if (is_file('index.user.php'))
{
	require_once('index.user.php');
}
else
{
	echo "not exist 'index.user.php' file";
	exit;
}

@error_reporting(E_ALL ^ E_NOTICE);
if (is_bool(DEBUG) && DEBUG)
{
	@define(__StartTime__, array_sum(explode(' ', microtime())));
}


// is localhost
define('__IS_LOCAL__', (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']) || ($_SERVER['REMOTE_ADDR'] == "::1")) ? true : false);


// load program files
require_once(__GOOSE_LIB__);


// load functions
require_once('lib/func.php');


// get preferences
try
{
	// get preference data
	$tmp = core\Spawn::item([
		'table' => core\Spawn::getTableName('JSON'),
		'field' => 'json',
		'where' => 'srl='.(int)$srl_json_pref,
	])['json'];
	if (!$tmp) throw new Exception('not found preference data');

	// set preference
	$pref = new stdClass();
	$pref-> string = $tmp;
	$pref->json = core\Util::jsonToArray($tmp, null, true);
}
catch(\Exception $e)
{
	echo $e->getMessage();
	core\Goose::end();
}


// init router
$router = core\Module::load('Router');
$router->route->setBasePath(__ROOT__);
require_once('lib/map.php');
$router->match = $router->route->match();


// route action
if ($router->match)
{
	$_target = $router->match['target'];
	$_params = $router->match['params'];
	$_name = $router->match['name'];
	$_method = $_SERVER['REQUEST_METHOD'];
	$_targetArray = explode('#', $_target);

	switch($_target)
	{
		case 'intro':
			// set api
			require_once('lib/ClientAPI.class.php');
			$api = new ClientAPI();

			$page = (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;

			$printData = 'article';
			$printData .= ($pref->json['index']['print_paginate']) ? ',nav_paginate' : '';
			$printData .= ($pref->json['index']['print_moreitem']) ? ',nav_more' : '';

			// get data
			$data = $api->index([
				'app_srl' => $pref->json['srl']['app'],
				'nest_id' => null,
				'category_srl' => null,
				'page' => $page,
				'print_data' => $printData,
				'root' => __ROOT__,
				'count' => $pref->json['index']['count']['newstest'],
				'pageScale' => $pref->json['index']['count']['pageScale'],
			]);

			if ($data->state == 'error')
			{
				core\Goose::error(101, $data->message, __ROOT_URL__);
				core\Goose::end();
			}

			$loc_container = 'pages/index.php';
			break;

		case 'index':
			// set api
			require_once('lib/ClientAPI.class.php');
			$api = new ClientAPI();

			// set nest
			$nest_id = (isset($_params['nest'])) ? $_params['nest'] : null;
			$category_srl = (isset($_params['category'])) ? (int)$_params['category'] : null;
			$page = (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;

			$printData = 'nest,category,article';
			$printData .= ($pref->json['index']['print_paginate']) ? ',nav_paginate' : '';
			$printData .= ($pref->json['index']['print_moreitem']) ? ',nav_more' : '';

			// get data
			$data = $api->index([
				'app_srl' => $pref->json['srl']['app'],
				'nest_id' => $nest_id,
				'category_srl' => $category_srl,
				'page' => $page,
				'print_data' => $printData,
				'root' => __ROOT__,
				'count' => $pref->json['index']['count']['nest'],
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
			if ($data->state == 'error')
			{
				core\Goose::error(101, $data->message, __ROOT_URL__);
			}

			$loc_container = 'pages/index.php';
			break;

		case 'article':
			// set api
			require_once('lib/ClientAPI.class.php');
			$api = new ClientAPI();

			// set article_srl
			$article_srl = (isset($_params['article'])) ? (int)$_params['article'] : null;

			// set update hit
			$updateHit = ($pref->json['article']['updateHit']) ? isCookieKey( $pref->json['article']['cookiePrefix'].'hit-'.$article_srl, 7 ) : false;

			// get article
			$data = $api->view([
				'app_srl' => $pref->json['srl']['app'],
				'article_srl' => $article_srl,
				'contentType' => $pref->json['article']['type'],
				'updateHit' => $updateHit,
				'print_data' => ($_GET['get']) ? $_GET['get'] : 'all',
			]);

			if ($data->state == 'error')
			{
				core\Goose::error(101, $data->message, __ROOT_URL__);
				core\Goose::end();
			}

			$loc_container = 'pages/article.php';

			if ($_GET['popup'])
			{
				require_once($loc_container);
				core\Goose::end();
			}
			break;

		case 'page':
			$loc_container = 'pages/page.php';
			break;
	}

	// render ajax
	if ($_targetArray[0] == 'ajax')
	{
		$_name = ($_targetArray[1]) ? $_targetArray[1] : null;
		require_once('pages/ajax.php');
		core\Goose::end();
	}

	require_once('pages/layout.php');
}
else
{
	// 404 error
	core\Goose::error(404, null, __ROOT_URL__);
	core\Goose::end();
}
