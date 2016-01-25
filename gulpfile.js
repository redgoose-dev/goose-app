var log = function(o) { console.log(o); }

// load modules
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var scss = require('gulp-sass');
var rename = require('gulp-rename');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


// set vendor files
var vendors = [
	'./node_modules/jquery/dist/jquery.min.js',
	'./node_modules/masonry-layout/dist/masonry.pkgd.min.js',
	'./node_modules/imagesloaded/imagesloaded.pkgd.min.js',
	'./node_modules/fastclick/lib/fastclick.min.js',
	'./src/vendor/CSS3/CSS3.min.js'
];
// set directory
var dist = './dist';
var maps = 'maps';


// build vendor files
gulp.task('vendor', function(){
	gulp.src(vendors)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(concat('vendor.pkgd.js', { newLine: '\n\n' }))
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist + '/js'));
});


// build scss
gulp.task('scss', function(){
	gulp.src('./src/scss/layout.scss')
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(rename({ suffix: '.pkgd' }))
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist + '/css'));
});
gulp.task('scss:watch', function(){
	gulp.watch('./src/scss/*.scss', ['scss']);
});


// build javascript
gulp.task('js', function(){
	browserify('./src/js/App.js', { debug: true })
		.transform(babelify, { presets : ['es2015'] })
		.bundle()
		.pipe(source('app.pkgd.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist + '/js'));
});
gulp.task('js:watch', function(){
	gulp.watch('./src/js/*.js', ['js']);
});