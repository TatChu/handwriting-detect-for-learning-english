/*Tasks build js,css*/
var gulp = require('gulp'),
gulpsync = require('gulp-sync')(gulp),
rename = require("gulp-rename"),
notify = require('gulp-notify'),
useref = require('gulp-useref'),
gulpif = require('gulp-if'),
uglify = require('gulp-uglify'),
babel = require('gulp-babel'),
minifyCss = require('gulp-csso'),
ngAnnotate = require('gulp-ng-annotate'),
mainBowerFiles = require('main-bower-files'),
gulpLoadPlugins = require('gulp-load-plugins'),
concat = require('gulp-concat'),
$ = gulpLoadPlugins();

/**************************************************
SITE
**************************************************/
gulp.task('site-minfile', gulpsync.sync([
	/*sync*/ 
	'site-concat-lib',
	[
	/*async */
	'site-min-css-vendor',
	'site-min-css-main',
	'site-min-js-vendor',
	'site-min-js-main',
	'site-min-js-fix'
	],
	'site-concat-minfile',
	]));


/*Concat file trong folder dist css, js*/
gulp.task('site-concat-minfile', () => {
	/*gộp file CSS*/
	gulp.src(['./public/dist/site/styles/vendor.min.css', './public/dist/site/styles/main.min.css'])
	.pipe(notify('Start concat full.css CSS......'))
	.pipe(concat('full.min.css'))
	.pipe(gulp.dest('./public/dist/site/styles/'));

	/*gộp file JS*/
	gulp.src(['./public/dist/site/scripts/vendor.min.js', './public/dist/site/scripts/main.min.js', './public/dist/site/scripts/fix.js'])
	.pipe(notify('Start concat full.js JS......'))
	.pipe(concat('full.min.js'))
	.pipe(gulp.dest('./public/dist/site/scripts/'));
});

/*Min file css (vendor.min.css)*/
gulp.task('site-min-css-vendor', () => {
	return gulp.src('public/build/site/vendor.min.css')
	.pipe(notify('Start min vendor Site CSS......'))
	.pipe(minifyCss())
	.pipe(gulp.dest('public/dist/site/styles'));
});

/*Min file css (main.min.css)*/
gulp.task('site-min-css-main', () => {
	return gulp.src('public/build/site/main.min.css')
	.pipe(minifyCss())
	.pipe(gulp.dest('public/dist/site/styles'))
	.pipe(notify('Start min main Site CSS......'));
});

/*Min file js (vendor.min.js)*/
gulp.task('site-min-js-vendor', () => {
	return gulp.src('public/build/site/vendor.min.js')
	.pipe(notify('Start min vendor site JS......'))
	.pipe(ngAnnotate())
	.pipe(gulpif('*.js', uglify({ compress: true })))
	.pipe(gulp.dest('public/dist/site/scripts'));
});

/*Min file js (main.min.js)*/
gulp.task('site-min-js-main', () => {
	return gulp.src('public/build/site/main.min.js')
	.pipe(babel({ compact: false, presets: ['es2015'] }))
	.pipe(ngAnnotate())
	.pipe(gulpif('*.js', uglify({ compress: true })))
	.pipe(gulp.dest('public/dist/site/scripts'))
	.pipe(notify('Start min main JS......'));
});

/*Min file js (fix.js)*/
gulp.task('site-min-js-fix', () => {
	return gulp.src('public/assets/frontend/fix.js')
	.pipe(babel({ compact: false, presets: ['es2015'] }))
	.pipe(ngAnnotate())
	.pipe(gulpif('*.js', uglify({ compress: true })))
	.pipe(gulp.dest('public/dist/site/scripts'))
	.pipe(notify('Start min fix JS......'));
});

/*Gộp file*/
gulp.task('site-useref', ['clean-site', 'site-injectJS', 'site-injectCSS'], () => {

	gulp.src([
		'public/tmp/site/styles/main.css',
		])
	.pipe(rename('main.min.css'))
	.pipe(gulp.dest('public/build/site'));

	return gulp.src(['app/views/layouts/web/**/script.html','app/views/layouts/web/**/script_manual.html', 'app/views/layouts/web/**/style.html'])
	.pipe(useref({ 
		searchPath: ['public', 'app'],
		transformPath: function(filePath) {
			var newPath =  filePath.replace('{{settings.services.webUrl}}','');
			// newPath =  newPath.replace('}}','');
			return newPath;
		}
	}))
	.pipe(gulpif('/\.js$/', uglify()))
	.pipe(gulpif('/\.css$/b', minifyCss()))
	.pipe(gulp.dest('public/build/site'));
});

/*Gộp file vendor và lib manual*/
gulp.task('site-concat-lib',['site-useref'], () => {
	return gulp.src(['./public/build/site/vendor.min.js', './public/build/site/lib.min.js'])
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest('./public/build/site/'));
});



/**************************************************
ADMIN
**************************************************/

