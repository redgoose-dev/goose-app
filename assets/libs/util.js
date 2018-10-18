import cookieparser from 'cookieparser';

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
 * https://expressjs.com/en/api.html#res.cookie
 *
 * @param {Object} response response in node
 * @param {String} key
 * @param {String} value
 * @param {Number} day
 * @param {String} path
 */
export function setCookie(response=null, key, value='1', day=7, path='/')
{
	let time = day * 24 * 60 * 60 * 1000;

	if (response && response.cookie && typeof response.cookie === 'function')
	{
		response.cookie(key, value, { path, expires: new Date(Date.now() + time) });
	}
	else if (document)
	{
		let date = new Date();
		date.setTime(date.getTime() + time);
		document.cookie = `${key}=${value};expires=${date.toUTCString()};path=${path}`;
	}
	else
	{
		console.error('failed set cookie');
	}
}

/**
 * set cookie
 *
 */
export function getCookie(req, key)
{
	try
	{
		if (req && req.headers.cookie)
		{
			let parsed = cookieparser.parse(req.headers.cookie);
			return parsed[key] || null;
		}
		else if (document)
		{
			let value = "; " + document.cookie;
			let parts = value.split(`; ${key}=`);
			if (parts.length === 2) return parts.pop().split(';').shift();
		}
		return null;
	}
	catch(e)
	{
		return null;
	}
}