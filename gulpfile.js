'use strict';

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	ts = require('gulp-typescript'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps');


var CONFIGURATION = {
	sourceDirectory: __dirname+'/src',
	sourceDirectoryAssets: __dirname+'/src/assets',
	deploymentDirectoryBase: __dirname+'/dist',
	deploymentDirectory: __dirname+'/dist/app',
	deploymentDirectoryAssets: __dirname+'/dist/app/assets'
};
var STATIC_FILES = [ 'js', 'html', 'png', 'jpg', 'svg', 'css' ].map(
	(format) => CONFIGURATION.sourceDirectory+'/**/*.'+format
);


gulp.task('typescript', function() {
	return gulp.src([CONFIGURATION.sourceDirectory+'/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(ts({module: 'commonjs'})).js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(CONFIGURATION.deploymentDirectory));
});

gulp.task('sass', function () {
	return gulp.src(CONFIGURATION.sourceDirectoryAssets+'/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(CONFIGURATION.deploymentDirectoryAssets));
});

gulp.task('watch', function() {
	gulp.watch(CONFIGURATION.sourceDirectory+'/**/*.ts', ['typescript']);
	gulp.watch(CONFIGURATION.sourceDirectoryAssets+'/**/*.scss', ['sass']);
	gulp.watch(STATIC_FILES, ['deploy static']);
});

gulp.task('serve', ['typescript', 'sass', 'deploy static', 'watch'], function () {
	nodemon({
		script: CONFIGURATION.deploymentDirectory+'/index.js',
		ext: 'js html'
	})
});

gulp.task('deploy static', [], function() {
	return gulp.src(STATIC_FILES, {
			base: CONFIGURATION.sourceDirectory
		})
		.pipe(gulp.dest(CONFIGURATION.deploymentDirectory));
});

gulp.task('default', ['serve']);