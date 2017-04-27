// generated on 2016-07-13 using generator-webapp 2.1.0
const dir = require('require-dir')('./gulp');

const gulp = require('gulp');
const del = require('del');

gulp.task('clean-admin', del.bind(null, ['tmp/admin', 'public/build/admin', 'public/dist/admin']));
gulp.task('clean-site', del.bind(null, ['tmp/site', 'public/build/site', 'public/dist/site']));

gulp.task('serve', [
    'admin-serve', 'site-serve'
], () => {
    gulp.start('start');
    gulp.start('watch');
});

gulp.task('build-admin', ['admin-minfile'], () => {});
gulp.task('build-site', ['site-minfile'], () => {});
gulp.task('build', ['site-minfile', 'admin-minfile'], () => {});

gulp.task('default', () => {
    gulp.start('serve');
});
