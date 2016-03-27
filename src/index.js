'use strict';

import _ from 'highland';

export const stringify = stream => {
	let isFirst = true;
	const s = _(['['])
		.concat(stream.flatMap(obj=> {
			let prefix = ',';
			if (isFirst) {
				isFirst = false;
				prefix = '';
			}

			if (_.isStream(obj)) {
				if (obj.__isJSON) {
					return _([prefix]).concat(obj);
				}
				return _([prefix]).concat(stringify(obj));
			}
			if (stream.__isJSON) {
				return _([prefix, obj]);
			}
			let jsonString = JSON.stringify(obj);
			return _([prefix, jsonString]);
		}))
		.append(']');
	s.__isJSON = true;
	return patchStream(s);
};

export const stringifyObj = stream => {
	let isFirst = true;
	const s = _(['{'])
		.concat(stream
			.flatMap(obj=> {
				if (Array.isArray(obj)) {
					// Good format: [key, value]
					// pass along
					return _([obj]);
				} else if (typeof obj === "object") {
					// Get a object like { a: b, c: d }
					// Transform to [ [a, b], [c, d] ]
					return objectToStream(obj);
				}
				throw "Cannot handle this format";
			})
			.flatMap(obj=> {
				let text = ",";
				if (isFirst) {
					isFirst = false;
					text = "";
				}
				text += JSON.stringify(obj[0]) + ":";

				if (_.isStream(obj[1])) {
					if (obj[1].__isJSON) {
						return _([text]).concat(obj[1]);
					}
					return _([text]).concat(stringify(obj[1]));
				}
				let jsonString = stream.__isJSON ? obj : JSON.stringify(obj[1]);
				return _([text, jsonString]);
			})
		)
		.append('}');
	s.__isJSON = true;
	return patchStream(s);
}

export const objectToStream = obj =>
	_(Object.keys(obj)).map(key => [key, obj[key]])

/**
 * Path common functions such the __isJSON property is retained
 */

const patchStream = stream => {
	const methods = ['doto', 'errors', 'tap', 'throttle', 'fork', 'stopOnError'];
	methods.forEach(key => {
		const original = stream[key];
		stream[key] = function() {
			const result = original.apply(this, arguments);
			result.__isJSON = true;
			return patchStream(result);
		}
	})
	return stream;
}