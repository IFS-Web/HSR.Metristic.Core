/// <reference path="../../../../typings/tsd.d.ts" />
"use strict";
import {Barrier} from "../../../domain/model/barrier";


describe("Barrier", () => {
	it("should fire callback after finished last", () => {
		let items: number[] = [ 1, 2, 3 ];
		let itemsTransformed:number[] = [];
		let barrier: Barrier = new Barrier(items.length);

		let callback:() => void = () => {
			expect(itemsTransformed).toEqual([2,4,6]);
		};
		barrier.then(callback);
		items.forEach((item, index) => {
			itemsTransformed[index] = item*2;
			barrier.finishedTask(item);
		});
	});

	it("should finish same task only once", () => {
		let numberOfCalled: number = 0;
		let items: number[] = [ 1, 2, 3 ];
		let barrier: Barrier = new Barrier(items.length);

		let callback:() => void = () => {
			numberOfCalled++;
		};
		barrier.then(callback);
		items.forEach((item) => {
			barrier.finishedTask(item);
			barrier.finishedTask(item);
		});
		expect(numberOfCalled).toBe(1);
	});

	it("extended barrier should finish after all", () => {
		let numberOfCalled: number = 0;
		let items: number[] = [ 1, 2, 3, 4, 5 ];
		let itemsTransformed:number[] = [];
		let barrier: Barrier = new Barrier(items.length-2);

		let callback:() => void = () => {
			numberOfCalled++;
			expect(itemsTransformed).toEqual([2,4,6,8,10]);
		};
		barrier.then(callback);
		items.forEach((item, index) => {
			itemsTransformed[index] = item*2;
			if(index == 1) {
				barrier.expand(2);
			}
			barrier.finishedTask(item);
		});
		expect(numberOfCalled).toBe(1);
	});

	it("task should not yet be finished", () => {
		let items: number[] = [ 1, 2, 3 ];
		let barrier: Barrier = new Barrier(items.length);

		barrier.then(() => {});
		items.forEach((item) => {
			expect(barrier.isFinished(item)).toBeFalsy();
			barrier.finishedTask(item);
		});
	});

	it("task should already be finished", () => {
		let items: number[] = [ 1, 2, 3 ];
		let barrier: Barrier = new Barrier(items.length);

		barrier.then(() => {});
		items.forEach((item) => {
			barrier.finishedTask(item);
			expect(barrier.isFinished(item)).toBeTruthy();
		});
	});
});
