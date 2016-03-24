"use strict";
/* global require */
var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(cb) {
	// You can use multiple globbing patterns as you would with `gulp.src`
	return del(['build', 'test/build'], cb)
});

// gulp.task('lint', ()=>
// 	gulp.src("./src/**/*.js")
// 	.pipe(eslint())
// 	.pipe(eslint.format())
// 	.pipe(eslint.failAfterError())
// );

gulp.task('build', ['clean'], function() {
	// Minify and copy all JavaScript
	// with sourcemaps all the way down
	return gulp.src("./src/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015'],
			compact: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('lib/'));
});

gulp.task('build-test', ['clean'], function() {
	// Minify and copy all JavaScript
	// with sourcemaps all the way down
	return gulp.src("./test/index.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('test-build/'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build','build-test']);