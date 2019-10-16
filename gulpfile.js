//      )                 (      (                        
//   ( /(   (             )\ )   )\   (            (  (   
//   )\())  )\    (      (()/(  ((_)  )\    (      )\))(  
//  ((_)\  ((_)   )\ )    ((_))  _   ((_)   )\ )  ((_))\  
//  | |(_)  (_)  _(_/(    _| |  | |   (_)  _(_/(   (()(_) 
//  | / /   | | | ' \)) / _` |  | |   | | | ' \)) / _` |  
//  |_\_\   |_| |_||_|  \__,_|  |_|   |_| |_||_|  \__, |  
//                                                |___/   

/*
* >>========================================>
* Instructions
* >>========================================>
*/

/**
 * 1. Specify project type in 'settings' (static, email, wordpress)
 * 2. If starting a WordPress project, specify a database, site URL and theme name
 * 3. If starting an email project, specify remote image folder path
 * 4. Run 'gulp setup' to copy necessary files to 'src' and 'dist'
 * 5. Run 'gulp dev' to produce a development build of the project (and start local server)
 * 6. Run 'gulp build' to produce a production build of the project
 */

/*
* >>========================================>
* Settings
* >>========================================>
*/

const settings = {
	type: 'wordpress',
	address: 'http://kindling.local', //Include trailing slash
	database: '',
	theme: 'test'
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
var git = require('gulp-git');
var PluginError = require('plugin-error');
const c = require('ansi-colors');

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
		dest: "./dist/" + pathToTheme + "/"
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
* Script Tasks
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
* DOM Tasks
* >>========================================>
*/

function copyDOM(done) {
	return gulp
		.src(paths.dom.src)
		.pipe(gulp.dest(paths.dom.dest));
	
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
		.src('./src/index.html')
		.pipe(replace('src="', 'src="' + settings.address))
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
	if(settings.type == 'wordpress') {
		return del("./dist/" + pathToTheme);
	}else{
		return del("./dist");
	}

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

function liveReload(done) {
	browserSync.reload();
	done();
}

function startServer(done) {
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
	done();
}

/*
* >>========================================>
* Watch
* >>========================================>
*/

function watchForChanges() {
	gulp.watch(paths.scripts.src, gulp.series(devScripts, liveReload));
	gulp.watch(paths.styles.src, gulp.series(devCSS));
	gulp.watch(paths.dom.src, gulp.series(copyDOM, liveReload));
	gulp.watch(paths.images.src, gulp.series(copyImages, liveReload));
}

/*
* >>========================================>
* Project Setup
* >>========================================>
*/

// const resetSrc = () => del("./src/*");
const resetDist = () => del("./dist");

function resetSrc(done){
	if(settings.type === 'wordpress'){
		if(settings.theme != '' && settings.database != '' && settings.address != ''){
			return del("./src/*");
		}else{
			console.log(c.bgRed('**ERROR** You must supply theme, database and address to start a WordPress project'));
			process.exit();
		}
	}else{
		return del("./src/*");
	}
}

exports.default = resetSrc;

function copyTemplateFiles(){
	return gulp
		.src('./templates/' + settings.type +  '/**')
		.pipe(gulp.dest('./src/'));
}

function cloneWP(done){
	if(settings.type == 'wordpress'){
		git.clone('https://github.com/WordPress/WordPress', {args: './dist'}, function(err){
			if(err) throw err;
		});
	}

	done();
}

const setupProject = gulp.series(
	resetSrc,
	resetDist,
	copyTemplateFiles,
	cloneWP
);

gulp.task("setup", setupProject);

/*
* >>========================================>
* Task Series
* >>========================================>
*/

const devTasks = gulp.series(
	removeDistDir,
	gulp.parallel(
		devScripts,
		devCSS
	),
	gulp.parallel(
		copyDOM,
		copyImages,
		copyFiles
	),
	startServer,
	watchForChanges
);

gulp.task("dev", devTasks);

const buildTasks = gulp.series(
	removeDistDir,
	gulp.parallel(
		buildScripts,
		buildCSS,
		buildDOM,
		compressImages
	),
	inlineCSS,
	deleteCSSDir,
	copyFiles,
	backupDatabase
);

gulp.task("build", buildTasks);