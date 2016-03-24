'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.objectToStream = exports.stringifyObj = exports.stringify = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _highland = require('highland');

var _highland2 = _interopRequireDefault(_highland);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringify = exports.stringify = function stringify(stream) {
	var isFirst = true;
	var s = (0, _highland2.default)(['[']).concat(stream.flatMap(function (obj) {
		var prefix = ',';
		if (isFirst) {
			isFirst = false;
			prefix = '';
		}

		if (_highland2.default.isStream(obj)) {
			if (obj.__isJSON) {
				return (0, _highland2.default)([prefix]).concat(obj);
			}
			return (0, _highland2.default)([prefix]).concat(stringify(obj));
		}
		if (stream.__isJSON) {
			return (0, _highland2.default)([prefix, obj]);
		}
		var jsonString = JSON.stringify(obj);
		return (0, _highland2.default)([prefix, jsonString]);
	})).append(']');
	s.__isJSON = true;
	return s;
};

var stringifyObj = exports.stringifyObj = function stringifyObj(stream) {
	var isFirst = true;
	var s = (0, _highland2.default)(['{']).concat(stream.flatMap(function (obj) {
		if (Array.isArray(obj)) {
			// Good format: [key, value]
			// pass along
			return (0, _highland2.default)([obj]);
		} else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object") {
			// Get a object like { a: b, c: d }
			// Transform to [ [a, b], [c, d] ]
			return objectToStream(obj);
		}
		throw "Cannot handle this format";
	}).flatMap(function (obj) {
		var text = ",";
		if (isFirst) {
			isFirst = false;
			text = "";
		}
		text += JSON.stringify(obj[0]) + ":";

		if (_highland2.default.isStream(obj[1])) {
			if (obj[1].__isJSON) {
				return (0, _highland2.default)([text]).concat(obj[1]);
			}
			return (0, _highland2.default)([text]).concat(stringify(obj[1]));
		}
		var jsonString = stream.__isJSON ? obj : JSON.stringify(obj[1]);
		return (0, _highland2.default)([text, jsonString]);
	})).append('}');
	s.__isJSON = true;
	return s;
};

var objectToStream = exports.objectToStream = function objectToStream(obj) {
	return (0, _highland2.default)(Object.keys(obj)).map(function (key) {
		return [key, obj[key]];
	});
};
//# sourceMappingURL=data:application/json;base64,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QyxRQUFPLENBQVAsQ0FwQ3FDO0NBQVY7O0FBdUNyQixJQUFNLDBDQUFpQixTQUFqQixjQUFpQjtRQUM3Qix3QkFBRSxPQUFPLElBQVAsQ0FBWSxHQUFaLENBQUYsRUFBb0IsR0FBcEIsQ0FBd0I7U0FBTyxDQUFDLEdBQUQsRUFBTSxJQUFJLEdBQUosQ0FBTjtFQUFQO0NBREsiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBfIGZyb20gJ2hpZ2hsYW5kJztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IHN0cmVhbSA9PiB7XG5cdGxldCBpc0ZpcnN0ID0gdHJ1ZTtcblx0Y29uc3QgcyA9IF8oWydbJ10pXG5cdFx0LmNvbmNhdChzdHJlYW0uZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRsZXQgcHJlZml4ID0gJywnO1xuXHRcdFx0aWYgKGlzRmlyc3QpIHtcblx0XHRcdFx0aXNGaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRwcmVmaXggPSAnJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKF8uaXNTdHJlYW0ob2JqKSkge1xuXHRcdFx0XHRpZiAob2JqLl9faXNKU09OKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF8oW3ByZWZpeF0pLmNvbmNhdChvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBfKFtwcmVmaXhdKS5jb25jYXQoc3RyaW5naWZ5KG9iaikpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHN0cmVhbS5fX2lzSlNPTikge1xuXHRcdFx0XHRyZXR1cm4gXyhbcHJlZml4LCBvYmpdKTtcblx0XHRcdH1cblx0XHRcdGxldCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcblx0XHRcdHJldHVybiBfKFtwcmVmaXgsIGpzb25TdHJpbmddKTtcblx0XHR9KSlcblx0XHQuYXBwZW5kKCddJyk7XG5cdHMuX19pc0pTT04gPSB0cnVlO1xuXHRyZXR1cm4gcztcbn07XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnlPYmogPSBzdHJlYW0gPT4ge1xuXHRsZXQgaXNGaXJzdCA9IHRydWU7XG5cdGNvbnN0IHMgPSBfKFsneyddKVxuXHRcdC5jb25jYXQoc3RyZWFtXG5cdFx0XHQuZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0XHQvLyBHb29kIGZvcm1hdDogW2tleSwgdmFsdWVdXG5cdFx0XHRcdFx0Ly8gcGFzcyBhbG9uZ1xuXHRcdFx0XHRcdHJldHVybiBfKFtvYmpdKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0Ly8gR2V0IGEgb2JqZWN0IGxpa2UgeyBhOiBiLCBjOiBkIH1cblx0XHRcdFx0XHQvLyBUcmFuc2Zvcm0gdG8gWyBbYSwgYl0sIFtjLCBkXSBdXG5cdFx0XHRcdFx0cmV0dXJuIG9iamVjdFRvU3RyZWFtKG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhyb3cgXCJDYW5ub3QgaGFuZGxlIHRoaXMgZm9ybWF0XCI7XG5cdFx0XHR9KVxuXHRcdFx0LmZsYXRNYXAob2JqPT4ge1xuXHRcdFx0XHRsZXQgdGV4dCA9IFwiLFwiO1xuXHRcdFx0XHRpZiAoaXNGaXJzdCkge1xuXHRcdFx0XHRcdGlzRmlyc3QgPSBmYWxzZTtcblx0XHRcdFx0XHR0ZXh0ID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ZXh0ICs9IEpTT04uc3RyaW5naWZ5KG9ialswXSkgKyBcIjpcIjtcblxuXHRcdFx0XHRpZiAoXy5pc1N0cmVhbShvYmpbMV0pKSB7XG5cdFx0XHRcdFx0aWYgKG9ialsxXS5fX2lzSlNPTikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIF8oW3RleHRdKS5jb25jYXQob2JqWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIF8oW3RleHRdKS5jb25jYXQoc3RyaW5naWZ5KG9ialsxXSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBqc29uU3RyaW5nID0gc3RyZWFtLl9faXNKU09OID8gb2JqIDogSlNPTi5zdHJpbmdpZnkob2JqWzFdKTtcblx0XHRcdFx0cmV0dXJuIF8oW3RleHQsIGpzb25TdHJpbmddKTtcblx0XHRcdH0pXG5cdFx0KVxuXHRcdC5hcHBlbmQoJ30nKTtcblx0cy5fX2lzSlNPTiA9IHRydWU7XG5cdHJldHVybiBzO1xufVxuXG5leHBvcnQgY29uc3Qgb2JqZWN0VG9TdHJlYW0gPSBvYmogPT5cblx0XyhPYmplY3Qua2V5cyhvYmopKS5tYXAoa2V5ID0+IFtrZXksIG9ialtrZXldXSkiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
