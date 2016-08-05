import {Check} from './check';
import {Report} from "./report";


export class CheckManager {
	constructor(private directory: string) {}

	public execute(checks: Check[], callback: (reports: Report[]) => void) {
		let reports: Report[] = [];
		let waitForChecksToFinish: number = checks.length;

		checks.forEach((check) => {
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