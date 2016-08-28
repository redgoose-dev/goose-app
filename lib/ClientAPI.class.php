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
		$result = Spawn::update([
			'table' => Spawn::getTableName('article'),
			'where' => 'srl='.$article_srl,
			'data' => [
				'hit='.$hit
			],
		]);
		return ($result == 'success');
	}

	/**
	 * Index
	 *
	 * @param array $options : {
	 *
	 * }
	 * @return array
	 */
	public function index($options)
	{
		$result = [
			'nest' => null,
			'category' => null,
			'articles' => null,
			'pageNavigation' => null,
			'nextpage' => null,
		];
		$print = explode(',', $options['print_data']);

		// get nests
		if ($options['nest_id'])
		{
			$result['nest'] = Spawn::item([
				'table' => Spawn::getTableName('nest'),
				'where' => 'id=\''.$options['nest_id'].'\'',
				'debug' => false,
			]);
			$result['nest'] = ($result['nest']) ? $result['nest'] : null;
			if (isset($result['nest']['srl']))
			{
				$result['nest']['json'] = Util::jsonToArray($result['nest']['json'], false, true);
			}
			else
			{
				return [
					'state' => 'error',
					'message' => 'not found nest data',
				];
			}

			// get categories list
			if ($result['nest']['json']['useCategory'] && $this->searchKeyInArray($print, 'category'))
			{
				$result['category'] = Spawn::items([
					'table' => Spawn::getTableName('category'),
					'where' => 'nest_srl='.(int)$result['nest']['srl'],
					'field' => 'srl,name',
					'order' => 'turn',
					'sort' => 'asc',
				]);

				$cnt_all = Spawn::count([
					'table' => Spawn::getTableName('article'),
					'where' => 'app_srl='.$options['app_srl'].' and nest_srl='.(int)$result['nest']['srl'],
				]);

				if (count($result['category']))
				{
					$check_active = false;
					$index = [
						[ 'srl' => 0, 'name' => 'All', 'count' => $cnt_all, 'active' => false ]
					];
					foreach($result['category'] as $k=>$v)
					{
						$cnt = ($cnt_all > 0) ? Spawn::count([
							'table' => Spawn::getTableName('article'),
							'where' => 'category_srl='.(int)$v['srl']
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
					$result['category'] = $index;
				}
			}
		}

		// get articles
		// init paginate
		require_once(__GOOSE_PWD__.'core/classes/Paginate.class.php');
		$options['page'] = ($options['page'] > 1) ? $options['page'] : 1;
		$count = $options['count'];
		$scale = $options['pageScale'];
		$params = [
			'keyword' => ($_GET['keyword']) ? $_GET['keyword'] : ''
		];

		$nest_srl = ($options['nest_id']) ? ((isset($result['nest']['srl'])) ? $result['nest']['srl'] : -1) : null;
		$where = 'app_srl='.$options['app_srl'];
		$where .= ($nest_srl) ? ' and nest_srl='.$nest_srl : '';
		$where .= ($options['category_srl']) ? ' and category_srl='.(int)$options['category_srl'] : '';
		$where .= ($_GET['keyword']) ? ' and (title LIKE "%'.$_GET['keyword'].'%" or content LIKE "%'.$_GET['keyword'].'%")' : '';

		// get total article
		$total = Spawn::count([
			'table' => Spawn::getTableName('article'),
			'where' => $where,
		]);

		// set paginate instance
		$paginate = new Paginate($total, $_GET['page'], $params, $count, $scale);

		// set limit
		$limit = $paginate->offset.','.$paginate->size;

		// get articles
		$result['articles'] = Spawn::items([
			'table' => Spawn::getTableName('article'),
			'field' => 'srl,nest_srl,category_srl,hit,json,regdate,title',
			'where' => $where,
			'limit' => $limit,
			'sort' => 'desc',
			'order' => 'srl',
		]);

		// adjustment articles
		if ($this->searchKeyInArray($print, 'article'))
		{
			foreach ($result['articles'] as $k=>$v)
			{
				if (isset($v['regdate'])) $result['articles'][$k]['regdate'] = Util::convertDate($v['regdate']);
				if (isset($v['modate'])) $result['articles'][$k]['modate'] = Util::convertDate($v['modate']);
				if (isset($v['category_srl']))
				{
					$category = Spawn::item([
						'table' => Spawn::getTableName('category'),
						'where' => 'srl='.(int)$v['category_srl'],
					]);
					$result['articles'][$k]['category_name'] = (isset($category['name'])) ? $category['name'] : '';
				}
				$result['articles'][$k]['json'] = Util::jsonToArray($v['json'], false, true);
			}
		}

		// set paginate
		if ($this->searchKeyInArray($print, 'nav_paginate'))
		{
			$result['pageNavigation'] = $paginate->createNavigationToObject();
		}

		// set nextpage
		if ($this->searchKeyInArray($print, 'nav_more'))
		{
			$nextPaginate = new Paginate($total, $options['page']+1, $params, $count, $scale);
			$limit = $nextPaginate->offset.','.$nextPaginate->size;
			$nextArticles = Spawn::items([
				'table' => Spawn::getTableName('article'),
				'field' => 'srl',
				'where' => $where,
				'limit' => $limit,
				'sort' => 'desc',
				'order' => 'srl',
			]);
			$result['nextpage'] = (count($nextArticles)) ? $options['page'] + 1 : null;
		}

		$result['nest'] = ($this->searchKeyInArray($print, 'nest')) ? $result['nest'] : null;
		$result['articles'] = ($this->searchKeyInArray($print, 'article')) ? $result['articles'] : null;
		$result['state'] = 'success';

		return $result;
	}

	/**
	 * View
	 *
	 * @param array $options
	 * @return array
	 */
	public function view($options)
	{
		if (!$options['article_srl']) return [ 'state' => 'error', 'message' => 'not found article_srl' ];

		// get article data
		$article = Spawn::item([
			'table' => Spawn::getTableName('article'),
			'where' => 'srl='.$options['article_srl']
		]);

		if (!$article) return [ 'state' => 'error', 'message' => 'not found article data' ];

		$article['json'] = Util::jsonToArray($article['json'], null, true);
		$article['regdate'] = Util::convertDate($article['regdate']);
		$article['modate'] = Util::convertDate($article['modate']);

		// set content type
		switch($options['contentType'])
		{
			case 'markdown':
				// load parsedown
				require_once(__GOOSE_PWD__.'vendor/Parsedown/Parsedown.class.php');

				// get instance parsedown
				$Parsedown = new Parsedown();

				// convert markdown
				$article['content'] = '<div class="markdown-body">'.$Parsedown->text($article['content']).'</div>';
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
		$str .= ($this->searchKeyInArray($print_data, 'nest')) ? 'nest_srl='.(int)$article['nest_srl'] : '';
		$str .= ($this->searchKeyInArray($print_data, 'category') && $article['category_srl']) ? ' and category_srl='.(int)$article['category_srl'] : '';
		$str .= ($str) ? ' and ' : ' app_srl='.$options['app_srl'].' and ';

		$prevItem = Spawn::item([
			'table' => Spawn::getTableName('article'),
			'field' => 'srl',
			'where' => $str.'srl<'.(int)$article['srl'],
			'order' => 'srl',
			'sort' => 'desc',
			'limit' => 1,
		]);
		$nextItem = Spawn::item([
			'table' => Spawn::getTableName('article'),
			'field' => 'srl',
			'where' => $str.'srl>'.(int)$article['srl'],
			'order' => 'srl',
			'limit' => 1,
		]);

		// get nest data
		$nest = Spawn::item([
			'table' => Spawn::getTableName('nest'),
			'field' => 'srl,name,id,json',
			'where' => 'srl='.(int)$article['nest_srl'],
		]);
		$nest['json'] = Util::jsonToArray($nest['json'], null, true);

		// get category
		$category = ($article['category_srl']) ? Spawn::item([
			'table' => Spawn::getTablename('category'),
			'field' => 'name',
			'where' => 'srl='.(int)$article['category_srl'],
		]) : null;

		return [
			'state' => 'success',
			'article' => $article,
			'nest' => $nest,
			'category' => $category,
			'prev_srl' => (isset($prevItem['srl'])) ? (int)$prevItem['srl'] : null,
			'next_srl' => (isset($nextItem['srl'])) ? (int)$nextItem['srl'] : null,
			'checkUpdateHit' => ($options['updateHit']) ? ($this->updateHit((int)$article['hit'], (int)$article['srl'])) : null,
		];
	}

	/**
	 * Up like
	 *
	 * @param array $options : [
	 *   article_srl
	 *   header_key
	 * ]
	 * @return array
	 */
	public function upLike($options)
	{
		if (!$this->checkAuthHeader($options['header_key'])) return [ 'state' => 'error', 'message' => 'Path not allowed' ];
		if (!$options['article_srl']) return [ 'state' => 'error', 'message' => 'not found article_srl' ];
		$article = Spawn::item([
			'table' => Spawn::getTableName('article'),
			'where' => 'srl='.$options['article_srl'],
			'field' => 'srl,json',
		]);
		if (!isset($article['json'])) return [ 'state' => 'error', 'message' => 'not found article data' ];

		$article['json'] = Util::jsonToArray($article['json'], null, true);
		$like = (isset($article['json']['like'])) ? ((int)$article['json']['like']) : 0;
		$article['json']['like'] = $like + 1;
		$json = Util::arrayToJson($article['json'], true);

		$result = Spawn::update([
			'table' => Spawn::getTableName('article'),
			'data' => [ 'json=\''.$json.'\'' ],
			'where' => 'srl=' . (int)$options['article_srl'],
		]);

		return ($result == 'success') ? [
			'state' => 'success',
			'message' => 'update complete',
		] : [
			'state' => 'error',
			'message' => 'fail update complete',
		];
	}
}



