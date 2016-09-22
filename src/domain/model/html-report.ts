let Handlebars = require('handlebars');

import{equal} from "./../../views/helpers/equal-helper";
import{compare} from "./../../views/helpers/compare-helper";
import {formatDate} from "./../../views/helpers/moment-helper";
import {round} from "./../../views/helpers/round-helper";
import {Report} from "./report";


export class HtmlReport implements Report {
	renderer: any;

	constructor(public name: string, template: string, partials: {[name: string]: string}, private data: any) {
		Handlebars.registerHelper('equal', equal);
		Handlebars.registerHelper('compare', compare);
		Handlebars.registerHelper('moment', formatDate);
		Handlebars.registerHelper('round', round);

		Object.keys(partials).forEach((partialName) => {
			Handlebars.registerPartial(partialName, partials[partialName]);
		});
		this.renderer = Handlebars.compile(template);
	}

	renderReport(): string {
		return this.renderer(this.data);
	}
}