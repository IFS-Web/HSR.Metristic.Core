/// <reference path="../../../../typings/tsd.d.ts" />
import {HtmlReport} from "../../../domain/report/hbs-report";


describe("HTML Report", () => {
	it("should render a handlebars template", () => {
		let report = new HtmlReport(
			'Test report',
			'<h1>{{title}}</h1><p>{{data.test}}</p>',
			{},
			{ title: 'abc', data: { test: 'efg' } }
		);
		expect(report.renderReport()).toBe('<h1>abc</h1><p>efg</p>');
	});

	it("should render a partial", () => {
		let report = new HtmlReport(
				'Test report',
				'<p>{{> partial element=title}}</p>',
				{ partial: '<span>{{element}}</span>' },
				{ title: 'abc'}
		);
		expect(report.renderReport()).toBe('<p><span>abc</span></p>');
	});

	it("should render the compare helper", () => {
		let report = new HtmlReport(
				'Test report',
				"{{#compare title '==' 'abc'}}<p>it is</p>{{else}}<p>it is not</p>{{/compare}}",
				{},
				{ title: 'abc'}
		);
		expect(report.renderReport()).toBe('<p>it is</p>');
	});
});
