let Handlebars = require('handlebars');

import{equal} from "./../../views/helpers/equal-helper";
import{compare} from "./../../views/helpers/compare-helper";
import {Report} from "./report";


export class HtmlReport implements Report {
	renderer: any;

	constructor(public name: string, template: string, partials: {[name: string]: string}, private data: any) {
		Handlebars.registerHelper('equal', equal);
		Handlebars.registerHelper('compare', compare);

		Object.keys(partials).forEach((name) => {
			Handlebars.registerPartial(name, partials[name]);
		});
		this.renderer = Handlebars.compile(template);
	}

	renderReport(): string {
		return this.renderer(this.data);
	}
}