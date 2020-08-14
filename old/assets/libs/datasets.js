/**
 * get format date
 * make `year-month-day hour:minutes:second`
 *
 * @param {String} date
 * @param {Boolean} useTime
 */
export function getFormatDate(date=null, useTime=true)
{
	if (useTime)
	{
		return date;
	}
	else
	{
		return date.split(' ')[0];
	}
}
