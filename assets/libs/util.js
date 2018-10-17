/**
 * serialize
 * object to parameter
 *
 * @param {Object} obj
 * @param {Boolean} usePrefix
 * @return {String}
 */
export function serialize(obj, usePrefix=false)
{
	let str = [];
	let res = '';
	for (let p in obj)
	{
		if (obj.hasOwnProperty(p) && !!encodeURIComponent(obj[p]))
		{
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	}
	res = str.join('&');
	return (res && usePrefix) ? `?${res}` : res;
}

/**
 * set cookie
 *
 * @param {String} key
 * @param {String} value
 * @param {Number} day
 * @param {String} path
 */
export function set(key, value='1', day=7, path='/')
{
	let date = new Date();
	date.setTime(date.getTime() + day*24*60*60*1000);
	document.cookie = `${key}=${value};expires=${date.toUTCString()};path=${path}`;
}

