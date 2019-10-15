/*
* >>========================================>
* Settings
* >>========================================>
*/

const settings = {
	type: 'wp',
	emailImgPath: '',
	database: '',
	siteURL: '',
	theme: ''
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

function backupDatabase(done){
	if(settings.database != '') {
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
				database: settings.database
			},
			dump: {
				data: {
					format : false
				}
			},
			dumpToFile: settings.database + today + '.sql'
		});
	}
	return done();
}

/*
* >>========================================>
* JS Tasks
* >>========================================>
*/

const deleteScriptsDir = () => del(paths.scripts.dest);

function combineScripts() {
	return gulp
		.src(paths.scripts.src)
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest(paths.scripts.dest))
}

function devScripts(done){
	if(settings.type != 'email') {
		deleteScriptsDir();
		combineScripts();
	}
	return done();
}

function compressScripts() {
	return gulp
		.src(paths.scripts.src)
		.pipe(concat("main.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
}

function buildScripts(done){
	if(settings.type != 'email') {
		compressScripts();
	}
	return done();
}

/*
* >>========================================>
* Document Object Model (DOM) Tasks
* >>========================================>
*/

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

function devDOM(done){
	if(settings.type == 'email') {
		copyEmailDOM();
	}else{
		copyDOM();
	}
	
	done();
}

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
		.pipe(replace('src="', 'src="' + settings.emailImgPath))
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

function buildDOM(done){
	if(settings.type == 'email') {
		processEmailDOM();
	}else{
		processDOM();
	}

	done();
}

function copyFiles(done) {
	return gulp
		.src('./src/**/!(*.html|*.php|/scss/|/js/|/img/)', { nodir: true })
		.pipe(gulp.dest(paths.dom.dest));
	
	done();
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

function devCSS(done){
	if(settings.type == 'email') {
		compileEmailCSS();
	}else{
		compileCSS();
	}
	
	done();
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

function inlineCSS(done) {
	if(settings.type == 'email') {
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
			.pipe(gulp.dest(paths.dom.dest))
	}

	done();
}

function buildCSS(done){
	if(settings.type == 'email') {
		compileEmailCSS();
	}else{
		compileCompressedCSS();
	}

	done();
}

function deleteCSSDir(done) {
	if(settings.type == 'email') {
		return del(paths.styles.dest);
	}

	done();
}

function removeDistDir(done) {
	return del("./dist");

	done();
}

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
		], {
			verbose: true
		}))
		.pipe(gulp.dest(paths.images.dest));
}

function copyImages() {
	return gulp
		.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest))
}

/*
* >>========================================>
* BrowserSync
* >>========================================>
*/

function liveReload() {
	browserSync.reload();
}

function startServer() {
	if(settings.siteURL === '') {
		browserSync.init({
			server: {
				baseDir: "./dist"
			}
		});
	}else{
		browserSync.init({
			server: {
				proxy: settings.siteURL
			}
		});
	}
}

/*
* >>========================================>
* Watch for Changes
* >>========================================>
*/

function watchForChanges() {
	gulp.watch(paths.scripts.src, gulp.series(devScripts, liveReload));
	gulp.watch(paths.styles.src, gulp.series(devCSS));
	gulp.watch(paths.dom.src, gulp.series(devDOM, liveReload));
	gulp.watch(paths.images.src, gulp.series(copyImages, liveReload));
}

/*
* >>========================================>
* Web (Static Sites, WP) Tasks
* >>========================================>
*/

const devTasks = gulp.series(
	removeDistDir,
	devScripts,
	devCSS,
	devDOM,
	copyImages,
	copyFiles,
	startServer,
	watchForChanges
);

gulp.task("dev", devTasks);

const buildTasks = gulp.series(
	removeDistDir,
	buildScripts,
	buildCSS,
	buildDOM,
	compressImages,
	inlineCSS,
	deleteCSSDir,
	copyFiles,
	backupDatabase
);

gulp.task("build", buildTasks);

/*
* >>========================================>
* Project Setup Tasks
* >>========================================>
*/

const removeSrcFiles = () => del("./src/*");

function copyTemplateFiles(){
	return gulp
		.src('./templates/' + settings.type +  '/**')
		.pipe(gulp.dest('./src/'));
}

function cloneWP(done){
	if(settings.type == 'wp'){
		git.clone('https://github.com/WordPress/WordPress', {args: './dist'}, function(err){
			if(err) throw err;
		});
	}

	done();
}

const setupProject = gulp.series(
	removeDistDir,
	removeSrcFiles,
	copyTemplateFiles,
	cloneWP
);

gulp.task("setup", setupProject);