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
      getenv('PATH_COOKIE')
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

}
