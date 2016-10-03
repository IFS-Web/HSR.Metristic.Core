'use strict';

let Domain = require('domain');

import {Check} from "../../../domain/model/check";
import {Report} from "../../../domain/report/report";
import {CheckManager} from "../../../domain/model/check-manager";
import {Profile} from "../../../domain/model/profile";
import {ErrorReport} from "../../../domain/report/error-report";


class GeneralCheck implements Check {
	static assetsDirectory: string = '/generalCheck';

	constructor(private options: { [name: string]: any }) {}
	public execute(directory: string, callback: (report: Report, errors?: Error[]) => void): void {
		let report:Report = new SimpleReport('General Check', [
			'5 Errors',
			'Checked ' + directory
		]);
		setTimeout(() => { callback(report, []); }, 0);
	}
}

class WebCheck implements Check {
	static assetsDirectory: string = '/webCheck';

	constructor(private options: { [name: string]: any }) {}
	public execute(directory: string, callback: (report: Report, errors?: Error[]) => void): void {
		let report:Report = new SimpleReport('Web Check', [
			'3 Warnings',
			'Checked ' + directory,
			'strict: ' + this.options['strict']
		]);
		setTimeout(() => { callback(report); }, 0);
	}
}

class EmptyCheck implements Check {
	static assetsDirectory: string = null;

	constructor(private options: { [name: string]: any }) {}
	public execute(directory: string, callback: (report: Report, errors?: Error[]) => void): void {
		setTimeout(() => { callback(null, []); }, 0) ;
	}
}

class FailingCheck implements Check {
	static assetsDirectory: string = null;

	constructor(private options: { [name: string]: any }) {}
	public execute(directory: string, callback: (report: Report, errors?: Error[]) => void): void {
		let report:Report = new SimpleReport('Web Check', []);
		let errors: Error[] = [new Error('Check failed')];
		setTimeout(() => { callback(report, errors); }, 0);
	}
}

class SimpleReport implements Report {
	constructor(public name: string, private checkResults: string[]) {}
	renderReport(): string {
		return [this.name].concat(this.checkResults).join(', ');
	}
}

let directory: string =  '/abc/def/';


describe("CheckManager", () => {
	describe("when executed", () => {
		let checkManager: CheckManager;
		let checkReports: Report[];

		beforeEach((done) => {
			let profile: Profile = {
				name: 'Web',
				description: 'Web checks',
				checks: [GeneralCheck, WebCheck],
				options: { strict: true }
			};

			checkManager = new CheckManager(directory);
			checkManager.execute(profile, (reports: Report[]) => {
				checkReports = reports;
				done();
			});
		});

		it("checkers should return a report", () => {
			expect(checkReports.length).toBe(2);
			expect(checkReports[0].renderReport()).toEqual('General Check, 5 Errors, Checked /abc/def/');
			expect(checkReports[1].renderReport()).toEqual('Web Check, 3 Warnings, Checked /abc/def/, strict: true');
		});
	});

	describe("when executed checks returning empty reports", () => {
		let checkManager: CheckManager;
		let checkReports: Report[];
		let error: Error;

		beforeEach((done) => {
			let profile: Profile = {
				name: 'Web',
				description: 'Web checks',
				checks: [GeneralCheck, EmptyCheck],
				options: { strict: true }
			};

			checkManager = new CheckManager(directory);
			let domain = Domain.create();
			domain.on('error', (checkError) => {
				error = checkError;
			});
			domain.run(() => {
				checkManager.execute(profile, (reports:Report[]) => {
					checkReports = reports;
					done();
				});
			});
		});

		it("should ignore this check", () => {
			expect(checkReports.length).toBe(1);
			expect(error).toBeUndefined();
		});
	});

	describe("when executing checks returning errors", () => {
		let checkManager:CheckManager;
		let checkReports:Report[];
		let error: Error;

		beforeEach((done) => {
			let profile:Profile = {
				name: 'Web',
				description: 'Web checks',
				checks: [ GeneralCheck, FailingCheck ],
				options: { strict: true }
			};

			checkManager = new CheckManager(directory);
			let domain = Domain.create();
			domain.on('error', (checkError) => {
				error = checkError;
			});
			domain.run(() => {
				checkManager.execute(profile, (reports:Report[]) => {
					checkReports = reports;
					done();
				});
			});
		});

		it("should return an ErrorReport", () => {
			expect(checkReports.length).toBe(2);
			expect(checkReports[ 0 ].renderReport()).toEqual('General Check, 5 Errors, Checked /abc/def/');
			expect(checkReports[ 1 ]).isPrototypeOf(ErrorReport);
			expect(checkReports[ 1 ].renderReport()).toEqual(`<ul class="list-unstyled">\n\t<li><span class="error ` +
				`label">error</span>Check failed</li>\n</ul>`);
			expect(error).toBeUndefined();
		});
	});
});
