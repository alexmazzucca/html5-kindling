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
var replace = require('gulp-replace');

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
		src: "./src/scss/**/*.scss",
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
* JS Tasks
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
* Document Object Model (DOM) Tasks
* >>========================================>
*/

// Removes comments and whitespace and Prettifies

function dom_email_prod() {
	return gulp
		.src(paths.dom.src)
		//.pipe(replace('src="', 'src="http://www.website.com'))
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				conservativeCollapse: true,
				preserveLineBreaks: true,
				removeComments: true,
				keepClosingSlash: true,
				removeEmptyAttributes: false
			})
		)
		// .pipe(prettyHtml())
		.pipe(gulp.dest(paths.dom.dest));
}

function dom_global_dev() {
	return gulp
		.src(paths.dom.src)
		.pipe(gulp.dest('./dist/'));
}

/*
* >>========================================>
* SASS/CSS Tasks
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
		.on("error", sass.logError)
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
}

// CSS Inliner (Email development)

function styles_email_dev() {
	return gulp
		.src(paths.styles.src)
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

function styles_email_prod() {
	return gulp
		.src('./dist/*.html')
		.pipe(inlineCss({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: true,
			removeHtmlSelectors: true,
			xmlMode: true,
		}))
		.pipe(gulp.dest(paths.dom.dest));
}

const clean_styles = () => del(paths.styles.dest);

const clean_dist = () => del('./dist/*');

/*
* >>========================================>
* Image Tasks
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
* Watch
* >>========================================>
*/

function watch() {
	gulp.watch(paths.scripts.src, gulp.series(scripts_dev, reload));
	gulp.watch(paths.styles.src, gulp.series(styles_dev));
	gulp.watch(paths.images.src, gulp.series(images_dev, reload));
}

function watch_email() {
	gulp.watch(paths.styles.src, gulp.series(styles_dev));
	gulp.watch(paths.dom.src, gulp.series(dom_global_dev, reload));
	gulp.watch(paths.images.src, gulp.series(images_dev, reload));
}

/*
* >>========================================>
* Web Task Initialization
* >>========================================>
*/

// Image compression only

gulp.task("images", images_prod);

// Development tasks

const development = gulp.series(serve, dom_dev, styles_dev, scripts_dev, images_dev, watch);
gulp.task("dev", development);

// Production tasks (no server)

const production = gulp.series(scripts_prod, styles_prod, clean_images, images_prod);
gulp.task("prod", production);

/*
* >>========================================>
* Email Task Initialization
* >>========================================>
*/

// Email Development Tasks

const development_email = gulp.series(dom_dev, styles_email_dev, images_dev, serve, watch_email);
gulp.task("dev_email", development_email);

// Email Production Tasks

const production_email = gulp.series(clean_dist, dom_email_prod, styles_email_dev, styles_email_prod, clean_styles, images_prod);
gulp.task("prod_email", production_email);