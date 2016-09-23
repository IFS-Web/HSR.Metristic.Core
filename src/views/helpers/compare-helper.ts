/* tslint:disable:no-invalid-this */

/**
 * Handlebars compare helper
 *
 * @example
 * 	{{#compare myCar '==' theCar}}
 * 		They are equal
 * 	{{else}}
 * 		They are NOT equal
 * 	{{/compare}}
 */
export function compare(lValue, operator, rValue, options) {
	if (arguments.length < 3) {
		throw new Error("2 parameters for comparison required!");
	}

	let operators: {[name:string]:(a,b) => boolean } = {
		'==': (a,b) => a == b,
		'===': (a,b) => a === b,
		'!=': (a,b) => a != b,
		'<': (a,b) => a < b,
		'>': (a,b) => a > b,
		'<=': (a,b) => a <= b,
		'>=': (a,b) => a >= b
	};

	if (!operators[operator]) {
		throw new Error(`Operator ${operator} unknown!`);
	}

	if(operators[operator](lValue,rValue)) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
}
