let Handlebars = require('handlebars');

import {Report} from "./report";


export class ErrorReport implements Report {
	renderer: any;
	template: string = `<ul class="list-unstyled">{{#each errors}}<li class="error">{{this.message}}</li>{{/each}}</ul>`;

	constructor(public name: string, private errors: Error[]) {
		this.renderer = Handlebars.compile(this.template);
	}

	renderReport(): string {
		return this.renderer({ errors: this.errors });
	}
}