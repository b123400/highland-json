'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.objectToStream = exports.stringifyObj = exports.stringify = undefined;

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

var patchStream = function patchStream(stream) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInN0cmluZ2lmeSIsImlzRmlyc3QiLCJzIiwiY29uY2F0Iiwic3RyZWFtIiwiZmxhdE1hcCIsInByZWZpeCIsImlzU3RyZWFtIiwib2JqIiwiX19pc0pTT04iLCJqc29uU3RyaW5nIiwiSlNPTiIsImFwcGVuZCIsInBhdGNoU3RyZWFtIiwic3RyaW5naWZ5T2JqIiwiQXJyYXkiLCJpc0FycmF5Iiwib2JqZWN0VG9TdHJlYW0iLCJ0ZXh0IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImtleSIsIm1ldGhvZHMiLCJmb3JFYWNoIiwib3JpZ2luYWwiLCJyZXN1bHQiLCJhcHBseSIsImFyZ3VtZW50cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFFTyxJQUFNQSxnQ0FBWSxTQUFaQSxTQUFZLFNBQVU7QUFDbEMsS0FBSUMsVUFBVSxJQUFkO0FBQ0EsS0FBTUMsSUFBSSx3QkFBRSxDQUFDLEdBQUQsQ0FBRixFQUNSQyxNQURRLENBQ0RDLE9BQU9DLE9BQVAsQ0FBZSxlQUFNO0FBQzVCLE1BQUlDLFNBQVMsR0FBYjtBQUNBLE1BQUlMLE9BQUosRUFBYTtBQUNaQSxhQUFVLEtBQVY7QUFDQUssWUFBUyxFQUFUO0FBQ0E7O0FBRUQsTUFBSSxtQkFBRUMsUUFBRixDQUFXQyxHQUFYLENBQUosRUFBcUI7QUFDcEIsT0FBSUEsSUFBSUMsUUFBUixFQUFrQjtBQUNqQixXQUFPLHdCQUFFLENBQUNILE1BQUQsQ0FBRixFQUFZSCxNQUFaLENBQW1CSyxHQUFuQixDQUFQO0FBQ0E7QUFDRCxVQUFPLHdCQUFFLENBQUNGLE1BQUQsQ0FBRixFQUFZSCxNQUFaLENBQW1CSCxVQUFVUSxHQUFWLENBQW5CLENBQVA7QUFDQTtBQUNELE1BQUlKLE9BQU9LLFFBQVgsRUFBcUI7QUFDcEIsVUFBTyx3QkFBRSxDQUFDSCxNQUFELEVBQVNFLEdBQVQsQ0FBRixDQUFQO0FBQ0E7QUFDRCxNQUFJRSxhQUFhQyxLQUFLWCxTQUFMLENBQWVRLEdBQWYsQ0FBakI7QUFDQSxTQUFPLHdCQUFFLENBQUNGLE1BQUQsRUFBU0ksVUFBVCxDQUFGLENBQVA7QUFDQSxFQWxCTyxDQURDLEVBb0JSRSxNQXBCUSxDQW9CRCxHQXBCQyxDQUFWO0FBcUJBVixHQUFFTyxRQUFGLEdBQWEsSUFBYjtBQUNBLFFBQU9JLFlBQVlYLENBQVosQ0FBUDtBQUNBLENBekJNOztBQTJCQSxJQUFNWSxzQ0FBZSxTQUFmQSxZQUFlLFNBQVU7QUFDckMsS0FBSWIsVUFBVSxJQUFkO0FBQ0EsS0FBTUMsSUFBSSx3QkFBRSxDQUFDLEdBQUQsQ0FBRixFQUNSQyxNQURRLENBQ0RDLE9BQ05DLE9BRE0sQ0FDRSxlQUFNO0FBQ2QsTUFBSVUsTUFBTUMsT0FBTixDQUFjUixHQUFkLENBQUosRUFBd0I7QUFDdkI7QUFDQTtBQUNBLFVBQU8sd0JBQUUsQ0FBQ0EsR0FBRCxDQUFGLENBQVA7QUFDQSxHQUpELE1BSU8sSUFBSSxRQUFPQSxHQUFQLHlDQUFPQSxHQUFQLE9BQWUsUUFBbkIsRUFBNkI7QUFDbkM7QUFDQTtBQUNBLFVBQU9TLGVBQWVULEdBQWYsQ0FBUDtBQUNBO0FBQ0QsUUFBTSwyQkFBTjtBQUNBLEVBWk0sRUFhTkgsT0FiTSxDQWFFLGVBQU07QUFDZCxNQUFJYSxPQUFPLEdBQVg7QUFDQSxNQUFJakIsT0FBSixFQUFhO0FBQ1pBLGFBQVUsS0FBVjtBQUNBaUIsVUFBTyxFQUFQO0FBQ0E7QUFDREEsVUFBUVAsS0FBS1gsU0FBTCxDQUFlUSxJQUFJLENBQUosQ0FBZixJQUF5QixHQUFqQzs7QUFFQSxNQUFJLG1CQUFFRCxRQUFGLENBQVdDLElBQUksQ0FBSixDQUFYLENBQUosRUFBd0I7QUFDdkIsT0FBSUEsSUFBSSxDQUFKLEVBQU9DLFFBQVgsRUFBcUI7QUFDcEIsV0FBTyx3QkFBRSxDQUFDUyxJQUFELENBQUYsRUFBVWYsTUFBVixDQUFpQkssSUFBSSxDQUFKLENBQWpCLENBQVA7QUFDQTtBQUNELFVBQU8sd0JBQUUsQ0FBQ1UsSUFBRCxDQUFGLEVBQVVmLE1BQVYsQ0FBaUJILFVBQVVRLElBQUksQ0FBSixDQUFWLENBQWpCLENBQVA7QUFDQTtBQUNELE1BQUlFLGFBQWFOLE9BQU9LLFFBQVAsR0FBa0JELEdBQWxCLEdBQXdCRyxLQUFLWCxTQUFMLENBQWVRLElBQUksQ0FBSixDQUFmLENBQXpDO0FBQ0EsU0FBTyx3QkFBRSxDQUFDVSxJQUFELEVBQU9SLFVBQVAsQ0FBRixDQUFQO0FBQ0EsRUE3Qk0sQ0FEQyxFQWdDUkUsTUFoQ1EsQ0FnQ0QsR0FoQ0MsQ0FBVjtBQWlDQVYsR0FBRU8sUUFBRixHQUFhLElBQWI7QUFDQSxRQUFPSSxZQUFZWCxDQUFaLENBQVA7QUFDQSxDQXJDTTs7QUF1Q0EsSUFBTWUsMENBQWlCLFNBQWpCQSxjQUFpQjtBQUFBLFFBQzdCLHdCQUFFRSxPQUFPQyxJQUFQLENBQVlaLEdBQVosQ0FBRixFQUFvQmEsR0FBcEIsQ0FBd0I7QUFBQSxTQUFPLENBQUNDLEdBQUQsRUFBTWQsSUFBSWMsR0FBSixDQUFOLENBQVA7QUFBQSxFQUF4QixDQUQ2QjtBQUFBLENBQXZCOztBQUdQOzs7O0FBSUEsSUFBTVQsY0FBYyxTQUFkQSxXQUFjLFNBQVU7QUFDN0IsS0FBTVUsVUFBVSxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLEtBQW5CLEVBQTBCLFVBQTFCLEVBQXNDLE1BQXRDLEVBQThDLGFBQTlDLEVBQTZELFNBQTdELEVBQXdFLFNBQXhFLENBQWhCO0FBQ0FBLFNBQVFDLE9BQVIsQ0FBZ0IsZUFBTztBQUN0QixNQUFNQyxXQUFXckIsT0FBT2tCLEdBQVAsQ0FBakI7QUFDQWxCLFNBQU9rQixHQUFQLElBQWMsWUFBVztBQUN4QixPQUFNSSxTQUFTRCxTQUFTRSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckIsQ0FBZjtBQUNBRixVQUFPakIsUUFBUCxHQUFrQixJQUFsQjtBQUNBLFVBQU9JLFlBQVlhLE1BQVosQ0FBUDtBQUNBLEdBSkQ7QUFLQSxFQVBEO0FBUUEsUUFBT3RCLE1BQVA7QUFDQSxDQVhEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgXyBmcm9tICdoaWdobGFuZCc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSBzdHJlYW0gPT4ge1xuXHRsZXQgaXNGaXJzdCA9IHRydWU7XG5cdGNvbnN0IHMgPSBfKFsnWyddKVxuXHRcdC5jb25jYXQoc3RyZWFtLmZsYXRNYXAob2JqPT4ge1xuXHRcdFx0bGV0IHByZWZpeCA9ICcsJztcblx0XHRcdGlmIChpc0ZpcnN0KSB7XG5cdFx0XHRcdGlzRmlyc3QgPSBmYWxzZTtcblx0XHRcdFx0cHJlZml4ID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChfLmlzU3RyZWFtKG9iaikpIHtcblx0XHRcdFx0aWYgKG9iai5fX2lzSlNPTikge1xuXHRcdFx0XHRcdHJldHVybiBfKFtwcmVmaXhdKS5jb25jYXQob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gXyhbcHJlZml4XSkuY29uY2F0KHN0cmluZ2lmeShvYmopKTtcblx0XHRcdH1cblx0XHRcdGlmIChzdHJlYW0uX19pc0pTT04pIHtcblx0XHRcdFx0cmV0dXJuIF8oW3ByZWZpeCwgb2JqXSk7XG5cdFx0XHR9XG5cdFx0XHRsZXQganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG5cdFx0XHRyZXR1cm4gXyhbcHJlZml4LCBqc29uU3RyaW5nXSk7XG5cdFx0fSkpXG5cdFx0LmFwcGVuZCgnXScpO1xuXHRzLl9faXNKU09OID0gdHJ1ZTtcblx0cmV0dXJuIHBhdGNoU3RyZWFtKHMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeU9iaiA9IHN0cmVhbSA9PiB7XG5cdGxldCBpc0ZpcnN0ID0gdHJ1ZTtcblx0Y29uc3QgcyA9IF8oWyd7J10pXG5cdFx0LmNvbmNhdChzdHJlYW1cblx0XHRcdC5mbGF0TWFwKG9iaj0+IHtcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRcdC8vIEdvb2QgZm9ybWF0OiBba2V5LCB2YWx1ZV1cblx0XHRcdFx0XHQvLyBwYXNzIGFsb25nXG5cdFx0XHRcdFx0cmV0dXJuIF8oW29ial0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHQvLyBHZXQgYSBvYmplY3QgbGlrZSB7IGE6IGIsIGM6IGQgfVxuXHRcdFx0XHRcdC8vIFRyYW5zZm9ybSB0byBbIFthLCBiXSwgW2MsIGRdIF1cblx0XHRcdFx0XHRyZXR1cm4gb2JqZWN0VG9TdHJlYW0ob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aHJvdyBcIkNhbm5vdCBoYW5kbGUgdGhpcyBmb3JtYXRcIjtcblx0XHRcdH0pXG5cdFx0XHQuZmxhdE1hcChvYmo9PiB7XG5cdFx0XHRcdGxldCB0ZXh0ID0gXCIsXCI7XG5cdFx0XHRcdGlmIChpc0ZpcnN0KSB7XG5cdFx0XHRcdFx0aXNGaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHRleHQgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHQgKz0gSlNPTi5zdHJpbmdpZnkob2JqWzBdKSArIFwiOlwiO1xuXG5cdFx0XHRcdGlmIChfLmlzU3RyZWFtKG9ialsxXSkpIHtcblx0XHRcdFx0XHRpZiAob2JqWzFdLl9faXNKU09OKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXyhbdGV4dF0pLmNvbmNhdChvYmpbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gXyhbdGV4dF0pLmNvbmNhdChzdHJpbmdpZnkob2JqWzFdKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGpzb25TdHJpbmcgPSBzdHJlYW0uX19pc0pTT04gPyBvYmogOiBKU09OLnN0cmluZ2lmeShvYmpbMV0pO1xuXHRcdFx0XHRyZXR1cm4gXyhbdGV4dCwganNvblN0cmluZ10pO1xuXHRcdFx0fSlcblx0XHQpXG5cdFx0LmFwcGVuZCgnfScpO1xuXHRzLl9faXNKU09OID0gdHJ1ZTtcblx0cmV0dXJuIHBhdGNoU3RyZWFtKHMpO1xufVxuXG5leHBvcnQgY29uc3Qgb2JqZWN0VG9TdHJlYW0gPSBvYmogPT5cblx0XyhPYmplY3Qua2V5cyhvYmopKS5tYXAoa2V5ID0+IFtrZXksIG9ialtrZXldXSlcblxuLyoqXG4gKiBQYXRoIGNvbW1vbiBmdW5jdGlvbnMgc3VjaCB0aGUgX19pc0pTT04gcHJvcGVydHkgaXMgcmV0YWluZWRcbiAqL1xuXG5jb25zdCBwYXRjaFN0cmVhbSA9IHN0cmVhbSA9PiB7XG5cdGNvbnN0IG1ldGhvZHMgPSBbJ2RvdG8nLCAnZXJyb3JzJywgJ3RhcCcsICd0aHJvdHRsZScsICdmb3JrJywgJ3N0b3BPbkVycm9yJywgJ2NvbnN1bWUnLCAnb2JzZXJ2ZSddO1xuXHRtZXRob2RzLmZvckVhY2goa2V5ID0+IHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IHN0cmVhbVtrZXldO1xuXHRcdHN0cmVhbVtrZXldID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmVzdWx0Ll9faXNKU09OID0gdHJ1ZTtcblx0XHRcdHJldHVybiBwYXRjaFN0cmVhbShyZXN1bHQpO1xuXHRcdH1cblx0fSlcblx0cmV0dXJuIHN0cmVhbTtcbn1cbiJdfQ==
