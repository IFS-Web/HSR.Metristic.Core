/**
 * Handlebars round helper
 *
 * @example
 * {{round number 2}}
 */
export function round(number: number, digits: number) {
	let factor: number = Math.pow(10,digits);
	return Math.round(number*factor)/factor;
}