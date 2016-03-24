"use strict";
/* global require */
const fs = require('fs');
const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
// const ignore = require('gulp-ignore');
const sourcemaps = require('gulp-sourcemaps');
// const eslint = require('gulp-eslint');

gulp.task('clean', (cb) =>
	// You can use multiple globbing patterns as you would with `gulp.src`
	del(['build', 'test/build'], cb)
);

// gulp.task('lint', ()=>
// 	gulp.src("./src/**/*.js")
// 	.pipe(eslint())
// 	.pipe(eslint.format())
// 	.pipe(eslint.failAfterError())
// );

gulp.task('build', ['clean'], () =>
	// Minify and copy all JavaScript
	// with sourcemaps all the way down
	gulp.src("./src/**/*.js")
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015'],
		compact: false
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('lib/'))
);

gulp.task('build-test', ['clean'], () =>
	// Minify and copy all JavaScript
	// with sourcemaps all the way down
	gulp.src("./test/index.js")
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('test-build/'))
);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build','build-test']);