<?php
namespace Core;
use Exception, redgoose\Paginate, redgoose\Console;

/**
 * Util
 */

class Util {

  /**
   * get page number
   *
   * @return int
   */
  static public function getPage()
  {
    return (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;
  }

  /**
   * check cookie key
   *
   * @param string $key
   * @return bool
   */
  static public function checkCookie($key='')
  {
    return isset($_COOKIE[$key]);
  }

  /**
   * set cookie
   *
   * @param string $key
   * @param string $value
   * @param int $day
   */
  static public function setCookie($key='', $value='1', $day=1)
  {
    setcookie(
      $key,
      $value,
      time() + 3600 * 24 * $day,
      $_ENV['PATH_COOKIE']
    );
  }

  /**
   * set header
   *
   * @param string $type
   */
  static public function setHeader($type=null)
  {
    switch($type)
    {
      case 'xml':
        header('Content-Type:application/rss+xml; charset=utf-8');
        break;
      case 'rss':
        header("Content-Type: application/rss+xml; charset=utf-8");
        header('Content-Type: text/xml; charset=utf-8');
        break;
      case 'json':
        header('Content-Type:application/json,text/plane; charset=utf-8');
        break;
      case 'text':
        header('Content-Type:text/plain; charset=utf-8');
        break;
      default:
        header('Content-Type:text/html; charset=utf-8');
        break;
    }
  }

  /**
   * convert works data
   *
   * @param array $index
   * @return array
   */
  static public function convertWorksData($index=[])
  {
    if (!isset($index)) return null;
    if (count($index) <= 0) return [];
    $result = [];
    foreach ($index as $key=>$item)
    {
      $obj = (object)[];
      if ($item->json)
      {
        $obj->srl = (int)$item->srl;
        $obj->title = $item->title === '.' ? 'untitled work' : $item->title;
        $obj->image = isset($item->json->thumbnail->path) ? $_ENV['PATH_API'].'/'.$item->json->thumbnail->path : null;
        $obj->regdate = isset($item->order) ? $item->order : $item->regdate;
        $obj->star = (int)$item->star;
        $obj->hit = (int)$item->hit;
        $obj->categoryName = isset($item->category_name) ? $item->category_name : null;
        $obj->category = isset($item->category_srl) ? $item->category_srl : null;
        $obj->regdate = isset($item->regdate) ? self::convertDate($item->regdate) : null;
        $obj->order = isset($item->order) ? $item->order : null;
        $obj->nestName = isset($item->nest_name) ? $item->nest_name : null;
        $result[] = $obj;
      }
    }
    return $result;
  }

  /**
   * convert categories data
   *
   * @param array $index
   * @param int $category_srl active category_srl
   * @return array
   */
  static public function convertCategoriesData($index=[], $category_srl=null)
  {
    if (!isset($index)) return null;
    if (count($index) <= 0) return [];
    $result = [];
    foreach ($index as $key=>$item)
    {
      $obj = (object)[
        'srl' => !!$item->srl ? (int)$item->srl : null,
        'link' => ($category_srl ? '../' : './').($item->srl ? $item->srl.'/' : ''),
        'label' => $item->name,
        'count' => $item->count_article,
        'active' => ($category_srl && $category_srl === (int)$item->srl) || (!$category_srl && !$item->srl),
      ];
      $result[] = $obj;
    }
    return $result;
  }

  /**
   * convert navigation
   *
   * @param array $index
   * @return array
   */
  static public function convertNavigation($index=[])
  {
    if (!isset($index)) return [];
    if (count($index) <= 0) return [];
    $result = [];
    foreach ($index as $key=>$item)
    {
      $obj = $item;
      $obj->active = isset($item->match) && strpos($_SERVER['REQUEST_URI'], $item->match) !== false;
      if (isset($obj->children) && count($obj->children) > 0)
      {
        $result2 = [];
        foreach ($obj->children as $key2=>$item2)
        {
          $obj2 = $item2;
          $obj2->active = isset($item2->match) && strpos($_SERVER['REQUEST_URI'], $item2->match) !== false;
          $result2[] = $obj2;
        }
        $obj->children = $result2;
      }
      $result[] = $obj;
    }
    return $result;
  }

  /**
   * make pagination
   * 모바일과 데스크탑 네비게이션 객체를 만들어준다.
   *
   * @param int $total
   * @param int $page
   * @param int $size
   * @param array $params
   * @return object
   */
  static public function makePagination($total, $page, $size, $params=[])
  {
    $result = (object)[
      'total' => $total,
      'page' => $page,
    ];
    $paginate = new Paginate((object)[
      'total' => $total,
      'page' => $page,
      'size' => $size,
      'params' => $params,
      'scale' => 3,
    ]);
    $result->mobile = $paginate->createElements(['paginate', 'paginate--mobile']);
    $paginate->update((object)[ 'scale' => 10 ]);
    $result->desktop = $paginate->createElements(['paginate', 'paginate--desktop']);
    return $result;
  }

  /**
   * content to short text
   *
   * @param string $con
   * @param int $len
   * @return string
   */
  static public function contentToShortText($con, $len=120)
  {
    /**
     * Cutting string
     * 글자를 특정자수만큼 잘라준다.
     *
     * @param string $str 자를문자
     * @param number $len 길이
     * @param string $tail 꼬리에 붙는 문자
     * @return string 잘려서 나온문자
     */
    function bear3StrCut($str, $len, $tail="...")
    {
      $rtn = [];
      return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str;
    }

    if (!$con) return null;

    $con = trim( strip_tags($con) );

    $con = preg_replace('/\r\n|\r|\n|\t/', ' ', $con);
    $con = preg_replace('/"/', '\"', $con);
    $con = preg_replace("/'/", "\'", $con);
    $con = preg_replace("/&nbsp;/"," ", $con);
    $con = preg_replace("/  /"," ", $con);
    $con = bear3StrCut($con, $len);

    return $con;
  }

  /**
   * convert date
   *
   * @param string $date
   * @return string
   */
  static public function convertDate($date)
  {
    return explode(' ', $date)[0];
  }

}
