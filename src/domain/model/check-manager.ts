import { Check } from './check';


export class CheckManager {
	constructor(private directory: string) {}
	public execute(checks: Check[], callback: (reports: string[]) => void) {
		let reports: string[] = [];
		let waitForChecksToFinish: number = checks.length;
		checks.forEach((check) => {
			check.execute(this.directory, (report: string) => {
				reports.push(report);
				waitForChecksToFinish--;
				if(waitForChecksToFinish == 0) {
					callback(reports);
				}
			});
		});
	}
}