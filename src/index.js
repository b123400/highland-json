'use strict';

import _ from 'highland';

export const stringify = options => {
	if (_.isStream(options)) {
		return stringifyWithOptions(options);
	};
	return stream => stringifyWithOptions(stream, options);
}

export const stringifyWithOptions = (stream, options) => {
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
				return _([prefix]).concat(stringifyWithOptions(obj, options));
			}
			if (stream.__isJSON) {
				return _([prefix, obj]);
			}

			let jsonString = 
				options && typeof options.stringify === 'function'
				? options.stringify(obj, stream)
				: JSON.stringify(obj);
			return _([prefix, jsonString]);
		}))
		.append(']');
	s.__isJSON = true;
	return patchStream(s);
};

export const stringifyObj = options => {
	if (_.isStream(options)) {
		return stringifyObjWithOptions(options);
	};
	return stream => stringifyObjWithOptions(stream, options);
}

export const stringifyObjWithOptions = (stream, options) => {
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
					return _([text]).concat(stringifyWithOptions(obj[1], options));
				}
				let jsonString =
					stream.__isJSON
					? obj
					: options && typeof options.stringify === 'function'
					? options.stringify(obj[1], stream)
					: JSON.stringify(obj[1]);
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

export const patchStream = stream => {
	const methods = ['doto', 'errors', 'tap', 'throttle', 'fork', 'stopOnError', 'consume', 'observe'];
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
