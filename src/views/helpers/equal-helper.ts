/* tslint:disable:no-invalid-this */

/**
 * Handlebars equal helper
 *
 * @example
 * {{#equal cars audies }}
 * 	Cars are audies
 * {{/equal}}
 */
export function equal(lValue: any, rValue: any, options: any) {
	if (arguments.length < 3) {
		throw new Error("2 parameters for comparison required!");
	}
	if( lValue != rValue ) {
		return options.inverse(this);
	} else {
		return options.fn(this);
	}
}
