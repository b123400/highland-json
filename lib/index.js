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
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		var _loop = function _loop() {
			var key = _step.value;

			var original = stream[key];
			stream[key] = function () {
				var result = original.apply(this, arguments);
				result.__isJSON = true;
				return result;
			};
		};

		for (var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			_loop();
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return stream;
};
//# sourceMappingURL=data:application/json;base64,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bkNxQztBQW9DckMsUUFBTyxZQUFZLENBQVosQ0FBUCxDQXBDcUM7Q0FBVjs7QUF1Q3JCLElBQU0sMENBQWlCLFNBQWpCLGNBQWlCO1FBQzdCLHdCQUFFLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FBRixFQUFvQixHQUFwQixDQUF3QjtTQUFPLENBQUMsR0FBRCxFQUFNLElBQUksR0FBSixDQUFOO0VBQVA7Q0FESzs7Ozs7O0FBTzlCLElBQU0sY0FBYyxTQUFkLFdBQWMsU0FBVTtBQUM3QixLQUFNLFVBQVUsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixLQUFuQixFQUEwQixVQUExQixFQUFzQyxNQUF0QyxFQUE4QyxhQUE5QyxDQUFWLENBRHVCOzs7Ozs7O09BRXBCOztBQUNSLE9BQU0sV0FBVyxPQUFPLEdBQVAsQ0FBWDtBQUNOLFVBQU8sR0FBUCxJQUFjLFlBQVc7QUFDeEIsUUFBTSxTQUFTLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBVCxDQURrQjtBQUV4QixXQUFPLFFBQVAsR0FBa0IsSUFBbEIsQ0FGd0I7QUFHeEIsV0FBTyxNQUFQLENBSHdCO0lBQVg7OztBQUZmLHVCQUFnQixpQ0FBaEIsb0dBQXlCOztHQUF6Qjs7Ozs7Ozs7Ozs7Ozs7RUFGNkI7O0FBVTdCLFFBQU8sTUFBUCxDQVY2QjtDQUFWIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgXyBmcm9tICdoaWdobGFuZCc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSBzdHJlYW0gPT4ge1xuXHRsZXQgaXNGaXJzdCA9IHRydWU7XG5cdGNvbnN0IHMgPSBfKFsnWyddKVxuXHRcdC5jb25jYXQoc3RyZWFtLmZsYXRNYXAob2JqPT4ge1xuXHRcdFx0bGV0IHByZWZpeCA9ICcsJztcblx0XHRcdGlmIChpc0ZpcnN0KSB7XG5cdFx0XHRcdGlzRmlyc3QgPSBmYWxzZTtcblx0XHRcdFx0cHJlZml4ID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChfLmlzU3RyZWFtKG9iaikpIHtcblx0XHRcdFx0aWYgKG9iai5fX2lzSlNPTikge1xuXHRcdFx0XHRcdHJldHVybiBfKFtwcmVmaXhdKS5jb25jYXQob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gXyhbcHJlZml4XSkuY29uY2F0KHN0cmluZ2lmeShvYmopKTtcblx0XHRcdH1cblx0XHRcdGlmIChzdHJlYW0uX19pc0pTT04pIHtcblx0XHRcdFx0cmV0dXJuIF8oW3ByZWZpeCwgb2JqXSk7XG5cdFx0XHR9XG5cdFx0XHRsZXQganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG5cdFx0XHRyZXR1cm4gXyhbcHJlZml4LCBqc29uU3RyaW5nXSk7XG5cdFx0fSkpXG5cdFx0LmFwcGVuZCgnXScpO1xuXHRzLl9faXNKU09OID0gdHJ1ZTtcblx0cmV0dXJuIHBhdGNoU3RyZWFtKHMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeU9iaiA9IHN0cmVhbSA9PiB7XG5cdGxldCBpc0ZpcnN0ID0gdHJ1ZTtcblx0Y29uc3QgcyA9IF8oWyd7J10pXG5cdFx0LmNvbmNhdChzdHJlYW1cblx0XHRcdC5mbGF0TWFwKG9iaj0+IHtcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRcdC8vIEdvb2QgZm9ybWF0OiBba2V5LCB2YWx1ZV1cblx0XHRcdFx0XHQvLyBwYXNzIGFsb25nXG5cdFx0XHRcdFx0cmV0dXJuIF8oW29ial0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHQvLyBHZXQgYSBvYmplY3QgbGlrZSB7IGE6IGIsIGM6IGQgfVxuXHRcdFx0XHRcdC8vIFRyYW5zZm9ybSB0byBbIFthLCBiXSwgW2MsIGRdIF1cblx0XHRcdFx0XHRyZXR1cm4gb2JqZWN0VG9TdHJlYW0ob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aHJvdyBcIkNhbm5vdCBoYW5kbGUgdGhpcyBmb3JtYXRcIjtcblx0XHRcdH0pXG5cdFx0XHQuZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRcdGxldCB0ZXh0ID0gXCIsXCI7XG5cdFx0XHRcdGlmIChpc0ZpcnN0KSB7XG5cdFx0XHRcdFx0aXNGaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHRleHQgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHQgKz0gSlNPTi5zdHJpbmdpZnkob2JqWzBdKSArIFwiOlwiO1xuXG5cdFx0XHRcdGlmIChfLmlzU3RyZWFtKG9ialsxXSkpIHtcblx0XHRcdFx0XHRpZiAob2JqWzFdLl9faXNKU09OKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXyhbdGV4dF0pLmNvbmNhdChvYmpbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gXyhbdGV4dF0pLmNvbmNhdChzdHJpbmdpZnkob2JqWzFdKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGpzb25TdHJpbmcgPSBzdHJlYW0uX19pc0pTT04gPyBvYmogOiBKU09OLnN0cmluZ2lmeShvYmpbMV0pO1xuXHRcdFx0XHRyZXR1cm4gXyhbdGV4dCwganNvblN0cmluZ10pO1xuXHRcdFx0fSlcblx0XHQpXG5cdFx0LmFwcGVuZCgnfScpO1xuXHRzLl9faXNKU09OID0gdHJ1ZTtcblx0cmV0dXJuIHBhdGNoU3RyZWFtKHMpO1xufVxuXG5leHBvcnQgY29uc3Qgb2JqZWN0VG9TdHJlYW0gPSBvYmogPT5cblx0XyhPYmplY3Qua2V5cyhvYmopKS5tYXAoa2V5ID0+IFtrZXksIG9ialtrZXldXSlcblxuLyoqXG4gKiBQYXRoIGNvbW1vbiBmdW5jdGlvbnMgc3VjaCB0aGUgX19pc0pTT04gcHJvcGVydHkgaXMgcmV0YWluZWRcbiAqL1xuXG5jb25zdCBwYXRjaFN0cmVhbSA9IHN0cmVhbSA9PiB7XG5cdGNvbnN0IG1ldGhvZHMgPSBbJ2RvdG8nLCAnZXJyb3JzJywgJ3RhcCcsICd0aHJvdHRsZScsICdmb3JrJywgJ3N0b3BPbkVycm9yJ107XG5cdGZvciAobGV0IGtleSBvZiBtZXRob2RzKSB7XG5cdFx0Y29uc3Qgb3JpZ2luYWwgPSBzdHJlYW1ba2V5XTtcblx0XHRzdHJlYW1ba2V5XSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdHJlc3VsdC5fX2lzSlNPTiA9IHRydWU7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gc3RyZWFtO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