gulp.task('admin-minfile', gulpsync.sync([
	/*sync*/ 
	'admin-concat-lib',
	[
	/*async */
	'admin-min-css-vendor',
	'admin-min-css-main',
	'admin-min-js-vendor',
	'admin-min-js-main',
	/*copy font và image*/
	'admin-fonts',
	'img-adminlte'
	],
	'admin-concat-minfile',
	]));

/*Concat file trong folder dist css, js*/
gulp.task('admin-concat-minfile', () => {
	/*gộp file CSS*/
	gulp.src(['./public/dist/admin/styles/vendor.min.css', './public/dist/admin/styles/main.min.css'])
	.pipe(notify('Start concat full.css CSS......'))
	.pipe(concat('full.min.css'))
	.pipe(gulp.dest('./public/dist/admin/styles/'));

	/*gộp file JS*/
	gulp.src(['./public/dist/admin/scripts/vendor.min.js', './public/dist/admin/scripts/main.min.js', './public/dist/admin/scripts/fix.js'])
	.pipe(notify('Start concat full.js JS......'))
	.pipe(concat('full.min.js'))
	.pipe(gulp.dest('./public/dist/admin/scripts/'));
});

/*Min file css (vendor.min.css)*/
gulp.task('admin-min-css-vendor', () => {
	return gulp.src('public/build/admin/vendor.min.css')
	.pipe(notify('Start min vendor Admin CSS......'))
	.pipe(minifyCss())
	.pipe(gulp.dest('public/dist/admin/styles'));
});

/*Min file css (main.min.css)*/
gulp.task('admin-min-css-main', () => {
	return gulp.src('public/build/admin/main.min.css')
	.pipe(minifyCss())
	.pipe(gulp.dest('public/dist/admin/styles'))
	.pipe(notify('End min main Admin CSS......'));
});

/*Min file js (vendor.min.js)*/
gulp.task('admin-min-js-vendor', () => {
	return gulp.src('public/build/admin/vendor.min.js')
	.pipe(notify('Start min vendor Admin JS......'))
	.pipe(ngAnnotate())
	.pipe(gulpif('*.js', uglify({ compress: true })))
	.pipe(gulp.dest('public/dist/admin/scripts'));
});

/*Min file js (main.min.js)*/
gulp.task('admin-min-js-main', () => {
	return gulp.src('public/build/admin/main.min.js')
	.pipe(babel({ compact: false, presets: ['es2015'] }))
	.pipe(ngAnnotate())
	.pipe(gulpif('*.js', uglify({ compress: true })))
	.pipe(gulp.dest('public/dist/admin/scripts'))
	.pipe(notify('End min main Admin JS......'));
});

/*Add font bootstrap*/
gulp.task('admin-fonts', function () {
	return gulp.src(mainBowerFiles({
		paths: {
			bowerDirectory: './public/assets/admin/bower_components',
			bowerrc: './public/assets/admin/.bowerrc',
			bowerJson: './public/assets/admin/bower.json'
		}
	}))
	.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
	.pipe($.flatten())
	.pipe(gulp.dest('public/dist/admin/fonts/'));
});

/*Add image plugin AdminLte*/
gulp.task('img-adminlte', function () {
	return gulp.src([
		'public/assets/admin/bower_components/AdminLTE/plugins/iCheck/square/green.png',
		'public/assets/admin/bower_components/AdminLTE/plugins/iCheck/square/green@2x.png',
		'public/assets/admin/bower_components/AdminLTE/plugins/iCheck/square/blue.png',
		'public/assets/admin/bower_components/AdminLTE/plugins/iCheck/square/blue@2x.png',
		
		'public/assets/admin/bower_components/select2/select2.png',
		]).pipe(gulp.dest('public/dist/admin/styles/'));
});

/*Gộp file vendor và lib manual*/
gulp.task('admin-concat-lib',['admin-useref'], () => {
	return gulp.src(['./public/build/admin/vendor.min.js', './public/build/admin/lib.min.js'])
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest('./public/build/admin/'));
});

/*Gộp file*/
gulp.task('admin-useref', ['clean-admin', 'admin-injectJS', 'admin-injectCSS'], () => {

	gulp.src([
		'public/tmp/admin/styles/main.css',
		])
	.pipe(rename('main.min.css'))
	.pipe(gulp.dest('public/build/admin'));

	return gulp.src(['app/views/layouts/admin/**/script.html','app/views/layouts/admin/**/script_manual.html', 'app/views/layouts/admin/**/style.html'])
	.pipe(useref({ 
		searchPath: ['public','public/assets', 'app'],
		transformPath: function(filePath) {
			var newPath =  filePath.replace('{{settings.services.admin}}','');
			return newPath;
		}
	}))
	.pipe(gulpif('/\.js$/', uglify()))
	.pipe(gulpif('/\.css$/b', minifyCss()))
	.pipe(gulp.dest('public/build/admin'));
});
