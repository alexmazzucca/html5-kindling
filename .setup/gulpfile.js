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
var inlineCSS = require('gulp-inline-css');
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
		src: "./src/img/**",
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

function compressJS(cb) {
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
			message: 'Javascript compression complete',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.scripts.dest));

	cb();
}

function combineJS(cb) {
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
			message: 'Javascript concatenation complete',
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
	
	cb();
}

function copyEmailDOM(cb){
	return gulp
		.src('./src/index.html')
		.pipe(gulp.dest(paths.dom.dest));

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

function copyFilesToDist(cb){
	return gulp
		.src(['./src/**', './src/**/.*', '!./src/js/**', '!./src/scss/**'])
		.pipe(notify({
			title: 'Kindling',
			message: 'Files successfully copied to ./dist',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest('./dist/' + pathToTheme));
}

/*
* >>========================================>
* SASS/CSS Tasks
* >>========================================>
*/

function compressSASS(cb) {
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
		.pipe(notify({
			title: 'Kindling',
			message: 'SASS compilation and compression complete',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());

	cb();
}

function compileEmailSASS(cb){
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
			message: 'SASS compilation complete',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());

	cb();
}

function inlineStyles(cb) {
	return gulp
		.src('./dist/index.html')
		.pipe(inlineCSS({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: true,
			removeHtmlSelectors: true,
			xmlMode: true,
		}))
		.pipe(notify({
			title: 'Kindling',
			message: 'CSS inline complete',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.dom.dest))

	cb();
}

function delTempCSSDir(cb) {
	return del(paths.styles.dest);

	cb();
}

/*
* >>========================================>
* Image Tasks
* >>========================================>
*/

function compressImg(cb) {
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
			message: 'Image compression complete',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
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
		gulp.watch(paths.dom.src, gulp.series(copyEmailDOM, liveReload));
	}else{
		gulp.watch(paths.dom.src, gulp.series(compressDOM, liveReload));
		gulp.watch(paths.scripts.src, gulp.series(combineJS, liveReload));
	}

	gulp.watch(paths.styles.src, gulp.series(compressSASS));
	gulp.watch(paths.images.src, {events: ['add']}, gulp.series(compressImg, liveReload));
	gulp.watch(['./src/**', '!./src/js/**', '!./src/scss/**', '!./src/img/**', '!./src/**/*.html', '!./src/**/*.php'], {events: ['add']}, gulp.series(copyFilesToDist, liveReload));
}

function liveReload(cb) {
	browserSync.reload();

	cb();
}

/*
* >>========================================>
* Deployment Tasks
* >>========================================>
*/

function promptForDeploymentOptions(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'Select the deployment environment:',
			choices: ['staging', 'live'],
		},
		], function(res){
			var environment = res.environment;

			if(environment == 'staging'){
				deployToStagingSite();
			}else{
				deployToLiveSite();
			}
			cb();
		}))
		.pipe(gulp.dest('./'))
}

function deployToStagingSite(){
	var conn = ftp.create( {
		host:     'mywebsite.tld',
		user:     'me',
		password: 'mypass',
		parallel: 10,
		log:      gutil.log
	});

	return gulp.src( './src/', { base: '.', buffer: false } )
		.pipe(conn.newer('/public_html/test/'));
		
	cb();
}

function deployToLiveSite(){
	var conn = ftp.create( {
		host:     'mywebsite.tld',
		user:     'me',
		password: 'mypass',
		parallel: 10,
		log:      gutil.log
	});

	return gulp.src( './src/', { base: '.', buffer: false } )
		.pipe(conn.newer('/public_html/test/'));
		
	cb();
}

/*
* >>========================================>
* Build Tasks
* >>========================================>
*/

function delDistDir(cb) {
	return del('./dist/' + pathToTheme);

	cb();
}

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
	delDistDir,
	gulp.parallel(
		compileEmailSASS,
		compressEmailDOM,
		compressImg
	),
	updateEmailImagePaths,
	inlineStyles,
	delTempCSSDir,
	buildComplete
);

const buildTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressSASS,
		compressDOM,
		compressImg
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

const emailDevTasks = gulp.series(
	delDistDir,
	compressSASS,
	copyEmailDOM,
	compressImg,
	startServer,
	watchForChanges
);

const devTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	combineJS,
	compressSASS,
	compressDOM,
	compressImg,
	startServer,
	watchForChanges
);

if(settings.type == 'email') {
	gulp.task("develop", emailDevTasks);
}else{
	gulp.task("develop", devTasks);
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

/*
* >>========================================>
* Deployment Tasks
* >>========================================>
*/

const deploymentTasks = gulp.series(
	promptForDeploymentOptions
);

gulp.task("deploy", deploymentTasks);