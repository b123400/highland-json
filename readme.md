# Highland-json
JSON encoding for [Highland.js](http://highlandjs.org) stream.

![Build Status](https://travis-ci.org/b123400/highland-json.svg?branch=master)

This JSON encoder not only encoding stream of objects, but also encode streams recursively. You can pass a stream of stream of number, and it will return an array of array of number.

## Install

```
npm install highland-json
```

## Usage


### Encoding array of objects

```javascript

import _ from 'highland';
import {stringify} from 'highland-json';

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
	
	// result === input
});
```

### Streams in array are recursively encoded


```javascript

import _ from 'highland';
import {stringify} from 'highland-json';

const input = [
	{ a : "b", b : "c" },
	_([ 1, 2, 3 ]),
	_([ {
		a : "b",
		b : _([4, 5, 6])
		}
	])
];

_(input)
.through(stringify)
.toArray(results => {
	let result = results.join('');
	/*
	result === [
		{ "a" : "b", "b" : "c" },
		[ 1, 2, 3 ],
		[ {
			"a" : "b",
			"b" : [4, 5, 6]
		} ]
	];*/
});
```
	
### Encoding object

`stringifyObj` accepts a stream of `[key, value]` array.

```javascript

import _ from 'highland';
import {stringifyObj} from 'highland-json';

/* Key value pair */
const input = [
	['a', 'b'],
	['c', 'd'],
	['e', ['f', 'g', 'h']]
]

_(input)
.through(stringifyObj)
.toArray(results => {
	let result = results.join('');
	/*
	result === {
		"a": "b",
		"c": "d",
		"e": ["f", "g", "h"]
	} */
};
```

### Encode existing object

`stringifyObj` also accepts stream of single object, the object will be encoded as an object (`{}`), please only pass one object to the stream. If the stream is given more than one object, it will output something like `{"a":1}{"a":2}`, which is not a valid JSON. Use `stringify`for that case.

```javascript

import _ from 'highland';
import {stringifyObj} from 'highland-json';

/* Key value pair */
const input = {
	a: "b",
	c: "d",
	e: ["f", "g", "h"]
}

_(input)
.through(stringifyObj)
.toArray(results => {
	let result = results.join('');
	/*
	result === {
		"a": "b",
		"c": "d",
		"e": ["f", "g", "h"]
	} */
};
```

### Nesting

Remember to pass through `stringifyObj` when you are encoding objects.

```
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

_([input])
.through(stringifyObj)
.toArray(results => {
	let result = JSON.parse(results.join(''));
	/*
	result === {
		a : [[1,2,3], [4,5,6]],
		b : {
			c : {d:'e', f:'g'},
			h : {i:'j', k:'l'}
		}
	}
*/
});
```