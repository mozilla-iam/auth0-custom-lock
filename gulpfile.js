'use strict';

/* -----------------------------------
   Tools
   ------------------------------------ */

const browserify = require( 'browserify' ); // lets us modules in JS, combines all our JS into one file
const browserSync = require( 'browser-sync' ).create(); // starts a dev server and adds autoreloading behaviour to dev page
const del = require( 'del' ); // deletes files, so that we can clean up before generating a new `dist`
const eslint = require( 'gulp-eslint' ); // lints our JavaScript
const gulp = require( 'gulp' ); // runs tasks
const sass = require( 'gulp-sass' ); // builds Sass (.scss) into CSS
const source = require( 'vinyl-source-stream' ); // lets us use Browserify within Gulp
const mustache = require( 'gulp-mustache' ); // replace variables
const fs = require( 'fs' );
const buffer = require( 'vinyl-buffer' );
const uglify = require( 'gulp-uglify' );
const sourcemaps = require( 'gulp-sourcemaps' );
const log = require( 'gulplog' );

/* -----------------------------------
   Other constants
   ------------------------------------ */
const paths = {
  html : 'src/html',
  styles : 'src/scss',
  scripts : 'src/js',
  fonts: 'src/fonts',
  images: 'src/images',
  drop : 'dist'
};

let environment = process.env.NODE_ENV || 'development';

const configFile = JSON.parse( fs.readFileSync( 'config/' + environment + '.json', 'utf8' ) );
const packageJSON = JSON.parse( fs.readFileSync( 'package.json', 'utf8' ) );
const config = Object.assign( configFile, packageJSON );

// if we're running in github actions, the SHA is available as an environmental variable
config.revision = process.env.GITHUB_SHA || require( 'child_process' ).execSync( 'git rev-parse HEAD' ).toString().trim();

// get the date of the build to include in HTML comments
config.build_date = new Date().toISOString().substr( 0, 16 );

// set the full url to the cdn
config['cdn'] = environment === 'local' ? `http://${config.cdn_domain}` : `https://${config.cdn_domain}/nlx/${config.revision}`;

console.log( config );

console.log( 'Environment “' + environment + '” identified.  Building NLX with ' + environment + ' config:' );
console.log( '---------------------------Begin configuration.---------------------------' );
console.log( config );
console.log( '---------------------------End configuration.---------------------------' );

/* -----------------------------------
   Tasks
   ------------------------------------ */

gulp.task( 'browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task( 'process-html', function() {

  return gulp.src( paths.html + '/*.html' )
    .pipe( mustache( config ) )
    .pipe( gulp.dest( paths.drop ) )
    .pipe( browserSync.reload({ stream: true }) );
});

gulp.task( 'lint', function() {
  return gulp.src([paths.scripts + '/**/*.js'])
    .pipe( eslint({ 'configFile': './.eslintrc.yml' }) )
    .pipe( eslint.format() );
});

gulp.task( 'lint:watch', function() {
  gulp.watch([paths.scripts + '/**/*.js'], gulp.series( 'lint' ) );
});

// SCSS -> CSS
gulp.task( 'css:process', function() {
  const logger = console;

  return gulp.src( paths.styles + '/**/*.scss' )
    .pipe( sass() )
    .on( 'error', function( err ) {
      logger.error( err.message );
      this.emit( 'end' );
    })
    .pipe( gulp.dest( paths.drop + '/css' ) );
});

gulp.task( 'css:clean', function() {
  return del([paths.drop + '/css']);
});

gulp.task( 'css:watch', function() {
  gulp.watch([paths.styles + '/**/*.scss'], gulp.series( 'css', 'process-html' ) );
});

gulp.task( 'css', gulp.series( 'css:clean', 'css:process' ) );

// Fonts
gulp.task( 'fonts:copy', function() {
  return gulp.src( paths.fonts + '/**/*' )
    .pipe( gulp.dest( paths.drop + '/fonts' ) );
});

gulp.task( 'fonts:clean', function( done ) {
  return del([paths.drop + '/fonts'], done );
});

gulp.task( 'fonts', gulp.series( 'fonts:clean', 'fonts:copy' ) );

gulp.task( 'fonts:watch', function() {
  gulp.watch( paths.fonts + '/**/*', gulp.parallel( 'fonts' ) );
});

// Images
gulp.task( 'images:copy', function() {
  return gulp.src( paths.images + '/**/*' )
    .pipe( gulp.dest( paths.drop + '/images' ) );
});

gulp.task( 'images:clean', function( done ) {
  return del([paths.drop + '/images'], done );
});

gulp.task( 'images', gulp.series( 'images:clean', 'images:copy' ) );

gulp.task( 'images:watch', function() {
  gulp.watch( paths.fonts + '/**/*', gulp.parallel( 'images' ) );
});


// JS

gulp.task( 'js:clean', function( done ) {
  return del([paths.drop + '/js'], done );
});

gulp.task( 'js:browserify', function() {
  return browserify( paths.scripts + '/main.js', {
    // paths in which to look for modules
    'paths' : [
      paths.scripts
    ]
  })
    .bundle()
    .pipe( source( 'main.js' ) )
    .pipe ( buffer() )
    .pipe( sourcemaps.init({ loadMaps: true }) )
    .pipe( uglify() )
    .on( 'error', log.error )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( paths.drop + '/js' ) );
});

gulp.task( 'js', gulp.series( 'js:clean', 'js:browserify' ) );

gulp.task( 'js:watch', function() {
  gulp.watch( paths.scripts + '/**/*.js', gulp.series( 'js', 'process-html' ) );
});

gulp.task( 'html:watch', function() {
  gulp.watch( paths.html + '/*.html', gulp.series( 'process-html' ) );
});


/* -----------------------------------
   Combined tasks
   ------------------------------------ */

gulp.task( 'default', gulp.series( gulp.parallel( 'css', 'fonts', 'images', 'js' ), ['process-html']) );
gulp.task( 'watch', gulp.series( gulp.parallel( 'lint:watch', 'css:watch', 'fonts:watch', 'images:watch', 'js:watch', 'html:watch' ) ) );
gulp.task( 'clean', gulp.parallel( 'css:clean', 'fonts:clean', 'images:clean', 'js:clean' ) );
gulp.task( 'dev', gulp.parallel( gulp.series( 'default', 'browserSync' ), 'watch' ) );
gulp.task( 'build', gulp.parallel( gulp.series( 'default' ) ) );
