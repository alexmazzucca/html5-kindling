var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const imagemin = require("gulp-imagemin");
var sass = require("gulp-sass");
var modernizr = require('gulp-modernizr');
var autoprefixer = require('gulp-autoprefixer');

const paths = {
	scripts: {
		src: [
			"./node_modules/jquery/dist/jquery.js",
			"./src/js/jquery/*.js",
			"./src/js/vendor/*.js",
			"./src/js/main.js"
		],
		dest: "dist/js/"
	},
	styles: {
		src: "src/scss/*.scss",
		dest: "dist/css/"
	},
	dom: {
		src: "src/**/*.html",
		dest: "dist/"
	},
	images: {
		src: "src/img",
		dest: "dist/"
	}
};

// Wipes out the 'dist' dir

const clean = () => del(["dist"]);

// Creates modernizr w/ 'touchevents' test in src/js

function modernizr(){
	return gulp
		.task('modernizr', function() {
			return gulp
				.src('./js/*.js')
		  		.pipe(modernizr({
					tests: ['touchevents']
				  }))
		  		.pipe(gulp.dest('src/js/vendor/modernizr-custom.js'))
		});
}

// combines and uglifies all of the JS mentioned in scripts

function scripts() {
	return gulp
		.src(paths.scripts.src, { sourcemaps: true })
		.pipe(uglify())
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest(paths.scripts.dest));
}

// Minifies the HTML

function dom() {
	return gulp
		.src(paths.dom.src, { sourcemaps: true })
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true
			})
		)
		.pipe(gulp.dest(paths.dom.dest));
}

//Combines and compresses all of the CSS files in src/scss, adds autoprefixr

function styles() {
	return gulp
		.src(paths.styles.src, { sourcemaps: true })
		.pipe(sass(
			{
				outputStyle: "compressed"
			}
		))
		.on('error', sass.logError)
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(concat('main.min.css'))
		.pipe(gulp.dest(paths.styles.dest));
}

function images(){
	return gulp
		.src("src/img/*")
		.pipe(imagemin())
		.pipe(gulp.dest("dist/img"))
}

const server = browserSync.stream();

function reload(done) {
	browserSync.reload();
	done();
}

function serve(done) {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	done();
}

function watch(){
	gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
	gulp.watch(paths.styles.src, gulp.series(styles, reload));
	gulp.watch(paths.dom.src, gulp.series(dom, reload));
	gulp.watch(paths.images.src, gulp.series(images, reload));
}

const dev = gulp.series(clean, scripts, serve, dom, styles, images, watch);

gulp.task('default', dev);