"use strict";


export class Barrier {
	private callback: () => void;

	constructor(private numberOfTasks: number) {}

	then(callback: () => void): Barrier {
		this.callback = callback;
		return this;
	}

	finishedTask(): Barrier {
		this.numberOfTasks--;
		if(this.numberOfTasks <= 0) {
			this.callback();
		}
		return this;
	}
}