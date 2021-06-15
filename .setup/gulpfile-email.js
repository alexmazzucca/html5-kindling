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

const paths = {
	styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/css/"
	},
	dom: {
		src: [
			"./src/**/*.html"
		],
		dest: "./dist/"
	},
	images: {
		src: "./src/img/**",
		dest: "./dist/img/"
	}
};

/*
* >>========================================>
* DOM Tasks
* >>========================================>
*/

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
	if(settings.url != '') {
		return gulp
			.src('./dist/index.html')
			.pipe(replace('src="img/', 'src="' + settings.url))
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
	if(settings.url === '' || settings.type == 'email') {
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
	gulp.watch(paths.dom.src, gulp.series(copyEmailDOM, liveReload));
	gulp.watch(paths.styles.src, gulp.series(compressSASS));
	gulp.watch(paths.images.src, {events: ['all']}, gulp.series(compressImg, liveReload));
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

gulp.task("build", emailBuildTasks);

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

gulp.task("develop", emailDevTasks);

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