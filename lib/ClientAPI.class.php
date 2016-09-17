<?php
if(!defined("__GOOSE__")){exit();}

class ClientAPI {

	public $goose, $ajax;

	public function __construct()
	{
		global $goose;

		$this->goose = $goose;
		$this->ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['REQUEST_METHOD'] == 'GET');
	}

	/**
	 * Get params key and value
	 *
	 * @param string $accept
	 * @return array
	 */
	private function getParams($accept=null)
	{
		$result = [];
		$arr = explode(';', $accept);
		foreach ($arr as $k=>$v)
		{
			$arr2 = explode('=', $v);
			if ($arr2[0]) $result[$arr2[0]] = $arr2[1];
		}
		return $result;
	}

	/**
	 * Check header
	 *
	 * @param string $key
	 * @return bool
	 */
	private function checkAuthHeader($key)
	{
		$header = $this->getParams($_SERVER['HTTP_ACCEPT']);
		return (isset($header['application']) && $header['application'] == $key);
	}

	/**
	 * Search key in array
	 *
	 * @param array $get
	 * @param string $key
	 * @return bool
	 */
	private function searchKeyInArray($get, $key)
	{
		return in_array($key, $get);
	}

	/**
	 * Update hit
	 *
	 * @param int $hit
	 * @param int $article_srl
	 * @return bool
	 */
	private function updateHit($hit, $article_srl)
	{
		$hit += 1;
		$result = core\Spawn::update([
			'table' => core\Spawn::getTableName('Article'),
			'where' => 'srl=' . $article_srl,
			'data' => [
				'hit=' . $hit
			],
		]);
		return ($result == 'success');
	}

	/**
	 * Index
	 *
	 * @param array $options
	 * @return object
	 */
	public function index($options)
	{
		$result = core\Util::makeObject([
			'nest' => null,
			'category' => null,
			'articles' => null,
			'pageNavigation' => null,
			'nextpage' => null
		]);

		$print = explode(',', $options['print_data']);

		// get nests
		if ($options['nest_id'])
		{
			$result->nest = core\Spawn::item([
				'table' => core\Spawn::getTableName('Nest'),
				'where' => 'id=\'' . $options['nest_id'] . '\'',
				'jsonField' => ['json']
			]);
			if (!isset($result->nest['srl']))
			{
				return core\Util::makeObject([
					'state' => 'error',
					'message' => 'not found nest data'
				]);
			}

			// get categories list
			if ($result->nest['json']['useCategory'] && $this->searchKeyInArray($print, 'category'))
			{
				$result->category = core\Spawn::items([
					'table' => core\Spawn::getTableName('Category'),
					'where' => 'nest_srl=' . (int)$result->nest['srl'],
					'field' => 'srl,name',
					'order' => 'turn',
					'sort' => 'asc'
				]);

				$cnt_all = core\Spawn::count([
					'table' => core\Spawn::getTableName('Article'),
					'where' => 'app_srl=' . $options['app_srl'].' and nest_srl=' . (int)$result->nest['srl'],
				]);

				if (count($result->category))
				{
					$check_active = false;
					$index = [
						[ 'srl' => 0, 'name' => 'All', 'count' => $cnt_all, 'active' => false ]
					];
					foreach($result->category as $k=>$v)
					{
						$cnt = ($cnt_all > 0) ? core\Spawn::count([
							'table' => core\Spawn::getTableName('Article'),
							'where' => 'category_srl=' . (int)$v['srl']
						]) : 0;
						if ($options['category_srl'] == (int)$v['srl']) $check_active = true;
						$index[] = [
							'srl' => (int)$v['srl'],
							'name' => $v['name'],
							'count' => $cnt,
							'active' => ($options['category_srl'] == (int)$v['srl'])
						];
					}
					if (!$check_active)
					{
						$index[0]['active'] = true;
					}
					$result->category = $index;
				}
			}
		}

		// get articles
		// init paginate
		$options['page'] = ($options['page'] > 1) ? $options['page'] : 1;
		$count = $options['count'];
		$scale = $options['pageScale'];
		$params = [
			'keyword' => ($_GET['keyword']) ? $_GET['keyword'] : ''
		];

		$nest_srl = ($options['nest_id']) ? ((isset($result->nest['srl'])) ? $result->nest['srl'] : -1) : null;
		$where = 'app_srl=' . $options['app_srl'];
		$where .= ($nest_srl) ? ' and nest_srl=' . $nest_srl : '';
		$where .= ($options['category_srl']) ? ' and category_srl=' . (int)$options['category_srl'] : '';
		$where .= ($_GET['keyword']) ? ' and (title LIKE "%' . $_GET['keyword'] . '%" or content LIKE "%' . $_GET['keyword'] . '%")' : '';

		// get total article
		$total = core\Spawn::count([
			'table' => core\Spawn::getTableName('Article'),
			'where' => $where,
		]);

		// set paginate instance
		$paginate = new core\Paginate($total, $_GET['page'], $params, $count, $scale);

		// set limit
		$limit = $paginate->offset.','.$paginate->size;

		// get articles
		$result->articles = core\Spawn::items([
			'table' => core\Spawn::getTableName('Article'),
			'field' => 'srl,nest_srl,category_srl,hit,json,regdate,title',
			'where' => $where,
			'limit' => $limit,
			'sort' => 'desc',
			'order' => 'srl',
			'jsonField' => ['json']
		]);

		// adjustment articles
		if ($this->searchKeyInArray($print, 'article'))
		{
			foreach ($result->articles as $k=>$v)
			{
				if (isset($v['regdate'])) $result->articles[$k]['regdate'] = core\Util::convertDate($v['regdate']);
				if (isset($v['modate'])) $result->articles[$k]['modate'] = core\Util::convertDate($v['modate']);
				if (isset($v['category_srl']))
				{
					$category = core\Spawn::item([
						'table' => core\Spawn::getTableName('Category'),
						'where' => 'srl='.(int)$v['category_srl']
					]);
					$result->articles[$k]['category_name'] = (isset($category['name'])) ? $category['name'] : '';
				}
			}
		}

		// set paginate
		if ($this->searchKeyInArray($print, 'nav_paginate'))
		{
			$result->pageNavigation = $paginate->createNavigationToObject();
		}

		// set nextpage
		if ($this->searchKeyInArray($print, 'nav_more'))
		{
			$nextPaginate = new core\Paginate($total, $options['page']+1, $params, $count, $scale);
			$limit = $nextPaginate->offset.','.$nextPaginate->size;
			$nextArticles = core\Spawn::items([
				'table' => core\Spawn::getTableName('Article'),
				'field' => 'srl',
				'where' => $where,
				'limit' => $limit,
				'sort' => 'desc',
				'order' => 'srl'
			]);
			$result->nextpage = (count($nextArticles)) ? $options['page'] + 1 : null;
		}

		$result->nest = ($this->searchKeyInArray($print, 'nest')) ? $result->nest : null;
		$result->articles = ($this->searchKeyInArray($print, 'article')) ? $result->articles : null;
		$result->state = 'success';

		return $result;
	}

	/**
	 * View
	 *
	 * @param array $options
	 * @return object
	 */
	public function view($options)
	{
		if (!$options['article_srl']) core\Util::makeObject([ 'state' => 'error', 'message' => 'not found article_srl' ]);

		// get article data
		$article = core\Spawn::item([
			'table' => core\Spawn::getTableName('Article'),
			'where' => 'srl='.$options['article_srl'],
			'jsonField' => ['json']
		]);

		if (!$article) core\Util::makeObject([ 'state' => 'error', 'message' => 'not found article data' ]);

		$article['regdate'] = core\Util::convertDate($article['regdate']);
		$article['modate'] = core\Util::convertDate($article['modate']);

		// set content type
		switch($options['contentType'])
		{
			case 'markdown':
				// load parsedown
				require_once(__GOOSE_PWD__ . 'vendor/Parsedown/Parsedown.class.php');
				$parsedown = new Parsedown();

				// convert markdown
				$article['content'] = '<div class="markdown-body">' . $parsedown->text($article['content']) . '</div>';
				break;

			case 'text':
				$article['content'] = nl2br(htmlspecialchars($article['content']));
				break;

			default:
				break;
		}

		// set prev,next item
		$print_data = explode(',', $options['print_data']);
		$str = '';
		$str .= ($this->searchKeyInArray($print_data, 'nest')) ? 'nest_srl=' . (int)$article['nest_srl'] : '';
		$str .= ($this->searchKeyInArray($print_data, 'category') && $article['category_srl']) ? ' and category_srl=' . (int)$article['category_srl'] : '';
		$str .= ($str) ? ' and ' : ' app_srl='.$options['app_srl'].' and ';

		$prevItem = core\Spawn::item([
			'table' => core\Spawn::getTableName('Article'),
			'field' => 'srl',
			'where' => $str.'srl<' . (int)$article['srl'],
			'order' => 'srl',
			'sort' => 'desc',
			'limit' => 1
		]);
		$nextItem = core\Spawn::item([
			'table' => core\Spawn::getTableName('Article'),
			'field' => 'srl',
			'where' => $str.'srl>' . (int)$article['srl'],
			'order' => 'srl',
			'limit' => 1
		]);

		// get nest data
		$nest = core\Spawn::item([
			'table' => core\Spawn::getTableName('Nest'),
			'field' => 'srl,name,id,json',
			'where' => 'srl='.(int)$article['nest_srl'],
			'jsonField' => ['json']
		]);

		// get category
		$category = ($article['category_srl']) ? core\Spawn::item([
			'table' => core\Spawn::getTablename('Category'),
			'field' => 'name',
			'where' => 'srl=' . (int)$article['category_srl']
		]) : null;

		return core\Util::makeObject([
			'state' => 'success',
			'article' => $article,
			'nest' => $nest,
			'category' => $category,
			'prev_srl' => (isset($prevItem['srl'])) ? (int)$prevItem['srl'] : null,
			'next_srl' => (isset($nextItem['srl'])) ? (int)$nextItem['srl'] : null,
			'checkUpdateHit' => ($options['updateHit']) ? ($this->updateHit((int)$article['hit'], (int)$article['srl'])) : null,
		]);
	}

	/**
	 * Up like
	 *
	 * @param array $options
	 * @return object
	 */
	public function upLike($options)
	{
		if (!$this->checkAuthHeader($options['header_key'])) return core\Util::makeObject([ 'state' => 'error', 'message' => 'Path not allowed' ]);
		if (!$options['article_srl']) return core\Util::makeObject([ 'state' => 'error', 'message' => 'not found article_srl' ]);
		$article = core\Spawn::item([
			'table' => core\Spawn::getTableName('Article'),
			'where' => 'srl='.$options['article_srl'],
			'field' => 'srl,json',
			'jsonField' => ['json']
		]);
		if (!isset($article['json'])) return core\Util::makeObject([ 'state' => 'error', 'message' => 'not found article data' ]);

		$like = (isset($article['json']['like'])) ? ((int)$article['json']['like']) : 0;
		$article['json']['like'] = $like + 1;
		$json = core\Util::arrayToJson($article['json'], true);

		$result = core\Spawn::update([
			'table' => core\Spawn::getTableName('Article'),
			'data' => [ 'json=\''.$json.'\'' ],
			'where' => 'srl=' . (int)$options['article_srl'],
		]);

		return ($result == 'success') ? core\Util::makeObject([
			'state' => 'success',
			'message' => 'update complete',
		]) : core\Util::makeObject([
			'state' => 'error',
			'message' => 'fail update complete',
		]);
	}
}