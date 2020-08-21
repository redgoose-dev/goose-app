<?php
namespace Core;
use Dotenv\Dotenv, redgoose\Console, redgoose\RestAPI, Exception, Parsedown;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
  $dotenv = Dotenv::createImmutable(__PATH__);
  $dotenv->load();
}
catch(Exception $e)
{
  throw new Exception('.env error');
}

// ini_set
if ($_ENV['DEBUG'] === '1')
{
  error_reporting(E_ALL & ~E_NOTICE);
}

// set values
define('__ROOT__', preg_replace('/\/$/', '', $_ENV['PATH_RELATIVE']));
define('__API__', preg_replace('/\/$/', '', $_ENV['PATH_API']));
define('__URL__', preg_replace('/\/$/', '', $_ENV['PATH_URL']));

// set default timezone
if (!!$_ENV['TIMEZONE'])
{
  date_default_timezone_set($_ENV['TIMEZONE']);
}

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache/view');

// get preference
if (file_exists(__PATH__.'/user/preference.php'))
{
  $preference = require_once(__PATH__.'/user/preference.php');
}
else
{
  $preference = require_once(__PATH__.'/resource/preference.php');
}

// set router
try {
  $router = new Router();

  // not found page
  if (!$router->match)
  {
    throw new Exception('Not found page', 404);
  }

  // play route
  $_target = $router->match['target'];
  $_params = (object)$router->match['params'];

  // init rest api
  $api = new RestAPI((object)[
    'url' => $_ENV['PATH_API'],
    'outputType' => 'json',
    'headers' => ['Authorization: '.$_ENV['TOKEN_PUBLIC']],
    'timeout' => 30,
    'debug' => $_ENV['DEBUG'] === '1',
  ]);

  // set navigation
  $preference->header->navigation = Util::convertNavigation($preference->header->navigation);

  switch($_target)
  {
    case 'index':
      $page = Util::getPage();
      $size = $preference->index->size;

      // get articles
      $res = $api->call('get', '/articles/', (object)[
        'field' => 'srl,nest_srl,category_srl,json,title,order,regdate,hit,star',
        'app' => $preference->app_srl,
        'page' => $page,
        'size' => $size,
        'order' => '`order` desc, `srl` desc',
        'q' => isset($_GET['q']) ? $_GET['q'] : null,
        'ext_field' => 'nest_name',
      ]);
      if (!isset($res->response)) throw new Exception($res->message, $res->code);
      $res = $res->response;
      $articles = isset($res->data->index) ? Util::convertWorksData($res->data->index) : [];

      // set pagination
      $paginate = isset($res->data->total) ? Util::makePagination($res->data->total, $page, $size) : null;

      // render page
      $blade->render('index', (object)[
        'title' => $preference->title,
        'pageTitle' => (isset($_GET['q']) && $_GET['q']) ? $preference->index->searchTitlePrefix.' '.$_GET['q'] : $preference->index->title,
        'index' => $articles,
        'total' => isset($res->data->total) ? (int)$res->data->total : 0,
        'paginate' => $paginate,
        'preference' => $preference,
        'keyword' => isset($_GET['q']) ? $_GET['q'] : '',
      ]);
      break;

    case 'index/nest':
      $page = Util::getPage();
      $size = $preference->index->size;
      $nestId = isset($_params->id) ? $_params->id : null;
      $category_srl = isset($_params->srl) ? (int)$_params->srl : null;

      // get nest
      $nest = $api->call('get', '/nests/id/'.$nestId.'/');
      if (!isset($nest->response)) throw new Exception($nest->message, $nest->code);
      $nest = $nest->response;
      if (!(isset($nest->data) && $nest->success)) throw new Exception($nest->message, $nest->code);
      $nest = $nest->data;

      // get categories
      $categories = null;
      if (!!$nest->json->useCategory)
      {
        try
        {
          $categories = $api->call('get', '/categories/', (object)[
            'field' => 'srl,name,turn,nest_srl',
            'nest' => $nest->srl,
            'ext_field' => 'count_article,item_all',
            'order' => 'turn',
            'sort' => 'asc',
          ]);
          if (!isset($categories->response)) throw new Exception($categories->message, $categories->code);
          $categories = $categories->response;
          if (!(isset($categories->data) && $categories->success)) throw new Exception($categories->message, $categories->code);
          $categories = Util::convertCategoriesData($categories->data->index, $category_srl);
        }
        catch (Exception $e)
        {}
      }

      // get articles
      $articles = $api->call('get', '/articles/', (object)[
        'field' => 'srl,category_srl,title,json,type,order,hit,star,regdate',
        'order' => '`order` desc, `srl` desc',
        'app' => $preference->app_srl,
        'nest' => $nest->srl,
        'category' => $category_srl,
        'page' => $page,
        'size' => $size,
        'ext_field' => 'category_name',
      ]);
      if (!isset($articles->response)) throw new Exception($articles->message, $articles->code);
      $articles = isset($articles->response->data) ? $articles->response->data : null;

      // set pagination
      $paginate = isset($articles->total) ? Util::makePagination($articles->total, $page, $size) : null;

      // set title
      $title = $preference->title;
      if (isset($nest->name)) $title = $nest->name.' on '.$preference->title;

      // render page
      $blade->render('index', (object)[
        'title' => $title,
        'pageTitle' => $nest->name,
        'categorySrl' => 0,
        'index' => isset($articles->index) ? Util::convertWorksData($articles->index) : [],
        'total' => isset($articles->total) ? (int)$articles->total : 0,
        'paginate' => $paginate,
        'categories' => $categories,
        'preference' => $preference,
        'keyword' => isset($_GET['q']) ? $_GET['q'] : '',
      ]);
      break;

    case 'article':
      // get article
      $article = $api->call('get', '/articles/'.$_params->srl.'/', (object)[
        'app' => $preference->app_srl,
        'hit' => Util::checkCookie('goose-hit-'.$_params->srl) ? 0 : 1,
        'ext_field' => 'category_name,nest_name',
      ]);
      if (!isset($article->response)) throw new Exception($article->message, $article->code);
      $article = $article->response;
      if (!($article && $article->success)) throw new Exception($article->message, $article->code);
      $article = $article->data;
      if (!$article) throw new Exception('no item', 404);

      // add key in cookie
      if (!Util::checkCookie('goose-hit-'.$_params->srl))
      {
        Util::setCookie('goose-hit-'.$_params->srl, '1', 7);
      }

      // parse markdown
      $parsedown = new Parsedown();
      $article->content = $parsedown->text($article->content);

      // set title
      $contentTitle = !$article->title || $article->title === '.' ? 'Untitled work' : $article->title;
      $title = $contentTitle.' on '.$preference->title;

      // set image
      $image = __URL__.'/user/og-banner.jpg';
      if (isset($article->json->thumbnail->path)) $image = __API__.'/'.$article->json->thumbnail->path;

      // render page
      $blade->render('article', (object)[
        'title' => $title,
        'contentTitle' => $contentTitle,
        'description' => Util::contentToShortText($article->content),
        'image' => $image,
        'data' => $article,
        'onLike' => Util::checkCookie('goose-star-'.$_params->srl),
        'preference' => $preference,
      ]);
      break;

    case 'page':
      $_page = $_params->name;

      // check page file
      if (!file_exists(__PATH__.'/view/pages/'.$_page.'.blade.php'))
      {
        throw new Exception('Not found page', 404);
      }

      // render page
      $blade->render('pages.'.$_page, (object)[
        'preference' => $preference,
      ]);
      break;

    case 'rss':
      // TODO
      break;

    case 'like':
      try
      {
        $res = $api->call(
          'get',
          '/articles/'.(int)$_params->srl.'/update/',
          (object)[ 'type' => 'star' ]
        );
        if (!isset($res->response)) throw new Exception($res->message, $res->code);
        $res = $res->response;
        echo json_encode($res);
      }
      catch(Exception $e)
      {
        echo json_encode((object)[
          'success' => false,
          'message' => 'server error',
        ]);
      }
      break;

    default:
      throw new Exception('Not found page', 404);
  }
}
catch(Exception $e)
{
  Util::setHeader('text');
  var_dump($e);
  // TODO: 오류페이지 작업
}
