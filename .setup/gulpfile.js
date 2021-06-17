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
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var prompt = require('gulp-prompt');
var git = require('gulp-git');

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
			"./node_modules/gsap/dist/gsap.min.js",
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
	wp_styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/" + pathToTheme
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
* Database
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
* Script (JS)
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
* DOM
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
* SASS/CSS
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
		.pipe(notify({
			title: 'Kindling',
			message: 'SASS compilation and compression complete',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());

	cb();
}

function compileSASS(cb) {
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: "expanded"
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
		.pipe(notify({
			title: 'Kindling',
			message: 'SASS compilation complete',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());

	cb();
}

function compressWPSASS(cb) {
	return gulp
		.src(paths.wp_styles.src)
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
		.pipe(rename(
			function(path){
				if(path.basename == 'main') {
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
		.pipe(gulp.dest(paths.wp_styles.dest))
		.pipe(browserSync.stream());

	cb();
}

function compileWPSASS(cb) {
	return gulp
		.src(paths.wp_styles.src)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: "expanded"
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
				if(path.basename == 'main') {
					path.basename = "style";
				}
			}
		))
		.pipe(notify({
			title: 'Kindling',
			message: 'SASS compilation complete',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest(paths.wp_styles.dest))
		.pipe(browserSync.stream());

	cb();
}

/*
* >>========================================>
* Images
* >>========================================>
*/

function compressImg(cb) {
	return gulp
		.src(paths.images.src)
		.pipe(cache(imagemin([
			imageminMozjpeg({quality: 75}),
			imagemin.optipng({optimizationLevel: 6})
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
	if(settings.url === '') {
		browserSync.init({
			server: {
				baseDir: "./dist/"
			}
		});
	}else{
		browserSync.init({
			proxy: settings.url
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
	gulp.watch(paths.dom.src, gulp.series(compressDOM, liveReload));
	gulp.watch(paths.scripts.src, gulp.series(combineJS, liveReload));

	if(settings.type == 'wordpress'){
		gulp.watch(paths.styles.src, gulp.series(compressWPSASS));
	}else{
		gulp.watch(paths.styles.src, gulp.series(compressSASS));
	}
	
	gulp.watch(['./src/**', '!./src/js/**', '!./src/scss/**', '!./src/**/*.html', '!./src/**/*.php'], {events: ['add']}, gulp.series(copyFilesToDist, liveReload));
}

function liveReload(cb) {
	browserSync.reload();

	cb();
}

/*
* >>========================================>
* Deployment
* >>========================================>
*/

var deploymentEnvironment = 'production';

function promptForDeploymentOptions(cb){
	if(settings.staging_host != ''){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'list',
				name: 'environment',
				message: 'Select the deployment environment:',
				choices: ['staging', 'production'],
			},
			], function(res){
				deploymentEnvironment = res.environment;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function deployToServer(){
	if(deploymentEnvironment == 'production'){
		var conn = ftp.create( {
			host:     settings.host,
			user:     settings.username,
			password: settings.password,
			parallel: 4,
			log:      gutil.log
		});
	
		return gulp.src( './dist/**', { base: './dist/', buffer: false } )
			.pipe(conn.newerOrDifferentSize(settings.remote_path))
			.pipe(conn.dest(settings.remote_path));
	}else{
		var conn = ftp.create( {
			host:     settings.staging_host,
			user:     settings.staging_username,
			password: settings.staging_password,
			parallel: 4,
			log:      gutil.log
		});
	
		return gulp.src( './dist/**', { base: './dist/', buffer: false } )
			.pipe(conn.newerOrDifferentSize(settings.staging_remote_path))
			.pipe(conn.dest(settings.staging_remote_path));
	}
		
	cb();
}

/*
* >>========================================>
* Git
* >>========================================>
*/

var commitSummary = '';

function promptForSummary(cb){
	return gulp.src('./*')
		.pipe(prompt.prompt([
		{
			type: 'input',
			name: 'summary',
			message: 'Summary of changes:'
		}
		], function(res){
			commitSummary = res.summary;
		}))

	cb();
}

function gitAdd(cb){
	return gulp.src('./')
		.pipe(git.add());
}

var buildDate = new Date()

buildDate = buildDate.getFullYear() + "-" + ('0' + (buildDate.getMonth() + 1)).slice(-2) + "-" + ('0' + buildDate.getDate()).slice(-2) + " " + ('0' + buildDate.getHours()).slice(-2) + ":" + ('0' + buildDate.getMinutes()).slice(-2) + ":" + ('0' + buildDate.getSeconds()).slice(-2);

function gitCommitWithAutoSummary(cb){
	return gulp.src('./')
		.pipe(git.commit('Build: ' + buildDate));
}

function gitCommitWithUserSummary(cb){
	return gulp.src('./')
		.pipe(git.commit(commitSummary));
}

function gitPush(cb){
	git.revParse({args:'--abbrev-ref HEAD'}, function (err, branch) {
		currentBranch = branch;

		git.push('origin', branch, function (err) {
			//if (err) ...
		});

		cb();
	});
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

const buildTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressSASS,
		compressDOM,
		compressImg
	),
	gitAdd,
	gitCommitWithAutoSummary,
	gitPush,
	buildComplete
);

const wpBuildTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressWPSASS,
		compressDOM,
		compressImg
	),
	gitAdd,
	gitCommitWithAutoSummary,
	gitPush,
	buildComplete
);

if(settings.type == 'wordpress') {
	gulp.task("build", wpBuildTasks);
}else{
	gulp.task("build", buildTasks);
}

/*
* >>========================================>
* Development Tasks
* >>========================================>
*/

const wpDevTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	combineJS,
	compileWPSASS,
	compressDOM,
	startServer,
	watchForChanges
);

const devTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	combineJS,
	compileSASS,
	compressDOM,
	compressImg,
	startServer,
	watchForChanges
);

if(settings.type == 'wordpress') {
	gulp.task("develop", wpDevTasks);
}else{
	gulp.task("develop", devTasks);
}

/*
* >>========================================>
* Git Tasks
* >>========================================>
*/

const gitTasks = gulp.series(
	promptForSummary,
	gitAdd,
	gitCommitWithUserSummary,
	gitPush
);

gulp.task("commit", gitTasks);

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
	promptForDeploymentOptions,
	deployToServer
);

gulp.task("deploy", deploymentTasks);

