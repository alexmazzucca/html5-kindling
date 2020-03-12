/*
* >>========================================>
* Required
* >>========================================>
*/

var settings = require('./settings.json')
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
var cache = require('gulp-cache');
var notify = require("gulp-notify");

const mysqldump = require('mysqldump')
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require('imagemin-mozjpeg');
const notifier = require('node-notifier');

/*
* >>========================================>
* File Paths
* >>========================================>
*/

var pathToTheme = "";

if(settings.theme != "") {
	pathToTheme = "wp-content/themes/" + settings.theme + '/';
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
			"./src/scss/*.scss",
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
* Database Tasks
* >>========================================>
*/

function backupDatabase(cb){
	if(settings.database != '') {
		return mysqldump({
			connection: {
				host: 'localhost',
				user: 'root',
				password: 'root',
				database: settings.database
			},
			dump: {
				data: {
					format : false
				}
			},
			dumpToFile: settings.database + '.sql'
		});
	}

	cb();
}
 
/*
* >>========================================>
* Script (JS) Tasks
* >>========================================>
*/

function compressScripts(cb) {
	return gulp
		.src(paths.scripts.src)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(notify({
			title: 'Kindling',
			message: 'Javascript successfully compressed',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.scripts.dest));

	cb();
}

function combineScripts(cb) {
	return gulp
		.src(paths.scripts.src)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(concat("main.js"))
		.pipe(notify({
			title: 'Kindling',
			message: 'Javascript successfully concatenated',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.scripts.dest));

	cb();
}

/*
* >>========================================>
* DOM Tasks
* >>========================================>
*/

function compressDOM(cb) {
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
		.pipe(gulp.dest(paths.dom.dest));

	cb();
}

function compressEmailDOM(cb){
	if(settings.type == 'email') {
		return gulp
			.src('./src/index.html')
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
	
	cb();
}

function updateEmailImagePaths(cb){
	if(settings.address != '') {
		return gulp
			.src('./dist/index.html')
			.pipe(replace('src="img/', 'src="' + settings.address))
			.pipe(gulp.dest(paths.dom.dest));
	}
	
	cb();
}

/*
* >>========================================>
* Sass/CSS Tasks
* >>========================================>
*/

function compileCSS(cb) {
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: "compressed"
			})
		)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(notify({
			title: 'Kindling',
			message: 'SASS successfully compiled',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
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
		.pipe(browserSync.stream());

	cb();
}

function compileEmailCSS(cb){
	return gulp
		.src('./src/scss/email.scss')
		.pipe(
			sass()
		)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(notify({
			title: 'Kindling',
			message: 'SASS successfully compiled',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());

	cb();
}

function inlineCSS(cb) {
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
		.pipe(notify({
			title: 'Kindling',
			message: 'CSS successfully inlined',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.dom.dest))

	cb();
}

function deleteTemporaryCSSDir(cb) {
	return del(paths.styles.dest);

	cb();
}

/*
* >>========================================>
* Image Tasks
* >>========================================>
*/

function compressImages(cb) {
	return gulp
		.src(paths.images.src)
		.pipe(cache(imagemin([
			imageminMozjpeg({quality: 85}),
			imagemin.optipng({optimizationLevel: 5})
		], {
			verbose: true
		})))
		.pipe(notify({
			title: 'Kindling',
			message: 'Images successfully compressed',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.images.dest));

	cb();
}

/*
* >>========================================>
* Start Server and Live Reload
* >>========================================>
*/

function startServer(cb) {
	if(settings.address === '' || settings.type == 'email') {
		browserSync.init({
			server: {
				baseDir: "./dist/"
			}
		});
	}else{
		browserSync.init({
			proxy: settings.address
		});
	}

	notifier.notify({
		title: 'Kindling',
		message: 'Server started',
		icon: 'undefined',
		contentImage: 'undefined'
	});
	
	cb();
}

/*
* >>========================================>
* Watch Folders for Changes
* >>========================================>
*/

function watchForChanges() {
	if(settings.type == 'email') {
		gulp.watch(paths.dom.src, gulp.series(compressEmailDOM, liveReload));
	}else{
		gulp.watch(paths.dom.src, gulp.series(compressDOM, liveReload));
		gulp.watch(paths.scripts.src, gulp.series(combineScripts, liveReload));
	}

	gulp.watch(paths.styles.src, gulp.series(compileCSS));
	gulp.watch(paths.images.src, gulp.series(compressImages, liveReload));
}

function liveReload(cb) {
	browserSync.reload();
	cb();
}

/*
* >>========================================>
* Build Tasks
* >>========================================>
*/

function buildComplete(cb){
	notifier.notify({
		title: 'Kindling',
		message: 'Project build complete',
		icon: 'undefined',
		contentImage: 'undefined'
	});

	cb();
}

const emailBuildTasks = gulp.series(
	gulp.parallel(
		compileEmailCSS,
		compressEmailDOM,
		compressImages
	),
	updateEmailImagePaths,
	inlineCSS,
	deleteTemporaryCSSDir,
	buildComplete
);

const buildTasks = gulp.series(
	gulp.parallel(
		compressScripts,
		compileCSS,
		compressDOM,
		compressImages
	),
	buildComplete
);

if(settings.type == 'email') {
	gulp.task("build", emailBuildTasks);
}else{
	gulp.task("build", buildTasks);
}

/*
* >>========================================>
* Development Tasks
* >>========================================>
*/

const emailDevelopmentTasks = gulp.series(
	compileCSS,
	compressEmailDOM,
	compressImages,
	startServer,
	watchForChanges
);

const developmentTasks = gulp.series(
	combineScripts,
	compileCSS,
	compressDOM,
	compressImages,
	startServer,
	watchForChanges
);

if(settings.type == 'email') {
	gulp.task("develop", emailDevelopmentTasks);
}else{
	gulp.task("develop", developmentTasks);
}

/*
* >>========================================>
* Database Tasks
* >>========================================>
*/

const databaseTasks = gulp.series(
	backupDatabase
);

gulp.task("database", databaseTasks);