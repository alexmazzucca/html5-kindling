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
		src: [
			"./src/scss/main.scss",
		],
		dest: "./dist/css/"
	},
	styles_email: {
		src: "./src/scss/for-email/**/*.scss",
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

function combineScripts() {
	return gulp
		.src(paths.scripts.src)
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest(paths.scripts.dest))
}

// Uglifies and combines scripts mentioned in 'paths'

function compressScripts() {
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

function cleanDOM() {
	return gulp
		.src(paths.dom.src)
		.pipe(replace('src="', 'src="'))
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				conservativeCollapse: true,
				preserveLineBreaks: true,
				removeComments: true
			})
		)
		.pipe(prettyHtml())
		.pipe(gulp.dest(paths.dom.dest));
}

// Removes comments and whitespace and Prettifies

function cleanEmailDOM() {
	return gulp
		.src(paths.dom.src)
		.pipe(replace('src="', 'src="'))
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
		.pipe(prettyHtml())
		.pipe(gulp.dest(paths.dom.dest));
}

function copyDOM() {
	return gulp
		.src(paths.dom.src)
		.pipe(gulp.dest(paths.dom.dest));
}

function copyOtherFiles() {
	return gulp
		.src('./src/**/!(*.html|*.php|*.scss|*.js)', { nodir: true })
		.pipe(gulp.dest('./dist/'));
}

/*
* >>========================================>
* Sass/CSS Tasks
* >>========================================>
*/

function compileCSS() {
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

function compileEmailCSS() {
	return gulp
		.src(paths.styles_email.src)
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

function compileCompressedCSS() {
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

function inlineCSS() {
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

const deleteCSSDir = () => del(paths.styles.dest);

const deleteDistDir = () => del('./dist/*');

/*
* >>========================================>
* Image Tasks
* >>========================================>
*/

function compressImages() {
	return gulp
		.src("src/img/*")
		.pipe(imagemin([
			imageminMozjpeg({quality: 85}),
			imagemin.optipng({optimizationLevel: 5})
		]))
		.pipe(gulp.dest("dist/img"));
}

function copyImages() {
	return gulp
		.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest));
}

// Wipes out all images

const deleteImagesDir = () => del(paths.images.dest);

/*
* >>========================================>
* BrowserSync
* >>========================================>
*/

function liveReload(done) {
	browserSync.reload();
	done();
}

function startServer(done) {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	done();
}

/*
* >>========================================>
* Watch for Changes
* >>========================================>
*/

function watchForChanges() {
	gulp.watch(paths.scripts.src, gulp.series(combineScripts, liveReload));
	gulp.watch(paths.styles.src, gulp.series(compileCSS));
	gulp.watch(paths.styles_email.src, gulp.series(compileEmailCSS));
	gulp.watch(paths.dom.src, gulp.series(copyDOM, liveReload));
	gulp.watch(paths.images.src, gulp.series(copyImages, liveReload));
}

/*
* >>========================================>
* Task Initialization
* >>========================================>
*/

// Development tasks

const development = gulp.series(deleteDistDir, copyDOM, compileCSS, combineScripts, copyImages, startServer, copyOtherFiles, watchForChanges);
gulp.task("spark", development);

// Production tasks

const production = gulp.series(deleteDistDir, cleanDOM, compressScripts, compileCompressedCSS, deleteImagesDir, compressImages, copyOtherFiles);
gulp.task("blaze", production);

// Email Development tasks

const development_email = gulp.series(deleteDistDir, startServer, copyDOM, compileEmailCSS, copyImages, watchForChanges);
gulp.task("spark_email", development_email);

// Email Production Tasks

const production_email = gulp.series(deleteDistDir, cleanEmailDOM, compileEmailCSS, inlineCSS, deleteCSSDir, compressImages);
gulp.task("blaze_email", production_email);