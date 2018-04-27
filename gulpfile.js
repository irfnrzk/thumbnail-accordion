// START Editing Project Variables.
// Project related.
var project                 = 'testbench'; // Project Name.
var projectURL              = 'localhost:8080'; // Project URL. Could be something like localhost:8888.
var productURL              = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Style related.
var styleSRC                = './public/assets/sass/*.scss'; // Path to main .scss file.
var styleDestination        = './public/assets'; // Path to place the compiled CSS file.

// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];


var gulp = require('gulp');
var sass = require('gulp-sass');

var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.

var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter       = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var notify       = require('gulp-notify'); // Sends message notification to you
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var connect      = require('gulp-connect');

//var nodemon      = require('gulp-nodemon');

// gulp.task('browser-sync', ['nodemon'], function() {
//     browserSync.init(null, {
//         proxy: "http://localhost:3000", // port of node server
//         port: 8000
//     });
// });


// gulp.task('nodemon', function (cb) {
//     var callbackCalled = false;
//     return nodemon({script: 'server.js'}).on('start', function () {
//         if (!callbackCalled) {
//             callbackCalled = true;
//             cb();
//         }
//     });
// });

gulp.task('connect', function() {
  connect.server({
    root: './public',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./public/*.html')
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());
});


 gulp.task('styles', function () {
    gulp.src( styleSRC )
    .pipe( sass( {
      errLogToConsole: true,
      outputStyle: 'compressed',
      precision: 10
    } ) )
    .on('error', console.error.bind(console))
    .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

    .pipe( lineec() ) 
    .pipe( gulp.dest( styleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files

    .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( minifycss( {
      maxLineLen: 10
    }))

    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( styleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
    .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
 });

gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // For more options
    // @link http://www.browsersync.io/docs/options/

    // Project URL.
    proxy: projectURL,

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: true,

    // Inject CSS changes.
    // Commnet it to reload browser for every CSS change.
    injectChanges: true,

    // Use a specific port (instead of the one auto-detected by Browsersync).
    port: 8887,

  } );
});


gulp.task('watch', function(){
	gulp.watch('./public/assets/sass/*.scss', ['styles']);
});

gulp.task('default', ['connect','styles', 'watch', 'browser-sync']);
