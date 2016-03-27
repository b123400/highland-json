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

var patchStream = function patchStream(stream) {
	var methods = ['doto', 'errors', 'tap', 'throttle', 'fork', 'stopOnError'];
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
//# sourceMappingURL=data:application/json;base64,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bkNxQztBQW9DckMsUUFBTyxZQUFZLENBQVosQ0FBUCxDQXBDcUM7Q0FBVjs7QUF1Q3JCLElBQU0sMENBQWlCLFNBQWpCLGNBQWlCO1FBQzdCLHdCQUFFLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FBRixFQUFvQixHQUFwQixDQUF3QjtTQUFPLENBQUMsR0FBRCxFQUFNLElBQUksR0FBSixDQUFOO0VBQVA7Q0FESzs7Ozs7O0FBTzlCLElBQU0sY0FBYyxTQUFkLFdBQWMsU0FBVTtBQUM3QixLQUFNLFVBQVUsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixLQUFuQixFQUEwQixVQUExQixFQUFzQyxNQUF0QyxFQUE4QyxhQUE5QyxDQUFWLENBRHVCO0FBRTdCLFNBQVEsT0FBUixDQUFnQixlQUFPO0FBQ3RCLE1BQU0sV0FBVyxPQUFPLEdBQVAsQ0FBWCxDQURnQjtBQUV0QixTQUFPLEdBQVAsSUFBYyxZQUFXO0FBQ3hCLE9BQU0sU0FBUyxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLENBQVQsQ0FEa0I7QUFFeEIsVUFBTyxRQUFQLEdBQWtCLElBQWxCLENBRndCO0FBR3hCLFVBQU8sWUFBWSxNQUFaLENBQVAsQ0FId0I7R0FBWCxDQUZRO0VBQVAsQ0FBaEIsQ0FGNkI7QUFVN0IsUUFBTyxNQUFQLENBVjZCO0NBQVYiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBfIGZyb20gJ2hpZ2hsYW5kJztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IHN0cmVhbSA9PiB7XG5cdGxldCBpc0ZpcnN0ID0gdHJ1ZTtcblx0Y29uc3QgcyA9IF8oWydbJ10pXG5cdFx0LmNvbmNhdChzdHJlYW0uZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRsZXQgcHJlZml4ID0gJywnO1xuXHRcdFx0aWYgKGlzRmlyc3QpIHtcblx0XHRcdFx0aXNGaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRwcmVmaXggPSAnJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKF8uaXNTdHJlYW0ob2JqKSkge1xuXHRcdFx0XHRpZiAob2JqLl9faXNKU09OKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF8oW3ByZWZpeF0pLmNvbmNhdChvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBfKFtwcmVmaXhdKS5jb25jYXQoc3RyaW5naWZ5KG9iaikpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHN0cmVhbS5fX2lzSlNPTikge1xuXHRcdFx0XHRyZXR1cm4gXyhbcHJlZml4LCBvYmpdKTtcblx0XHRcdH1cblx0XHRcdGxldCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcblx0XHRcdHJldHVybiBfKFtwcmVmaXgsIGpzb25TdHJpbmddKTtcblx0XHR9KSlcblx0XHQuYXBwZW5kKCddJyk7XG5cdHMuX19pc0pTT04gPSB0cnVlO1xuXHRyZXR1cm4gcGF0Y2hTdHJlYW0ocyk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3RyaW5naWZ5T2JqID0gc3RyZWFtID0+IHtcblx0bGV0IGlzRmlyc3QgPSB0cnVlO1xuXHRjb25zdCBzID0gXyhbJ3snXSlcblx0XHQuY29uY2F0KHN0cmVhbVxuXHRcdFx0LmZsYXRNYXAob2JqPT4ge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdFx0Ly8gR29vZCBmb3JtYXQ6IFtrZXksIHZhbHVlXVxuXHRcdFx0XHRcdC8vIHBhc3MgYWxvbmdcblx0XHRcdFx0XHRyZXR1cm4gXyhbb2JqXSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdC8vIEdldCBhIG9iamVjdCBsaWtlIHsgYTogYiwgYzogZCB9XG5cdFx0XHRcdFx0Ly8gVHJhbnNmb3JtIHRvIFsgW2EsIGJdLCBbYywgZF0gXVxuXHRcdFx0XHRcdHJldHVybiBvYmplY3RUb1N0cmVhbShvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRocm93IFwiQ2Fubm90IGhhbmRsZSB0aGlzIGZvcm1hdFwiO1xuXHRcdFx0fSlcblx0XHRcdC5mbGF0TWFwKG9iaj0+IHtcblx0XHRcdFx0bGV0IHRleHQgPSBcIixcIjtcblx0XHRcdFx0aWYgKGlzRmlyc3QpIHtcblx0XHRcdFx0XHRpc0ZpcnN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0dGV4dCA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGV4dCArPSBKU09OLnN0cmluZ2lmeShvYmpbMF0pICsgXCI6XCI7XG5cblx0XHRcdFx0aWYgKF8uaXNTdHJlYW0ob2JqWzFdKSkge1xuXHRcdFx0XHRcdGlmIChvYmpbMV0uX19pc0pTT04pIHtcblx0XHRcdFx0XHRcdHJldHVybiBfKFt0ZXh0XSkuY29uY2F0KG9ialsxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBfKFt0ZXh0XSkuY29uY2F0KHN0cmluZ2lmeShvYmpbMV0pKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQganNvblN0cmluZyA9IHN0cmVhbS5fX2lzSlNPTiA/IG9iaiA6IEpTT04uc3RyaW5naWZ5KG9ialsxXSk7XG5cdFx0XHRcdHJldHVybiBfKFt0ZXh0LCBqc29uU3RyaW5nXSk7XG5cdFx0XHR9KVxuXHRcdClcblx0XHQuYXBwZW5kKCd9Jyk7XG5cdHMuX19pc0pTT04gPSB0cnVlO1xuXHRyZXR1cm4gcGF0Y2hTdHJlYW0ocyk7XG59XG5cbmV4cG9ydCBjb25zdCBvYmplY3RUb1N0cmVhbSA9IG9iaiA9PlxuXHRfKE9iamVjdC5rZXlzKG9iaikpLm1hcChrZXkgPT4gW2tleSwgb2JqW2tleV1dKVxuXG4vKipcbiAqIFBhdGggY29tbW9uIGZ1bmN0aW9ucyBzdWNoIHRoZSBfX2lzSlNPTiBwcm9wZXJ0eSBpcyByZXRhaW5lZFxuICovXG5cbmNvbnN0IHBhdGNoU3RyZWFtID0gc3RyZWFtID0+IHtcblx0Y29uc3QgbWV0aG9kcyA9IFsnZG90bycsICdlcnJvcnMnLCAndGFwJywgJ3Rocm90dGxlJywgJ2ZvcmsnLCAnc3RvcE9uRXJyb3InXTtcblx0bWV0aG9kcy5mb3JFYWNoKGtleSA9PiB7XG5cdFx0Y29uc3Qgb3JpZ2luYWwgPSBzdHJlYW1ba2V5XTtcblx0XHRzdHJlYW1ba2V5XSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdHJlc3VsdC5fX2lzSlNPTiA9IHRydWU7XG5cdFx0XHRyZXR1cm4gcGF0Y2hTdHJlYW0ocmVzdWx0KTtcblx0XHR9XG5cdH0pXG5cdHJldHVybiBzdHJlYW07XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
