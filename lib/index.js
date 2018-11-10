'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.patchStream = exports.objectToStream = exports.stringifyObj = exports.stringify = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	return patchStream(s);
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
	return patchStream(s);
};

var objectToStream = exports.objectToStream = function objectToStream(obj) {
	return (0, _highland2.default)(Object.keys(obj)).map(function (key) {
		return [key, obj[key]];
	});
};

/**
 * Path common functions such the __isJSON property is retained
 */

var patchStream = exports.patchStream = function patchStream(stream) {
	var methods = ['doto', 'errors', 'tap', 'throttle', 'fork', 'stopOnError', 'consume', 'observe'];
	methods.forEach(function (key) {
		var original = stream[key];
		stream[key] = function () {
			var result = original.apply(this, arguments);
			result.__isJSON = true;
			return patchStream(result);
		};
	});
	return stream;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInN0cmluZ2lmeSIsImlzRmlyc3QiLCJzIiwiY29uY2F0Iiwic3RyZWFtIiwiZmxhdE1hcCIsInByZWZpeCIsIl8iLCJpc1N0cmVhbSIsIm9iaiIsIl9faXNKU09OIiwianNvblN0cmluZyIsIkpTT04iLCJhcHBlbmQiLCJwYXRjaFN0cmVhbSIsInN0cmluZ2lmeU9iaiIsIkFycmF5IiwiaXNBcnJheSIsIm9iamVjdFRvU3RyZWFtIiwidGV4dCIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJrZXkiLCJtZXRob2RzIiwiZm9yRWFjaCIsIm9yaWdpbmFsIiwicmVzdWx0IiwiYXBwbHkiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUFFQTs7Ozs7O0FBRU8sSUFBTUEsZ0NBQVksU0FBWkEsU0FBWSxTQUFVO0FBQ2xDLEtBQUlDLFVBQVUsSUFBZDtBQUNBLEtBQU1DLElBQUksd0JBQUUsQ0FBQyxHQUFELENBQUYsRUFDUkMsTUFEUSxDQUNEQyxPQUFPQyxPQUFQLENBQWUsZUFBTTtBQUM1QixNQUFJQyxTQUFTLEdBQWI7QUFDQSxNQUFJTCxPQUFKLEVBQWE7QUFDWkEsYUFBVSxLQUFWO0FBQ0FLLFlBQVMsRUFBVDtBQUNBOztBQUVELE1BQUlDLG1CQUFFQyxRQUFGLENBQVdDLEdBQVgsQ0FBSixFQUFxQjtBQUNwQixPQUFJQSxJQUFJQyxRQUFSLEVBQWtCO0FBQ2pCLFdBQU8sd0JBQUUsQ0FBQ0osTUFBRCxDQUFGLEVBQVlILE1BQVosQ0FBbUJNLEdBQW5CLENBQVA7QUFDQTtBQUNELFVBQU8sd0JBQUUsQ0FBQ0gsTUFBRCxDQUFGLEVBQVlILE1BQVosQ0FBbUJILFVBQVVTLEdBQVYsQ0FBbkIsQ0FBUDtBQUNBO0FBQ0QsTUFBSUwsT0FBT00sUUFBWCxFQUFxQjtBQUNwQixVQUFPLHdCQUFFLENBQUNKLE1BQUQsRUFBU0csR0FBVCxDQUFGLENBQVA7QUFDQTtBQUNELE1BQUlFLGFBQWFDLEtBQUtaLFNB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cyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IF8gZnJvbSAnaGlnaGxhbmQnO1xuXG5leHBvcnQgY29uc3Qgc3RyaW5naWZ5ID0gc3RyZWFtID0+IHtcblx0bGV0IGlzRmlyc3QgPSB0cnVlO1xuXHRjb25zdCBzID0gXyhbJ1snXSlcblx0XHQuY29uY2F0KHN0cmVhbS5mbGF0TWFwKG9iaj0+IHtcblx0XHRcdGxldCBwcmVmaXggPSAnLCc7XG5cdFx0XHRpZiAoaXNGaXJzdCkge1xuXHRcdFx0XHRpc0ZpcnN0ID0gZmFsc2U7XG5cdFx0XHRcdHByZWZpeCA9ICcnO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXy5pc1N0cmVhbShvYmopKSB7XG5cdFx0XHRcdGlmIChvYmouX19pc0pTT04pIHtcblx0XHRcdFx0XHRyZXR1cm4gXyhbcHJlZml4XSkuY29uY2F0KG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIF8oW3ByZWZpeF0pLmNvbmNhdChzdHJpbmdpZnkob2JqKSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc3RyZWFtLl9faXNKU09OKSB7XG5cdFx0XHRcdHJldHVybiBfKFtwcmVmaXgsIG9ial0pO1xuXHRcdFx0fVxuXHRcdFx0bGV0IGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXHRcdFx0cmV0dXJuIF8oW3ByZWZpeCwganNvblN0cmluZ10pO1xuXHRcdH0pKVxuXHRcdC5hcHBlbmQoJ10nKTtcblx0cy5fX2lzSlNPTiA9IHRydWU7XG5cdHJldHVybiBwYXRjaFN0cmVhbShzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnlPYmogPSBzdHJlYW0gPT4ge1xuXHRsZXQgaXNGaXJzdCA9IHRydWU7XG5cdGNvbnN0IHMgPSBfKFsneyddKVxuXHRcdC5jb25jYXQoc3RyZWFtXG5cdFx0XHQuZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0XHQvLyBHb29kIGZvcm1hdDogW2tleSwgdmFsdWVdXG5cdFx0XHRcdFx0Ly8gcGFzcyBhbG9uZ1xuXHRcdFx0XHRcdHJldHVybiBfKFtvYmpdKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0Ly8gR2V0IGEgb2JqZWN0IGxpa2UgeyBhOiBiLCBjOiBkIH1cblx0XHRcdFx0XHQvLyBUcmFuc2Zvcm0gdG8gWyBbYSwgYl0sIFtjLCBkXSBdXG5cdFx0XHRcdFx0cmV0dXJuIG9iamVjdFRvU3RyZWFtKG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhyb3cgXCJDYW5ub3QgaGFuZGxlIHRoaXMgZm9ybWF0XCI7XG5cdFx0XHR9KVxuXHRcdFx0LmZsYXRNYXAob2JqPT4ge1xuXHRcdFx0XHRsZXQgdGV4dCA9IFwiLFwiO1xuXHRcdFx0XHRpZiAoaXNGaXJzdCkge1xuXHRcdFx0XHRcdGlzRmlyc3QgPSBmYWxzZTtcblx0XHRcdFx0XHR0ZXh0ID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ZXh0ICs9IEpTT04uc3RyaW5naWZ5KG9ialswXSkgKyBcIjpcIjtcblxuXHRcdFx0XHRpZiAoXy5pc1N0cmVhbShvYmpbMV0pKSB7XG5cdFx0XHRcdFx0aWYgKG9ialsxXS5fX2lzSlNPTikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIF8oW3RleHRdKS5jb25jYXQob2JqWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIF8oW3RleHRdKS5jb25jYXQoc3RyaW5naWZ5KG9ialsxXSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBqc29uU3RyaW5nID0gc3RyZWFtLl9faXNKU09OID8gb2JqIDogSlNPTi5zdHJpbmdpZnkob2JqWzFdKTtcblx0XHRcdFx0cmV0dXJuIF8oW3RleHQsIGpzb25TdHJpbmddKTtcblx0XHRcdH0pXG5cdFx0KVxuXHRcdC5hcHBlbmQoJ30nKTtcblx0cy5fX2lzSlNPTiA9IHRydWU7XG5cdHJldHVybiBwYXRjaFN0cmVhbShzKTtcbn1cblxuZXhwb3J0IGNvbnN0IG9iamVjdFRvU3RyZWFtID0gb2JqID0+XG5cdF8oT2JqZWN0LmtleXMob2JqKSkubWFwKGtleSA9PiBba2V5LCBvYmpba2V5XV0pXG5cbi8qKlxuICogUGF0aCBjb21tb24gZnVuY3Rpb25zIHN1Y2ggdGhlIF9faXNKU09OIHByb3BlcnR5IGlzIHJldGFpbmVkXG4gKi9cblxuZXhwb3J0IGNvbnN0IHBhdGNoU3RyZWFtID0gc3RyZWFtID0+IHtcblx0Y29uc3QgbWV0aG9kcyA9IFsnZG90bycsICdlcnJvcnMnLCAndGFwJywgJ3Rocm90dGxlJywgJ2ZvcmsnLCAnc3RvcE9uRXJyb3InLCAnY29uc3VtZScsICdvYnNlcnZlJ107XG5cdG1ldGhvZHMuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGNvbnN0IG9yaWdpbmFsID0gc3RyZWFtW2tleV07XG5cdFx0c3RyZWFtW2tleV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXN1bHQuX19pc0pTT04gPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHBhdGNoU3RyZWFtKHJlc3VsdCk7XG5cdFx0fVxuXHR9KVxuXHRyZXR1cm4gc3RyZWFtO1xufVxuIl19
