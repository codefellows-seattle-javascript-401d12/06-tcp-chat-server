'use strict';

const gulp = require('gulp');
const linter = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('test', function() {
  gulp.src('./test/*-test.js', {read: false}).pipe(mocha({reporter: 'spec'}));
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(linter())
  .pipe(linter.format())
  .pipe(linter.failAfterError());
});

gulp.task('dev', function() {
  gulp.watch(['**/*.js', '!node_modules/**'], ['lint', 'test']);
});

gulp.task('default', ['dev']);
