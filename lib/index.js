'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.patchStream = exports.objectToStream = exports.stringifyObjWithOptions = exports.stringifyObj = exports.stringifyWithOptions = exports.stringify = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _highland = require('highland');

var _highland2 = _interopRequireDefault(_highland);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringify = exports.stringify = function stringify(options) {
	if (_highland2.default.isStream(options)) {
		return stringifyWithOptions(options);
	};
	return function (stream) {
		return stringifyWithOptions(stream, options);
	};
};

var stringifyWithOptions = exports.stringifyWithOptions = function stringifyWithOptions(stream, options) {
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
			return (0, _highland2.default)([prefix]).concat(stringifyWithOptions(obj, options));
		}
		if (stream.__isJSON) {
			return (0, _highland2.default)([prefix, obj]);
		}

		var jsonString = options && typeof options.stringify === 'function' ? options.stringify(obj, stream) : JSON.stringify(obj);
		return (0, _highland2.default)([prefix, jsonString]);
	})).append(']');
	s.__isJSON = true;
	return patchStream(s);
};

var stringifyObj = exports.stringifyObj = function stringifyObj(options) {
	if (_highland2.default.isStream(options)) {
		return stringifyObjWithOptions(options);
	};
	return function (stream) {
		return stringifyObjWithOptions(stream, options);
	};
};

