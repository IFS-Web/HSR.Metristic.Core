"use strict";


export class Barrier {
	private callback: () => void;
	private finishedTasks: any = [];

	constructor(private numberOfTasks: number) {}

	then(callback: () => void): Barrier {
		this.callback = callback;
		return this;
	}

	finishedTask(task: any = null): Barrier {
		this.finishedTasks.push(task);
		if(this.numberOfTasks <= this.finishedTasks.length) {
			this.callback();
		}
		return this;
	}

	isFinished(task: any): boolean {
		return this.finishedTasks.indexOf(task) >= 0;
	}
}