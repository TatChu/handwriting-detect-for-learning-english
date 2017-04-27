/*Tasks về css*/
const gulp = require('gulp');
const inject = require('gulp-inject'),
gulpLoadPlugins = require('gulp-load-plugins'),
browserSync = require('browser-sync'),
wiredep = require('wiredep').stream,
    // livereload  = require('gulp-livereload'),

    $ = gulpLoadPlugins(),
    reload = browserSync.reload;

/**************************************************
SITE
**************************************************/

/*Inject link module scss vào file main.scss, inject bower*/
gulp.task('site-injectCSS', ['site-styles'], () => {
    /*inject bower css*/
    return gulp.src('app/views/layouts/web/**/link/style.html')
    .pipe(wiredep({
        directory: './public/assets/site/bower_components', 
        bowerJson: require('../public/assets/site/bower.json'), 
        ignorePath: '../../../../../../public/',
        fileTypes: {
          html: {
            block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"]([^'"]+)/gi,
              css: /<link.*href=['"]([^'"]+)/gi
          },
          replace: {
              js: '<script src="{{settings.services.webUrl}}/{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="{{settings.services.webUrl}}/{{filePath}}" />'
          }
      }
  }
}))
    .pipe(inject(gulp.src(['public/tmp/site/styles/main.css'], {read: false}), {
        name: 'Main',
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
            var newPath = filePath.replace('public/', '');
            return '<link rel="stylesheet" href="' + newPath + '">';
        }
    })).pipe(gulp.dest('app/views/layouts/web'));
});

/*Build scss sang css vào file main.css*/
gulp.task('site-styles', ['site-injectSCSS'], () => {
    return gulp.src('public/assets/site/styles/main.scss').pipe($.sass.sync({outputStyle: 'expanded', precision: 10, includePaths: ['.']}).on('error', $.sass.logError)).pipe($.autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    })).pipe(gulp.dest('public/tmp/site/styles'));
});

/*Inject link module scss vào file main.scss*/
gulp.task('site-injectSCSS', () => {
    /*inject Module scss*/
    var sources = gulp.src(['./app/modules/web-*/view/client/**/*.scss']);
    var target = gulp.src('public/assets/site/styles/main.scss');

    return target.pipe(inject(sources, {
        starttag: '/*inject-module:{{ext}}*/',
        endtag: '/*endinject*/',
        transform: function(filepath) {
            return '@import "' + '../../../..' + filepath + '";';
        }
    })).pipe(gulp.dest('./public/assets/site/styles/'));
});

/**************************************************
ADMIN
**************************************************/

/*Inject link module scss vào file main.scss, inject bower*/
gulp.task('admin-injectCSS', ['admin-styles'], () => {
    /*inject bower css*/
    return gulp.src('app/views/layouts/admin/**/link/style.html').pipe(wiredep({directory: './public/assets/admin/bower_components', bowerJson: require('../public/assets/admin/bower.json'), ignorePath: '../../../../../public/'})).pipe(inject(gulp.src(['public/tmp/admin/styles/main.css'], {read: false}), {
        name: 'Main',
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
            var newPath = filePath.replace('public/', '');
            return '<link rel="stylesheet" href="' + newPath + '">';
        }
    })).pipe(gulp.dest('app/views/layouts/admin'));
});

/*Build scss sang css vào file main.css*/
gulp.task('admin-styles', ['admin-injectSCSS'], () => {
    return gulp.src('public/assets/admin/styles/main.scss').pipe($.sass.sync({outputStyle: 'expanded', precision: 10, includePaths: ['.']}).on('error', $.sass.logError)).pipe($.autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    })).pipe(gulp.dest('public/tmp/admin/styles'));
    // .pipe(reload({stream: true}));
});

/*Inject link module scss vào file main.scss*/
gulp.task('admin-injectSCSS', () => {
    /*inject Module scss*/
    var sources = gulp.src(['./app/modules/admin-*/view/client/**/*.scss']);
    var target = gulp.src('public/assets/admin/styles/main.scss');

    return target.pipe(inject(sources, {
        starttag: '/*inject-module:{{ext}}*/',
        endtag: '/*endinject*/',
        transform: function(filepath) {
            return '@import "' + '../../../..' + filepath + '";';
        }
    })).pipe(gulp.dest('./public/assets/admin/styles/'));
});