var stringifyObjWithOptions = exports.stringifyObjWithOptions = function stringifyObjWithOptions(stream, options) {
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
			return (0, _highland2.default)([text]).concat(stringifyWithOptions(obj[1], options));
		}
		var jsonString = stream.__isJSON ? obj : options && typeof options.stringify === 'function' ? options.stringify(obj[1], stream) : JSON.stringify(obj[1]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInN0cmluZ2lmeSIsIl8iLCJpc1N0cmVhbSIsIm9wdGlvbnMiLCJzdHJpbmdpZnlXaXRoT3B0aW9ucyIsInN0cmVhbSIsImlzRmlyc3QiLCJzIiwiY29uY2F0IiwiZmxhdE1hcCIsInByZWZpeCIsIm9iaiIsIl9faXNKU09OIiwianNvblN0cmluZyIsIkpTT04iLCJhcHBlbmQiLCJwYXRjaFN0cmVhbSIsInN0cmluZ2lmeU9iaiIsInN0cmluZ2lmeU9ialdpdGhPcHRpb25zIiwiQXJyYXkiLCJpc0FycmF5Iiwib2JqZWN0VG9TdHJlYW0iLCJ0ZXh0IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImtleSIsIm1ldGhvZHMiLCJmb3JFYWNoIiwib3JpZ2luYWwiLCJyZXN1bHQiLCJhcHBseSIsImFyZ3VtZW50cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFFTyxJQUFNQSxnQ0FBWSxTQUFaQSxTQUFZLFVBQVc7QUFDbkMsS0FBSUMsbUJBQUVDLFFBQUYsQ0FBV0MsT0FBWCxDQUFKLEVBQXlCO0FBQ3hCLFNBQU9DLHFCQUFxQkQsT0FBckIsQ0FBUDtBQUNBO0FBQ0QsUUFBTztBQUFBLFNBQVVDLHFCQUFxQkMsTUFBckIsRUFBNkJGLE9BQTdCLENBQVY7QUFBQSxFQUFQO0FBQ0EsQ0FMTTs7QUFPQSxJQUFNQyxzREFBdUIsU0FBdkJBLG9CQUF1QixDQUFDQyxNQUFELEVBQVNGLE9BQVQsRUFBcUI7QUFDeEQsS0FBSUcsVUFBVSxJQUFkO0FBQ0EsS0FBTUMsSUFBSSx3QkFBRSxDQUFDLEdBQUQsQ0FBRixFQUNSQyxNQURRLENBQ0RILE9BQU9JLE9BQVAsQ0FBZSxlQUFNO0FBQzVCLE1BQUlDLFNBQVMsR0FBYjtBQUNBLE1BQUlKLE9BQUosRUFBYTtBQUNaQSxhQUFVLEtBQVY7QUFDQUksWUFBUyxFQUFUO0FBQ0E7O0FBRUQsTUFBSVQsbUJBQUVDLFFBQUYsQ0FBV1MsR0FBWCxDQUFKLEVBQXFCO0FBQ3BC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LENBREMsRUFxQ1JFLE1BckNRLENBcUNELEdBckNDLENBQVY7QUFzQ0FSLEdBQUVLLFFBQUYsR0FBYSxJQUFiO0FBQ0EsUUFBT0ksWUFBWVQsQ0FBWixDQUFQO0FBQ0EsQ0ExQ007O0FBNENBLElBQU1jLDBDQUFpQixTQUFqQkEsY0FBaUI7QUFBQSxRQUM3Qix3QkFBRUUsT0FBT0MsSUFBUCxDQUFZYixHQUFaLENBQUYsRUFBb0JjLEdBQXBCLENBQXdCO0FBQUEsU0FBTyxDQUFDQyxHQUFELEVBQU1mLElBQUllLEdBQUosQ0FBTixDQUFQO0FBQUEsRUFBeEIsQ0FENkI7QUFBQSxDQUF2Qjs7QUFHUDs7OztBQUlPLElBQU1WLG9DQUFjLFNBQWRBLFdBQWMsU0FBVTtBQUNwQyxLQUFNVyxVQUFVLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsS0FBbkIsRUFBMEIsVUFBMUIsRUFBc0MsTUFBdEMsRUFBOEMsYUFBOUMsRUFBNkQsU0FBN0QsRUFBd0UsU0FBeEUsQ0FBaEI7QUFDQUEsU0FBUUMsT0FBUixDQUFnQixlQUFPO0FBQ3RCLE1BQU1DLFdBQVd4QixPQUFPcUIsR0FBUCxDQUFqQjtBQUNBckIsU0FBT3FCLEdBQVAsSUFBYyxZQUFXO0FBQ3hCLE9BQU1JLFNBQVNELFNBQVNFLEtBQVQsQ0FBZSxJQUFmLEVBQXFCQyxTQUFyQixDQUFmO0FBQ0FGLFVBQU9sQixRQUFQLEdBQWtCLElBQWxCO0FBQ0EsVUFBT0ksWUFBWWMsTUFBWixDQUFQO0FBQ0EsR0FKRDtBQUtBLEVBUEQ7QUFRQSxRQUFPekIsTUFBUDtBQUNBLENBWE0iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBfIGZyb20gJ2hpZ2hsYW5kJztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IG9wdGlvbnMgPT4ge1xuXHRpZiAoXy5pc1N0cmVhbShvcHRpb25zKSkge1xuXHRcdHJldHVybiBzdHJpbmdpZnlXaXRoT3B0aW9ucyhvcHRpb25zKTtcblx0fTtcblx0cmV0dXJuIHN0cmVhbSA9PiBzdHJpbmdpZnlXaXRoT3B0aW9ucyhzdHJlYW0sIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgY29uc3Qgc3RyaW5naWZ5V2l0aE9wdGlvbnMgPSAoc3RyZWFtLCBvcHRpb25zKSA9PiB7XG5cdGxldCBpc0ZpcnN0ID0gdHJ1ZTtcblx0Y29uc3QgcyA9IF8oWydbJ10pXG5cdFx0LmNvbmNhdChzdHJlYW0uZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRsZXQgcHJlZml4ID0gJywnO1xuXHRcdFx0aWYgKGlzRmlyc3QpIHtcblx0XHRcdFx0aXNGaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRwcmVmaXggPSAnJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKF8uaXNTdHJlYW0ob2JqKSkge1xuXHRcdFx0XHRpZiAob2JqLl9faXNKU09OKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF8oW3ByZWZpeF0pLmNvbmNhdChvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBfKFtwcmVmaXhdKS5jb25jYXQoc3RyaW5naWZ5V2l0aE9wdGlvbnMob2JqLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc3RyZWFtLl9faXNKU09OKSB7XG5cdFx0XHRcdHJldHVybiBfKFtwcmVmaXgsIG9ial0pO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQganNvblN0cmluZyA9IFxuXHRcdFx0XHRvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnN0cmluZ2lmeSA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0XHQ/IG9wdGlvbnMuc3RyaW5naWZ5KG9iaiwgc3RyZWFtKVxuXHRcdFx0XHQ6IEpTT04uc3RyaW5naWZ5KG9iaik7XG5cdFx0XHRyZXR1cm4gXyhbcHJlZml4LCBqc29uU3RyaW5nXSk7XG5cdFx0fSkpXG5cdFx0LmFwcGVuZCgnXScpO1xuXHRzLl9faXNKU09OID0gdHJ1ZTtcblx0cmV0dXJuIHBhdGNoU3RyZWFtKHMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeU9iaiA9IG9wdGlvbnMgPT4ge1xuXHRpZiAoXy5pc1N0cmVhbShvcHRpb25zKSkge1xuXHRcdHJldHVybiBzdHJpbmdpZnlPYmpXaXRoT3B0aW9ucyhvcHRpb25zKTtcblx0fTtcblx0cmV0dXJuIHN0cmVhbSA9PiBzdHJpbmdpZnlPYmpXaXRoT3B0aW9ucyhzdHJlYW0sIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgY29uc3Qgc3RyaW5naWZ5T2JqV2l0aE9wdGlvbnMgPSAoc3RyZWFtLCBvcHRpb25zKSA9PiB7XG5cdGxldCBpc0ZpcnN0ID0gdHJ1ZTtcblx0Y29uc3QgcyA9IF8oWyd7J10pXG5cdFx0LmNvbmNhdChzdHJlYW1cblx0XHRcdC5mbGF0TWFwKG9iaj0+IHtcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRcdC8vIEdvb2QgZm9ybWF0OiBba2V5LCB2YWx1ZV1cblx0XHRcdFx0XHQvLyBwYXNzIGFsb25nXG5cdFx0XHRcdFx0cmV0dXJuIF8oW29ial0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHQvLyBHZXQgYSBvYmplY3QgbGlrZSB7IGE6IGIsIGM6IGQgfVxuXHRcdFx0XHRcdC8vIFRyYW5zZm9ybSB0byBbIFthLCBiXSwgW2MsIGRdIF1cblx0XHRcdFx0XHRyZXR1cm4gb2JqZWN0VG9TdHJlYW0ob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aHJvdyBcIkNhbm5vdCBoYW5kbGUgdGhpcyBmb3JtYXRcIjtcblx0XHRcdH0pXG5cdFx0XHQuZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRcdGxldCB0ZXh0ID0gXCIsXCI7XG5cdFx0XHRcdGlmIChpc0ZpcnN0KSB7XG5cdFx0XHRcdFx0aXNGaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHRleHQgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHQgKz0gSlNPTi5zdHJpbmdpZnkob2JqWzBdKSArIFwiOlwiO1xuXG5cdFx0XHRcdGlmIChfLmlzU3RyZWFtKG9ialsxXSkpIHtcblx0XHRcdFx0XHRpZiAob2JqWzFdLl9faXNKU09OKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXyhbdGV4dF0pLmNvbmNhdChvYmpbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gXyhbdGV4dF0pLmNvbmNhdChzdHJpbmdpZnlXaXRoT3B0aW9ucyhvYmpbMV0sIG9wdGlvbnMpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQganNvblN0cmluZyA9XG5cdFx0XHRcdFx0c3RyZWFtLl9faXNKU09OXG5cdFx0XHRcdFx0PyBvYmpcblx0XHRcdFx0XHQ6IG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc3RyaW5naWZ5ID09PSAnZnVuY3Rpb24nXG5cdFx0XHRcdFx0PyBvcHRpb25zLnN0cmluZ2lmeShvYmpbMV0sIHN0cmVhbSlcblx0XHRcdFx0XHQ6IEpTT04uc3RyaW5naWZ5KG9ialsxXSk7XG5cdFx0XHRcdHJldHVybiBfKFt0ZXh0LCBqc29uU3RyaW5nXSk7XG5cdFx0XHR9KVxuXHRcdClcblx0XHQuYXBwZW5kKCd9Jyk7XG5cdHMuX19pc0pTT04gPSB0cnVlO1xuXHRyZXR1cm4gcGF0Y2hTdHJlYW0ocyk7XG59XG5cbmV4cG9ydCBjb25zdCBvYmplY3RUb1N0cmVhbSA9IG9iaiA9PlxuXHRfKE9iamVjdC5rZXlzKG9iaikpLm1hcChrZXkgPT4gW2tleSwgb2JqW2tleV1dKVxuXG4vKipcbiAqIFBhdGggY29tbW9uIGZ1bmN0aW9ucyBzdWNoIHRoZSBfX2lzSlNPTiBwcm9wZXJ0eSBpcyByZXRhaW5lZFxuICovXG5cbmV4cG9ydCBjb25zdCBwYXRjaFN0cmVhbSA9IHN0cmVhbSA9PiB7XG5cdGNvbnN0IG1ldGhvZHMgPSBbJ2RvdG8nLCAnZXJyb3JzJywgJ3RhcCcsICd0aHJvdHRsZScsICdmb3JrJywgJ3N0b3BPbkVycm9yJywgJ2NvbnN1bWUnLCAnb2JzZXJ2ZSddO1xuXHRtZXRob2RzLmZvckVhY2goa2V5ID0+IHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IHN0cmVhbVtrZXldO1xuXHRcdHN0cmVhbVtrZXldID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmVzdWx0Ll9faXNKU09OID0gdHJ1ZTtcblx0XHRcdHJldHVybiBwYXRjaFN0cmVhbShyZXN1bHQpO1xuXHRcdH1cblx0fSlcblx0cmV0dXJuIHN0cmVhbTtcbn1cbiJdfQ==
