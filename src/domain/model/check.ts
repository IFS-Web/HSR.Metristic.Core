'use strict';

import {Report} from "./../report/report";


export interface Check {
	execute(directory: string, callback: (report: Report, errors?: Error[]) => void): void;
}

export interface CheckConstructor {
	new (options: { [name: string]: any }): Check;
	// this directory will be accesible static by /assets/plugins/checkclassnamelowercase/
	assetsDirectory: string;
}
