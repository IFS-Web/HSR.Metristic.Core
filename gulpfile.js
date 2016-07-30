var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	ts = require('gulp-typescript'),
	livereload = require('gulp-livereload');

gulp.task('typescript', function() {
	console.log('Compiling typescript');
	return gulp.src(['server/**/*.ts'])
		.pipe(ts({module: 'commonjs'})).js.pipe(gulp.dest('./deploy/server'))
});

gulp.task('watch', function() {
	gulp.watch('./server/**/*.ts', ['typescript']);
});

gulp.task('serve', ['typescript'], function () {
	livereload.listen();
	nodemon({
		script: 'deploy/server/index.js',
		ext: 'js',
	}).on('restart', function () {
		setTimeout(function () {
			livereload.changed();
		}, 500);
	});
});

gulp.task('deploy', ['build'], function() {
	return gulp.src(['package.json'])
		.pipe(gulp.dest('./deploy'));
});

gulp.task('default', ['deploy']);