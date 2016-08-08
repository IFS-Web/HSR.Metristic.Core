import {Report} from "./report";


export interface Check {
	execute(directory: string, callback: (report: Report) => void): void;
}

export interface CheckConstructor {
	new (options: { [name: string]: any }): Check;
}