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
		}
		barrier.then(callback);
		items.forEach((item, index) => {
			itemsTransformed[index] = item*2;
			barrier.finishedTask();
		});
	});
});