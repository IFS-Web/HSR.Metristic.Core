"use strict";

import {Check} from './check';
import {Report} from "./report";
import {Profile} from "./Profile";
import {Barrier} from "./barrier";
import {ErrorReport} from "./error-report";


export class CheckManager {
	constructor(private directory: string) {}

	/**
	 * @param profile
	 * general profile options
	 * 	{
	 * 		general: {
	 * 			checkTimeout: 15000 // ms - executen will be aborted, ErrorReport will be returned
	 * 		}
	 * 	}
	 */
	public execute(profile: Profile, callback: (reports: Report[]) => void) {
		let reports: Report[] = [];
		let barrier = new Barrier(profile.checks.length).then(() => { callback(reports); });
		profile.options['general'] = profile.options['general'] || {};

		profile.checks.forEach((checkConstructor) => {
			let checkName: string = (<any> checkConstructor).name;
			if (!profile.options[checkName]) {
				profile.options[checkName] = {};
			}
			let check: Check = new checkConstructor(profile.options || {});

			setTimeout(() => {
				if (!barrier.isFinished(check)) {
					reports.push(new ErrorReport(checkName, [new Error(`Execution took to long. Aborted.`)]));
					barrier.finishedTask(check);
				}
			}, profile.options['general']['checkTimeout'] || 15000);

			check.execute(this.directory, (report:Report, errors: Error[]) => {
				if (!barrier.isFinished(check)) {
					if (errors && errors.length > 0) {
						reports.push(new ErrorReport(checkName, errors));
					}
					// if there are no checked files there will be no report -> ignore
					else if (report) {
						reports.push(report);
					}
					barrier.finishedTask(check);
				}
			});
		});
	}
}
