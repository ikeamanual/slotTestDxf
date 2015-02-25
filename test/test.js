'use strict';

let assert = require("assert")
let slotTestDxf = require("../slotTestDxf")
let data_driven = require('data-driven')

describe('sumOfAllNumbers() should return the Triangular number', function() {
	data_driven([
		{data:0, expected: 0},
		{data:1, expected: 1},
		{data: 2, expected: 3},
		{data:3, expected: 6},
	], function() {
		it('sumOfAllNumbers({data}) should return {expected}', function(ctx) {
			assert.equal(slotTestDxf.sumOfAllNumbers(ctx.data), ctx.expected)
		})
	})
})

describe('drawRel()', function() {
		data_driven([
			{data_x: 0, data_y:0, data_kerfMode: "++", expected: '10\n0.1\n20\n0.1\n'},
			{data_x: 0, data_y:0, data_kerfMode: "+-", expected: '10\n0.1\n20\n-0.1\n'},
			{data_x: 0, data_y:0, data_kerfMode: "-+", expected: '10\n-0.1\n20\n0.1\n'},
			{data_x: 0, data_y:0, data_kerfMode: "--", expected: '10\n-0.1\n20\n-0.1\n'},
			], function() {
			it('drawRel({data_x}, {data_y}, {data_kerfMode}) should equal "{expected}"', function(ctx) {
				//console.log(ctx);
				assert.equal(slotTestDxf.drawRel(ctx.data_x, ctx.data_y, ctx.data_kerfMode), ctx.expected)
			})
		})
})

describe('indexCorrection() should return 0, 0, 1, 2, 3, ... n when input is 0, 1, 2, 3, 4', function() {
	data_driven([
		{data:0, expected: 0},
		{data:1, expected: 0},
		{data: 3, expected: 2},
		{data:4, expected: 3},
	], function() {
		it('indexCorrection({data}) should return {expected}', function(ctx) {
			assert.equal(slotTestDxf.indexCorrection(ctx.data), ctx.expected)
		})
	})
})

