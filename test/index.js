'use strict';

import _ from 'highland';
import {stringify, stringifyObj} from '../lib/index';

export const testEncodeArray = test => {

	test.expect(1);

	const input = [
		{ a : "b", b : "c" },
		{ a : [1, 2, 3] },
		[ 1, 2, 3 ],
		[ { a : "b", b : "c" } ]
	];

	_(input)
	.through(stringify)
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, input);
		test.done();
	});
};

export const testEncodeObject = test => {
	test.expect(1);

	const input = {
		a : "b",
		b : "c",
		d : [ 1, 2, 3 ],
		e : { f : "g", h : "i", j : "k" }
	};

	_([input])
	.through(stringifyObj)
	.toArray(results => {
		const result = JSON.parse(results.join(''));
		test.deepEqual(result, input);
		test.done()
	});
}

export const testStreamInArray = test => {
	test.expect(1);

	const input = [
		{ a : "b", b : "c" },
		_([{ a : [1, 2, 3] }]).through(stringifyObj),
		_([ 1, 2, 3 ]),
		_([ { a : "b", b : "c" } ])
	];

	const expected = [
		{ a : "b", b : "c" },
		{ a : [1, 2, 3] },
		[ 1, 2, 3 ],
		[ { a : "b", b : "c" } ]
	];

	_(input)
	.through(stringify)
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, expected);
		test.done();
	});
};

export const testStreamInObject = test => {
	test.expect(1);

	const input = {
		a : "b",
		b : _(['c', 'd', 'e']),
		f : _([{ g: 'h', i: 'j' }]).through(stringifyObj)
	};

	const expected = {
		a : "b",
		b : ['c', 'd', 'e'],
		f : { g: 'h', i: 'j' }
	};

	_([input])
	.through(stringifyObj)
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, expected);
		test.done();
	});
};

export const testNested = test => {
	test.expect(1);

	const input = {
		a : _([
				_([1, 2, 3]),
				_([4, 5, 6])
			]),
		b : _([{
				c: _([{
					d: 'e',
					f: 'g'
					}]).through(stringifyObj),
				h: _([{
					i: 'j',
					k: 'l'
					}]).through(stringifyObj)
				}
			]).through(stringifyObj)
	};

	const expected = {
		a : [[1,2,3], [4,5,6]],
		b : {
			c : {d:'e', f:'g'},
			h : {i:'j', k:'l'}
		}
	};

	_([input])
	.through(stringifyObj)
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, expected);
		test.done();
	});
};

export const testKeyValuePair = test => {
	test.expect(1);

	const input = [
		['a', 'b'],
		['c', 'd'],
		['e', ['f', 'g', 'h']]
	]

	const expected = {
		a: 'b',
		c: 'd',
		e: ['f', 'g', 'h']
	};

	_(input)
	.through(stringifyObj)
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, expected);
		test.done();
	});
};

export const testArrayWithCustomStringify = test => {
	test.expect(1);

	const input = ['a', 'b', 'c'];

	const expected = ['a1', 'b1', 'c1'];

	const customStringify = (val, stream)=> JSON.stringify(val + '1');

	_(input)
	.through(stringify({stringify: customStringify}))
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, expected);
		test.done();
	});
};

export const testNestedArrayWithCustomStringify = test => {
	test.expect(1);

	const input = [
		_(['a']),
		_(['b']),
		_(['c']),
	];

	const expected = [['a1'], ['b1'], ['c1']];

	const customStringify = (val, stream)=> JSON.stringify(val + '1');

	_(input)
	.through(stringify({stringify: customStringify}))
	.toArray(results => {
		let result = results.join('');
		result = JSON.parse(result);
		test.deepEqual(result, expected);
		test.done();
	});
};

export const testObjectWithCustomStringify = test => {
	test.expect(1);

	const input = {
		nums: _([1, 2, 3]),
		strings: _(['a', 'b', 'c']),
	};

	const expected = {
		nums: [10, 20, 30],
		strings: ['a1', 'b1', 'c1'],
	};

	const customStringify = (val, stream)=> {
		if (stream === input.nums) {
			return JSON.stringify(val * 10);
		}
		if (stream === input.strings) {
			return JSON.stringify(val + '1');
		}
		throw new Error("Unreachable");
	};

	_([input])
	.through(stringifyObj({stringify: customStringify}))
	.toArray(results => {
		const result = JSON.parse(results.join(''));
		test.deepEqual(result, expected);
		test.done()
	});
};
