"use strict";


export class Barrier {
	private callback: () => void;
	private finishedTasks: any = [];

	constructor(private numberOfTasks: number) {}

	then(callback: () => void): Barrier {
		this.callback = callback;
		return this;
	}

	waitingFor(): number {
		return this.numberOfTasks - this.finishedTasks.length;
	}

	finishedTask(task: any): Barrier {
		if (!this.isFinished(task)) {
			this.finishedTasks.push(task);
			if (this.numberOfTasks <= this.finishedTasks.length) {
				this.callback();
			}
		}
		return this;
	}

	expand(amount: number): Barrier {
		this.numberOfTasks += amount;
		return this;
	}

	isFinished(task: any): boolean {
		return this.finishedTasks.indexOf(task) >= 0;
	}
}
