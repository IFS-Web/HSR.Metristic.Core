'use strict';

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	ts = require('gulp-typescript'),
	livereload = require('gulp-livereload'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps');


var CONFIGURATION = {
	sourceDirectory: __dirname+'/src',
	sourceDirectoryAssets: __dirname+'/src/assets',
	deploymentDirectoryBase: __dirname+'/dist',
	deploymentDirectory: __dirname+'/dist/app',
	deploymentDirectoryAssets: __dirname+'/dist/app/assets'
};


gulp.task('typescript', function() {
	console.log('Compiling typescript');

	return gulp.src([CONFIGURATION.sourceDirectory+'/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(ts({module: 'commonjs'})).js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(CONFIGURATION.deploymentDirectory));
});

gulp.task('sass', function () {
	console.log('Compiling sass');

	return gulp.src(CONFIGURATION.sourceDirectoryAssets+'/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(CONFIGURATION.deploymentDirectoryAssets));
});

gulp.task('watch', function() {
	console.log('Watching typescript and sass files');

	gulp.watch(CONFIGURATION.sourceDirectory+'/**/*.ts', ['typescript']);
	gulp.watch(CONFIGURATION.sourceDirectoryAssets+'/**/*.scss', ['sass']);
	gulp.watch([CONFIGURATION.sourceDirectoryAssets+'/images/*', CONFIGURATION.sourceDirectory+'/views/**/*'], ['deploy']);
});

gulp.task('serve', ['typescript', 'sass', 'deploy', 'watch'], function () {
	console.log('Serving app');

	nodemon({
		script: CONFIGURATION.deploymentDirectory+'/index.js',
		ext: 'js html'
	})
});

gulp.task('deploy', [], function() {
	console.log('Deloying assets and views');

	return gulp.src([
			CONFIGURATION.sourceDirectoryAssets+'/images/*',
			CONFIGURATION.sourceDirectory+'/views/**/*'
		],{
			base: CONFIGURATION.sourceDirectory
		})
		.pipe(gulp.dest(CONFIGURATION.deploymentDirectory));
});

gulp.task('default', ['serve']);