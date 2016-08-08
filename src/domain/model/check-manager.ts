import {Check} from './check';
import {Report} from "./report";
import {Profile} from "./Profile";


export class CheckManager {
	constructor(private directory: string) {}

	public execute(profile: Profile, callback: (reports: Report[]) => void) {
		let reports: Report[] = [];
		let waitForChecksToFinish: number = profile.checks.length;

		profile.checks.forEach((checkConstructor) => {
			let check: Check = new checkConstructor(profile.options || {});
			check.execute(this.directory, (report: Report) => {
				reports.push(report);
				waitForChecksToFinish--;
				if(waitForChecksToFinish == 0) {
					callback(reports);
				}
			});
		});
	}
}