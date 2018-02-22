'use strict';

/* -----------------------------------
   Tools
   ------------------------------------ */

const browserify = require( 'browserify' ); // lets us modules in JS, combines all our JS into one file
const browserSync = require( 'browser-sync' ).create(); // starts a dev server and adds autoreloading behaviour to dev page
const del = require( 'del' ); // deletes files, so that we can clean up before generating a new `dist`
const eslint = require( 'gulp-eslint' ); // lints our JavaScript
const gulp = require( 'gulp' ); // runs tasks
const inlinesource = require('gulp-inline-source'); // automatically inlines CSS, JS and images
const sass = require( 'gulp-sass' ); // builds Sass (.scss) into CSS
const source = require( 'vinyl-source-stream' ); // lets us use Browserify within Gulp
const mustache = require("gulp-mustache"); // replace variables

/* -----------------------------------
   Other constants
   ------------------------------------ */
const paths = {
  html : 'src/html',
  styles : 'src/scss',
  scripts : 'src/js',
  drop : 'dist'
};

const config = {
  'local': {
    'lock' : {
      'auth0_domain' : 'https://auth-dev.mozilla.auth0.com',
      'LDAP_connection_name' : 'Mozilla-LDAP-Dev',
      'person_api_domain' : 'https://person-api.mozilla.com/connection',
      'GTM_ID': 'GTM-T2N2BRW',
      'client_id': 'CIynn5wTPyYZQcA1FJx1Io9z4t7QWDaE'
    }
  },
  'production': {
    'lock' : {
      'auth0_domain' : 'https://auth.mozilla.auth0.com',
      'LDAP_connection_name' : 'Mozilla-LDAP',
      'person_api_domain' : 'https://person-api.allizom.org/connection',
      'GTM_ID': 'GTM-T2N2BRW'
    }
  }
};


/* -----------------------------------
   Tasks
   ------------------------------------ */

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task( 'process-html', function() {
  var options = {
    inlineSource: {
      compress: false,
      pretty: true
    }
  };

  return gulp.src( paths.html + '/*.html' )
    .pipe( inlinesource( options.inlineSource ) )
    .pipe( mustache( config.local ) )
    .pipe( gulp.dest( paths.drop ) )
    .pipe( browserSync.reload( { stream: true } ));
});

gulp.task( 'lint', function() {
  return gulp.src([paths.scripts + '/**/*.js'])
    .pipe( eslint( { 'configFile': './.eslintrc.yml' } ) )
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
  return del( [ paths.drop + '/css'] );
});

gulp.task( 'css:watch', function() {
  gulp.watch( [ paths.styles + '/**/*.scss' ], gulp.series( 'css', 'process-html' ) );
});

gulp.task( 'css', gulp.series( 'css:clean', 'css:process' ) );

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
    .pipe( source('main.js') )
    .pipe( gulp.dest( paths.drop + '/js' ) );
});

gulp.task( 'js', gulp.series( 'js:clean', 'js:browserify' ) );

gulp.task( 'js:watch', function() {
  gulp.watch( paths.scripts + '/**/*.js', gulp.series( 'js', 'process-html' ) );
});

gulp.task( 'html:watch', function() {
  gulp.watch( paths.html + '/*.html', gulp.series( 'process-html' ) );
})


/* -----------------------------------
   Combined tasks
   ------------------------------------ */

gulp.task( 'default', gulp.series( gulp.parallel( 'css', 'js' ), [ 'process-html' ] ) );
gulp.task( 'watch', gulp.series( gulp.parallel( 'lint:watch', 'css:watch', 'js:watch', 'html:watch' ) ) );
gulp.task( 'clean', gulp.parallel( 'css:clean', 'js:clean' ) );
gulp.task( 'dev', gulp.parallel( gulp.series( 'default', 'browserSync' ), 'watch' ) );
gulp.task( 'build', gulp.parallel( gulp.series( 'default' ) ) );
