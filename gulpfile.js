var gulp = require('gulp');

var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['lint'], function () {
    return gulp
        .src('test/**/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['test']);