var settings = {
	title: '',
	repo: '',
	repoURL: '',
	description: '',
	type: '',
	address: '',
	database: '',
	theme: '',
	author: '',
	server: '',
	staging: '',
	staging_host: '',
	staging_username: '',
	staging_password: '',
	live_host: '',
	live_username: '',
	live_password: ''
};

/*
* >>========================================>
* Required
* >>========================================>
*/

var gulp = require("gulp");
var git = require('gulp-git');
var rename = require("gulp-rename");
var prompt = require('gulp-prompt');
var notify = require("gulp-notify");
var jsonModify = require("gulp-json-modify");
var getRepoInfo = require('git-repo-info');
var replace = require('gulp-replace');

const gitRemoteOriginUrl = require('git-remote-origin-url');
const del = require("del");
const path = require('path');
const notifier = require('node-notifier');

/*
* >>========================================>
* Setup Tasks
* >>========================================>
*/

function initialPromptForProjectInfo(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'Project type:',
			choices: ['email', 'static', 'wordpress'],
		},
		{
			type: 'input',
			name: 'title',
			message: 'Project title:'
		},
		{
			type: 'input',
			name: 'description',
			message: 'Project description:'
		},
		{
			type: 'input',
			name: 'address',
			message: 'Development URL (include protocol and trailing slash) (optional):'
		},
		{
			type: 'input',
			name: 'server',
			message: 'Would you like to configure deployment server(s)?'
			choices: ['yes', 'no'],
		}
		], function(res){
			settings.title = res.title;
			settings.type = res.type;
			settings.description = res.description;
			settings.address = res.address;
			settings.server = res.server;
			cb();
		}))
		.pipe(gulp.dest('./'))
}

