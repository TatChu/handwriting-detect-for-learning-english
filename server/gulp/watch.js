/*Task Watch*/
var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	browserSync = require('browser-sync'),
	livereload = require('gulp-livereload');

$ = gulpLoadPlugins(),
	reload = browserSync.reload;
livereload = require('gulp-livereload');

gulp.task('watch', function () {
	 // Create LiveReload server
    livereload.listen();
	
	/*GENERAL*/
	gulp.watch('gulpfile.js', ['admin-serve', 'site-serve']).on('change', livereload.changed);
	gulp.watch([
		'app/modules/*/view/**/*.html'
	]).on('change', livereload.changed);

	/*SITE*/
	gulp.watch([
		'app/views/layouts/web/**/footer.html',
		'app/views/layouts/web/**/header.html',
		'public/assets/site/bower.json'
	], ['site-serve']);
	gulp.watch([
		'app/modules/web-*/view/**/*.js',
		'app/modules/web-*/view/**/*.html'
	], ['site-injectJS']).on('change', livereload.changed);
	gulp.watch('app/modules/web-*/view/**/*.scss', ['site-styles']).on('change', livereload.changed);

	/*ADMIN*/
	gulp.watch([
		'app/views/layouts/admin/**/footer.html',
		'app/views/layouts/admin/**/header.html',
		'public/assets/admin/bower.json'
	], ['admin-serve']);
	gulp.watch([
		'app/modules/admin-*/view/**/*.js',
		'app/modules/admin-*/view/**/*.html'
	], ['admin-injectJS']).on('change', livereload.changed);
	gulp.watch('app/modules/admin-*/view/**/*.scss', ['admin-styles']).on('change', livereload.changed);
});
