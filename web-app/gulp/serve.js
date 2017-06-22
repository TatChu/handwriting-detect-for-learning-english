var gulp = require('gulp');
gulp.task('admin-serve',['admin-injectJS', 'admin-injectCSS']);
gulp.task('site-serve',['site-injectJS', 'site-injectCSS']);