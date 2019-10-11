/*
* >>========================================>
* Settings
* >>========================================>
*/

const settings = {
	wordpress: {
		url: "",
		theme: "test",
		database: ""
	},
	email: {
		url: ""
	}
};

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
var rename = require("gulp-rename");
var log = require('fancy-log');
var git = require('gulp-git');

const mysqldump = require('mysqldump')
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require('imagemin-mozjpeg');

/*
* >>========================================>
* File Paths
* >>========================================>
*/

var pathToTheme = "";

if(settings.wordpress.theme != "") {
	pathToTheme = "wp-content/themes/" + settings.wordpress.theme + '/';
}else{
	pathToTheme = "";
}

const paths = {
	scripts: {
		src: [
			"./node_modules/jquery/dist/jquery.js",
			"./node_modules/gsap/src/uncompressed/TweenMax.js",
			"./src/js/vendor/*.js",
			"./src/js/main.js"
		],
		dest: "./dist/" + pathToTheme + "js/"
	},
	styles: {
		src: [
			"./src/scss/main.scss",
		],
		dest: "./dist/" + pathToTheme + "css/"
	},
	dom: {
		src: [
			"./src/**/*.html",
			"./src/**/*.php"
		],
		dest: "./dist/" + pathToTheme
	},
	images: {
		src: "./src/img/*",
		dest: "./dist/" + pathToTheme + "img/"
	}
};

/*
* >>========================================>
* Database
* >>========================================>
*/

function dumpDatabase(done){
	if(settings.wordpress.database != '') {
		var today = new Date(),
			dd = today.getDate(),
			mm = today.getMonth()+1 //January is 0!
			yyyy = today.getFullYear();
			if(dd<10) { dd = '0'+dd	}
			if(mm<10) { mm = '0'+mm }
			today = '_' + yyyy + '-' + mm + '-' + dd;

		return mysqldump({
			connection: {
				host: 'localhost',
				user: 'root',
				password: 'root',
				database: settings.wordpress.database
			},
			dump: {
				data: {
					format : false
				}
			},
			dumpToFile: settings.wordpress.database + today + '.sql'
		});
	}
	done();
}

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
		.pipe(concat("main.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
}

const deleteScriptsDir = () => del(paths.scripts.dest);

/*
* >>========================================>
* Document Object Model (DOM) Tasks
* >>========================================>
*/

function processDOM() {
	return gulp
		.src(paths.dom.src)
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

function processEmailDOM() {
	return gulp
		.src('./src/email.html')
		.pipe(replace('src="', 'src="' + settings.email.url))
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
		.pipe(
			rename({
				basename: "index"
			})
		)
		.pipe(gulp.dest(paths.dom.dest));
}

function copyDOM() {
	return gulp
		.src(paths.dom.src)
		.pipe(gulp.dest(paths.dom.dest));
}

function copyEmailDOM() {
	return gulp
		.src('./src/email.html')
		.pipe(
			rename({
				basename: "index"
			})
		)
		.pipe(gulp.dest(paths.dom.dest));
}

function copyOtherFiles() {
	return gulp
		.src('./src/**/!(*.html|*.php|/scss/|/js/|/img/)', { nodir: true })
		.pipe(gulp.dest(paths.dom.dest));
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
		.pipe(rename(
			function(path){
				if(pathToTheme === '') {
					path.dirname += paths.styles.dest;
				}else{
					path.dirname += "./dist/" + pathToTheme;
					path.basename = "style";
				}
			}
		))
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());
}

function compileEmailCSS() {
	return gulp
		.src('./src/scss/email.scss')
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
		.pipe(rename(
			function(path){
				path.suffix += ".min";

				if(pathToTheme === '') {
					path.dirname += paths.styles.dest;
				}else{
					path.dirname += "./dist/" + pathToTheme;
					path.basename = "style";
				}
			}
		))
		.pipe(gulp.dest("./dist"))
}

function inlineCSS() {
	return gulp
		.src('./dist/index.html')
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

const deleteDistFiles = () => del("./dist/" + pathToTheme + "*");

const removeDistDir = () => del("./dist");

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
		.pipe(gulp.dest(paths.images.dest));
}

function copyImages() {
	return gulp
		.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest));
}

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
			proxy: settings.wordpress.url
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
	gulp.watch(paths.dom.src, gulp.series(copyDOM, liveReload));
	gulp.watch(paths.images.src, gulp.series(copyImages, liveReload));
}

function watchForEmailChanges() {
	gulp.watch(paths.styles.src, gulp.series(compileEmailCSS));
	gulp.watch(paths.dom.src, gulp.series(copyDOM, liveReload));
	gulp.watch(paths.images.src, gulp.series(copyImages, liveReload));
}

/*
* >>========================================>
* Setup Tasks
* >>========================================>
*/

/* Email */

const deleteSrcFiles = () => del("./src/*");

function copyEmailFilesToSrc() {
	return gulp
		.src('./templates/email/**')
		.pipe(gulp.dest('./src/'));
}

const setupEmail = gulp.series(removeDistDir, deleteSrcFiles, copyEmailFilesToSrc);
gulp.task("setupEmail", setupEmail);

/* Static site */

function copyStaticFilesToSrc() {
	return gulp
		.src('./templates/static/**')
		.pipe(gulp.dest('./src/'));
}

const setupStatic = gulp.series(removeDistDir, deleteSrcFiles, copyStaticFilesToSrc);
gulp.task("setupStatic", setupStatic);

/* WordPress */

function copyThemeFiles() {
	return gulp
		.src('./templates/theme/**')
		.pipe(gulp.dest('./src/'))
}

function cloneWordPressToSrc(done){
	git.clone('https://github.com/WordPress/WordPress', {args: './dist'}, function(err){
		if(err) throw err;
	});
	done();
};

const wpSetup = gulp.series(removeDistDir, deleteSrcFiles, cloneWordPressToSrc, copyThemeFiles);
gulp.task("setupWordPress", wpSetup);

/*
* >>========================================>
* Web Development Tasks
* >>========================================>
*/

const developmentTasks = gulp.series(deleteDistFiles, copyDOM, deleteCSSDir, compileCSS, deleteScriptsDir, combineScripts, deleteImagesDir, copyImages, copyOtherFiles, startServer, watchForChanges);
gulp.task("develop", developmentTasks);

const productionTasks = gulp.series(deleteDistFiles, processDOM, compressScripts, compileCompressedCSS, deleteImagesDir, compressImages, copyOtherFiles, dumpDatabase);
gulp.task("build", productionTasks);

/*
* >>========================================>
* Email Development Tasks
* >>========================================>
*/

const emailDevelopmentTasks = gulp.series(deleteDistFiles, copyEmailDOM, compileEmailCSS, copyImages, startServer, watchForEmailChanges);
gulp.task("developEmail", emailDevelopmentTasks);

const emailProductionTasks = gulp.series(deleteDistFiles, compileEmailCSS, processEmailDOM, inlineCSS, deleteCSSDir, compressImages);
gulp.task("buildEmail", emailProductionTasks);