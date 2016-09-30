/* tslint:disable:no-invalid-this */
'use strict';

let Moment = require('moment');


/**
 * Handlebars moment helper
 *
 * @example
 * {{moment createDate "YYYY-MM"}}
 */
export function formatDate(date: any, format: any) {
	return Moment(date).format(format);
}
