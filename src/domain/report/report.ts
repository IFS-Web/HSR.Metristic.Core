'use strict';


export interface Report {
	name: string;
	renderReport(): string;
}
