/// <reference path="../../../../typings/tsd.d.ts" />
"use strict";
import {Check} from "../../../domain/model/check";
import {Report} from "../../../domain/model/report";
import {CheckManager} from "../../../domain/model/check-manager";
import {Profile} from "../../../domain/model/Profile";


class GeneralCheck implements Check {
	constructor(private options: { [name: string]: any }) {}
	public execute(directory: string, callback: (report: Report) => void): void {
		let report:Report = new SimpleReport('General Check', [
			'5 Errors',
			'Checked '+directory
		]);
		callback(report);
	}
}
class WebCheck implements Check {
	constructor(private options: { [name: string]: any }) {}
	public execute(directory: string, callback: (report: Report) => void): void {
		let report:Report = new SimpleReport('Web Check', [
			'3 Warnings',
			'Checked '+directory,
			'strict: '+this.options['strict']
		]);
		callback(report);
	}
}

class SimpleReport implements Report {
	constructor(public name: string, private checkResults: string[]) {}
	renderReport(): string {
		return [this.name].concat(this.checkResults).join(', ');
	}
}

let profile: Profile = {
		name: 'Web',
		description: 'Web checks',
		checks: [GeneralCheck, WebCheck],
		options: { strict: true }
};
let directory: string =  '/abc/def/';


describe("CheckManager", () => {
	it("should execute checkers and wait for the result", () => {
		let checkManager = new CheckManager(directory);
		let onFinish = (reports: Report[]) => {
			expect(reports.length).toBe(2);
			expect(reports[0].renderReport()).toEqual('General Check, 5 Errors, Checked /abc/def/');
			expect(reports[1].renderReport()).toEqual('Web Check, 3 Warnings, Checked /abc/def/, strict: true');
		};
		checkManager.execute(profile, onFinish);
	});
});