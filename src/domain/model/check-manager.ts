"use strict";
import {Check} from './check';
import {Report} from "./report";
import {Profile} from "./Profile";
import {Barrier} from "./barrier";


export class CheckManager {
	constructor(private directory: string) {}

	public execute(profile: Profile, callback: (reports: Report[]) => void) {
		let reports: Report[] = [];
		let barrier = new Barrier(profile.checks.length).then(() => { callback(reports); });

		profile.checks.forEach((checkConstructor) => {
			let check: Check = new checkConstructor(profile.options || {});
			check.execute(this.directory, (report: Report) => {
				if(report) {
					reports.push(report);
				}
				barrier.finishedTask();
			});
		});
	}
}