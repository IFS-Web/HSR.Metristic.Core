var Path = require('path');
var FS = require('fs');
var Handlebars = require('handlebars');

import {Check} from "./check";
import {Report} from "./report";
import {HtmlReport} from "./html-report";


export class StructureMetric implements Check {
	constructor() {}

	private reportTemplate = `<ul>
	<li>{{counts.numberOfDirectories}} directories</li>
	<li>{{counts.numberOfFiles}} files</li>
</ul>
{{> directoryPartial structure=structure}}`;

	private partials: {[name:string]:string} = {
		directoryPartial: `<span>{{name}}</span>
<ul class="structure">
	{{#each structure.directories}}
	<li class="empty">
		<img src="/assets/images/icon-directory.svg" class="icon directory" />
		{{> directoryPartial structure=this}}
	</li>
	{{/each}}
</ul>
<ul class="structure">
	{{#each structure.files}}
	<li class="empty">
		<img src="/assets/images/icon-file.svg" class="icon file" />
		{{this}}
	</li>
	{{/each}}
</ul>`
};

	public execute(directory: string, callback: (report: Report) => {}): void {
		let statistics: any = {
			structure: {},
			counts: {
				numberOfDirectories: 0,
				numberOfFiles: 0
			}
		};
		StructureMetric.walkStructure(directory, statistics.structure, statistics.counts);
		callback(new HtmlReport('File structure', this.reportTemplate, this.partials, statistics));
	};

	protected static walkStructure(path, structure, counts: any): void {
		structure['name'] = Path.basename(path);
		structure['directories'] = [];
		structure['files'] = [];

		FS.readdirSync(path).forEach((file) => {
			let subPath = Path.join(path, file);
			if(FS.lstatSync(subPath).isDirectory()) {
				counts.numberOfDirectories++;
				let subDirectory = {};
				structure['directories'].push(subDirectory);
				StructureMetric.walkStructure(subPath, subDirectory, counts);
			} else {
				counts.numberOfFiles++;
				structure['files'].push(Path.basename(file));
			}
		});
	}
}