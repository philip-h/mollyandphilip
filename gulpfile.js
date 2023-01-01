/*global require*/
"use strict";

const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const prefix = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const pug = require('gulp-pug');
const urlBuilder = require('gulp-url-builder')
const imagemin = require('gulp-imagemin');

/*
 * Directories here
 */
var paths = {
  // Input Directories
  pug: './src/pages/*.pug',
  sass: './src/sass/*.sass',
  images: './src/imgs/**/*',
  icons: './src/icons/**/*',
  font: './src/font/*',
  js: './src/js/*',

  // Output Directories
  public: './public',
  css: './public/css',
  jsterse: './public/js',
  imgout: './public/imgs',
  iconsout: './public/icons',
  fontout: './public/font'
};

/**
 * Compile .pug files 
 */
function pugTask(cb) {
  src(paths.pug)
    .pipe(pug())
    .pipe(urlBuilder())
    .pipe(dest(paths.public));
  
  cb();
}

/** 
 * Compile Sass for Dev
*/
function sassTaskDev(cb){
  src(paths.sass, { sourcemaps: true })
      .pipe(sass())
      .pipe(postcss([cssnano()]))
      .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(dest(paths.css, { sourcemaps: '.' }));
  
  cb();
}

/** 
 * Compile Sass for Prod
*/
function sassTaskProd(cb){
  src(paths.sass, { sourcemaps: false })
      .pipe(sass())
      .pipe(postcss([cssnano()]))
      .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true
      }))
      .pipe(dest(paths.css));
  
  cb();
}

/** 
 * Move js for dev
*/
function jsTaskDev(cb){
  src(paths.js)
    .pipe(dest(paths.jsterse));

  cb();
}

/** 
 * Terse js for prod
*/
function jsTaskProd(cb){
  src(paths.js, { sourcemaps: false })
    .pipe(terser())
    .pipe(dest(paths.jsterse));
  cb();
}

/**
 * Move images for dev
 */
function moveImages(cb) {
  src(paths.images)
    .pipe(dest(paths.imgout));
  cb();
}

/**
 * Compress images for prod
 */
function compressImages(cb) {
  src('./src/imgs/**')
    .pipe(imagemin())
    .pipe(dest(paths.imgout));
  cb();
}

function moveIcons(cb) {
  src(paths.icons)
    .pipe(dest(paths.iconsout));
  cb();
}

function moveFonts(cb) {
  src(paths.font)
    .pipe(dest(paths.fontout));
  cb();
}

function moveFavicon(cb) {
  src('src/favicon.ico')
    .pipe(dest(paths.public));
  cb();
}

function movePwa(cb) {
  src('src/manifest.json')
    .pipe(dest(paths.public));
  cb();
}

function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: './public'
    }    
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  // Watch 
  watch(
      ['src/**/*.pug', 
       'src/**/*.sass', 
       'src/**/*.js'], 
      series(pugTask, sassTaskDev, jsTaskDev, browsersyncReload));
}

exports.build = series(
  compressImages,
  moveIcons,
  moveFonts,
  moveFavicon,
  movePwa,
  pugTask,
  sassTaskProd,
  jsTaskProd
)


// Default Gulp Task
exports.default = series(
  moveImages,
  moveIcons,
  moveFonts,
  moveFavicon,
  movePwa,
  pugTask,
  sassTaskDev,
  jsTaskDev,
  browsersyncServe,
  watchTask
);