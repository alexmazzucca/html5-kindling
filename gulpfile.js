var settings = {
	name: '',
	description: '',
	repo: '',
	type: '',
	address: '',
	database: '',
	theme: ''
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
			name: 'description',
			message: 'Project description:'
		},
		{
			type: 'input',
			name: 'address',
			message: 'Development URL (include protocol and trailing slash) (optional):'
		}
		], function(res){
			settings.type = res.type;
			settings.description = res.description;
			settings.address = res.address;
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

function updateAdditionalProjectInfo(cb){
	settings.author = getRepoInfo().author;
	settings.name = path.basename(process.cwd());
	(async() => {
		settings.repo = await gitRemoteOriginUrl();
	})();
	cb();
}

function renameWorkspaceFile(){
	return gulp.src('./kindling.code-workspace')
		.pipe(rename(function (path) {
			path.basename = settings.name;
		}))
		.pipe(gulp.dest('./'))
}

function updatePackageInfo(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'name',
			value: settings.name
		}))
		.pipe(jsonModify({
			key: 'description',
			value: settings.description
		}))
		.pipe(jsonModify({
			key: 'repository.url',
			value: settings.repo
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

function modifyNotificationIcon(cb){
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

const removeSetupFiles = () => del(['./.setup']);

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
	updateAdditionalProjectInfo,
	renameWorkspaceFile,
	removeWorkspaceFile,
	updatePackageInfo,
	updateProjectSettings,
	copyGulpFileToRoot,
	copyTemplateAssetsToSrc,
	copyTemplateFilesToSrc,
	copyTemplateFilesToDist,
	cloneWP,
	modifyNotificationIcon,
	updateBuildTasks,
	removeSetupFiles,
	setupComplete
);

gulp.task("setup", setupProject);