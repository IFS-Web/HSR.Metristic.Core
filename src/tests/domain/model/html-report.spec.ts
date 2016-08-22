/// <reference path="../../../../typings/tsd.d.ts" />
import {HtmlReport} from "../../../domain/model/html-report";


describe("HTML Report", function () {
	it("should render a handlebars template", function () {
		let report = new HtmlReport(
			'Test report',
			'<h1>{{title}}</h1><p>{{data.test}}</p>',
			{},
			{ title: 'abc', data: { test: 'efg' } }
		);
		expect(report.renderReport()).toBe('<h1>abc</h1><p>efg</p>');
	});
});