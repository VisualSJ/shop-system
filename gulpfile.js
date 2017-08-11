'use strict';

var gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),
    less = require('gulp-less');
 
gulp.task('less', function () {
    //编译src目录下的所有less文件
    //除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
    gulp.src(['src/less/**/*.less', '!src/less/**/_*.less']) 
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('static/style'));
});