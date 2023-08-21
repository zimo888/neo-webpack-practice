const gulp = require('gulp');
const path = require('path');
//转换Sass文件
const sass = require('gulp-sass')(require('sass'));
//转换less文件
const less = require('gulp-less');
//替换源码中的sass| less路径
const replace = require('gulp-replace');
//编译前删除旧版本构建物
const rimraf = require('rimraf');

