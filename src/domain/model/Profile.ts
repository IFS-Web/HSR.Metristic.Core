import {CheckConstructor} from "./check";


export interface Profile {
	name: string,
	description: string,
	checks: CheckConstructor[]
}