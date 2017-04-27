/*Tasks start server*/
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    livereload  = require('gulp-livereload');

gulp.task('start', function () {
    // Create LiveReload server
    // livereload.listen();

    // Start nodemon
    nodemon({
        script: 'app.js',
        tasks: ['admin-serve', 'site-serve'],
        ext: 'js html json',
        delay: 5,
        ignore: [
            'public/**',
            'var/',
            'node_modules/**',
            'app/modules/*/view/client/**/*.js',
            // 'app/modules/*/view/client/**/*.html'
            'app/views/**/footer.html',
            'app/views/**/header.html',
            'app/views/**/link/script.html',
            'app/views/**/link/style.html'
        ],
        stdout:   true,
        readable: false,
        env: {'NODE_ENV': 'development'}
    })
    // .on('start', ['watch'])
});
