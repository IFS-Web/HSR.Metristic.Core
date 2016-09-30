/* tslint:disable:no-invalid-this */

'use strict';


/**
 * Handlebars round helper
 *
 * @example
 * {{round number 2}}
 */
export function round(num: number, digits: number) {
	let factor: number = Math.pow(10, digits);
	return Math.round(num * factor) / factor;
}
