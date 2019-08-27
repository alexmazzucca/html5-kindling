/*
* >>========================================>
* Required
* >>========================================>
*/

var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require('gulp-sourcemaps');
var prettyHtml = require('gulp-pretty-html');
var inlineCss = require('gulp-inline-css');
var inlineImagePath = require('gulp-inline-image-path');

const htmlmin = require("gulp-htmlmin");
const del = require("del");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require('imagemin-mozjpeg');

const paths = {
	scripts: {
		src: [
			"./node_modules/jquery/dist/jquery.js",
			"./node_modules/gsap/src/uncompressed/TweenMax.js",
			"./src/js/vendor/*.js",
			"./src/js/main.js"
		],
		dest: "./dist/js/"
	},
	styles: {
		src: "./src/scss/*.scss",
		dest: "./dist/css/"
	},
	dom: {
		src: [
			"./src/**/*.html",
			"./src/**/*.php"
		],
		dest: "./dist/"
	},
	images: {
		src: "./src/img/*",
		dest: "./dist/img/"
	}
};

/*
* >>========================================>
* JS
* >>========================================>
*/

// Just conbines scripts mentioned in 'paths'

function scripts_dev() {
	return gulp
		.src(paths.scripts.src)
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest(paths.scripts.dest))
}

// Uglifies and combines scripts mentioned in 'paths'

function scripts_prod() {
	return gulp
		.src(paths.scripts.src)
		.pipe(uglify())
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest(paths.scripts.dest));
}

/*
* >>========================================>
* DOM
* >>========================================>
*/

// Removes comments and whitespace and Prettifies

function dom_email() {
	return gulp
		.src(paths.dom.src)
		.pipe(inlineImagePath({path:"http://website.com/img/"}))
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true
			})
		)
		.pipe(gulp.dest(paths.dom.dest));
}

/*
* >>========================================>
* CSS
* >>========================================>
*/

function styles_dev() {
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

function styles_prod() {
	return gulp
		.src(paths.styles.src)
		.pipe(
			sass({
				outputStyle: "compressed"
			})
		)
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
}

// CSS Inliner (Email development)

function styles_email() {
	return gulp
		.src('./dist/*.html')
		.pipe(inlineCss({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: true
		}))
		.pipe(gulp.dest(paths.dom.dest));
}

/*
* >>========================================>
* Images
* >>========================================>
*/

function images_prod() {
	return gulp
		.src("src/img/*")
		.pipe(imagemin([
			imageminMozjpeg({quality: 85}),
			imagemin.optipng({optimizationLevel: 5})
		]))
		.pipe(gulp.dest("dist/img"));
}

function images_dev() {
	return gulp
		.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest));
}

// Wipes out all images

const clean_images = () => del(paths.images.dest);

/*
* >>========================================>
* BrowserSync
* >>========================================>
*/

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

/*
* >>========================================>
* Init
* >>========================================>
*/

function watch() {
	gulp.watch("src/js/main.js", gulp.series(scripts_dev, reload));
	gulp.watch(paths.styles.src, gulp.series(styles_dev));
	gulp.watch("dist/*.php", gulp.series(reload));
	gulp.watch("dist/*.html", gulp.series(reload));
	gulp.watch(paths.images.src, gulp.series(images_dev, reload));
}

// Development tasks

const dev = gulp.series(serve, styles_dev, scripts_dev, images_dev, watch);
gulp.task("dev", dev);

// Image compression only

gulp.task("images", images_prod);

// Production tasks (no server)

const production = gulp.series(scripts_prod, styles_prod, clean_images, images_prod);
gulp.task("prod", production);

// Production tasks (email)

const prod_email = gulp.series(styles_email, dom_email);
gulp.task("prod_email", prod_email);