/**
 * check touch device
 *
 * @return {boolean}
 */
export function isTouchDevice()
{
  try
  {
    document.createEvent('TouchEvent');
    return true;
  }
  catch (e)
  {
    return false;
  }
}

/**
 * ajax
 * 비동기 통신을 위한 `XMLHttpRequest` 객체의 인터페이스
 *
 * @param {string} url
 * @param {string} method
 * @return {promise}
 */
export function ajax(url='', method='get')
{
  return new Promise(function(resolve, reject) {
    if (!XMLHttpRequest) reject(`Not support browser`);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      if (this.status === 200 || this.status === 201)
      {
        resolve(this.responseText);
      }
      else
      {
        reject(this.responseText);
      }
    });
    xhr.addEventListener('error', function() {
      reject('error request');
    });
    xhr.open(method, url);
    xhr.send();
  });
}

/**
 * set cookie
 *
 * @param {string} key
 * @param {string} value
 * @param {number} day
 * @param {string} path
 */
export function setCookie(key, value='1', day=7, path='/')
{
  let date = new Date();
  date.setTime(date.getTime() + day*24*60*60*1000);
  document.cookie = `${key}=${value};expires=${date.toUTCString()};path=${path}`;
}