function promptForSiteDetails(cb){
	if(settings.type == 'wordpress' || settings.type == 'static'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'database',
				message: 'Database name (optional):'
			}
			], function(res){
				settings.database = res.database;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForWordpressDetails(cb){
	if(settings.type == 'wordpress'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'theme',
				message: 'Wordpress theme name:'
			}
			], function(res){
				settings.theme = res.theme;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForInitialDeployentDetails(cb){
	if(settings.server == 'yes'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'staging',
				message: 'Is there a staging environment for this site?',
				choices: ['yes', 'no']
			}
			], function(res){
				settings.staging = res.staging;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForStagingDeployentDetails(cb){
	if(settings.staging == 'yes'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'host',
				message: 'Staging FTP Host:'
			},
			{
				type: 'input',
				name: 'username',
				message: 'Staging FTP Username:'
			},
			{
				type: 'input',
				name: 'password',
				message: 'Staging FTP Password:'
			}
			], function(res){
				settings.staging_host = res.host;
				settings.staging_username = res.username;
				settings.staging_password = res.password;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}


function promptForLiveDeployentDetails(cb){
	if(settings.server == 'yes'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'host',
				message: 'Live FTP Host:'
			},
			{
				type: 'input',
				name: 'username',
				message: 'Live FTP Username:'
			},
			{
				type: 'input',
				name: 'password',
				message: 'Live FTP Password:'
			}
			], function(res){
				settings.live_host = res.host;
				settings.live_username = res.username;
				settings.live_password = res.password;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function updateAdditionalProjectInfo(cb){
	settings.author = getRepoInfo().author;
	settings.repo = path.basename(process.cwd());
	(async() => {
		settings.repoURL = await gitRemoteOriginUrl();
	})();
	cb();
}

function renameWorkspaceFile(){
	return gulp.src('./kindling.code-workspace')
		.pipe(rename(function (path) {
			path.basename = settings.repo;
		}))
		.pipe(gulp.dest('./'))
}

function updatePackageInfo(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'name',
			value: settings.repo
		}))
		.pipe(jsonModify({
			key: 'description',
			value: settings.description
		}))
		.pipe(jsonModify({
			key: 'repository.url',
			value: settings.repoURL
		}))
		.pipe(jsonModify({
			key: 'author',
			value: settings.author
		}))
		.pipe(gulp.dest('./'))
}

const removeWorkspaceFile = () => del(['./kindling.code-workspace']);

function updateProjectSettings(cb){
	return gulp.src('./.setup/settings.json')
		.pipe(jsonModify({
			key: 'type',
			value: settings.type
		}))
		.pipe(jsonModify({
			key: 'address',
			value: settings.address
		}))
		.pipe(jsonModify({
			key: 'database',
			value: settings.database
		}))
		.pipe(jsonModify({
			key: 'theme',
			value: settings.theme
		})),
		.pipe(jsonModify({
			key: 'staging_host',
			value: settings.staging_host
		}))
		.pipe(jsonModify({
			key: 'staging_username',
			value: settings.staging_username
		}))
		.pipe(jsonModify({
			key: 'staging_password',
			value: settings.staging_password
		}))
		.pipe(jsonModify({
			key: 'live_host',
			value: settings.staging_host
		}))
		.pipe(jsonModify({
			key: 'live_username',
			value: settings.staging_username
		}))
		.pipe(jsonModify({
			key: 'live_password',
			value: settings.staging_password
		}))
		.pipe(gulp.dest('./'));
	
	cb();
}

function copyGulpFileToRoot(){
	return gulp
		.src('./.setup/gulpfile.js')
		.pipe(gulp.dest('./'));
}

function copyTemplateFilesToSrc(){
	return gulp
		.src([
			'./.setup/templates/' + settings.type +  '/**/*',
			'!./.setup/templates/static/robots.txt',
			'!./.setup/templates/static/.htaccess'
		])
		.pipe(gulp.dest('./src/'));
}

function delTempSrcFiles(cb) {
	return del('./src/*');

	cb();
}

function copyTemplateAssetsToSrc(cb){
	if(settings.type == 'static' || settings.type == 'wordpress'){
		return gulp
			.src([
				'./.setup/templates/scss*/**/*',
				'./.setup/templates/js*/**/*'
			])
			.pipe(gulp.dest('./src/'));
	}
	cb();
}

function copyTemplateFilesToDist(cb){
	if(settings.type == 'static'){
		return gulp
			.src([
				'./.setup/templates/static/.htaccess',
				'./.setup/templates/static/robots.txt'
			])
			.pipe(gulp.dest('./dist/'));
	}
	cb();
}

function cloneWP(cb){
	if(settings.type == 'wordpress'){
		git.clone('https://github.com/WordPress/WordPress/', {args: './dist'}, function(err){
			if(err) throw err;
		});
		cb();
	}else{
		cb();
	}
}

function changeNotificationIcon(cb){
	return gulp
		.src('./.setup/Terminal.icns')
		.pipe(gulp.dest('./node_modules/node-notifier/vendor/mac.noindex/terminal-notifier.app/Contents/Resources/'))
	cb();
}

function updateBuildTasks(cb){
	if(settings.database != ''){
		return gulp
			.src('./.setup/tasks-database.json')
			.pipe(rename(function (path) {
				path.basename = 'tasks';
			}))
			.pipe(gulp.dest('./.vscode/'))
		cb();
	}else{
		return gulp
			.src('./.setup/tasks.json')
			.pipe(gulp.dest('./.vscode/'))
		cb();
	}
}

function updateREADME(cb){
	return gulp.src(['./.setup/README.md'])
		.pipe(replace('<title>', settings.title))
		.pipe(replace('<description>', settings.description))
		.pipe(replace('<type>', settings.type))
		.pipe(gulp.dest('./'));

	cb();
}

const delSetupFiles = () => del(['./.setup']);

function setupComplete(cb){
	notifier.notify({
		title: 'Kindling',
		message: 'Project successfully configured',
		icon: 'undefined',
		contentImage: 'undefined'
	});

	cb();
}

/*
* >>========================================>
* Setup Task Series
* >>========================================>
*/

const setupProject = gulp.series(
	initialPromptForProjectInfo,
	promptForSiteDetails,
	promptForWordpressDetails,
	promptForInitialDeployentDetails,
	promptForStagingDeployentDetails,
	promptForLiveDeployentDetails,
	updateAdditionalProjectInfo,
	renameWorkspaceFile,
	removeWorkspaceFile,
	updatePackageInfo,
	updateProjectSettings,
	copyGulpFileToRoot,
	delTempSrcFiles,
	copyTemplateAssetsToSrc,
	copyTemplateFilesToSrc,
	copyTemplateFilesToDist,
	cloneWP,
	changeNotificationIcon,
	updateBuildTasks,
	updateREADME,
	delSetupFiles,
	setupComplete
);

gulp.task("setup", setupProject);