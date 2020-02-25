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

const c = require('ansi-colors');
const del = require("del");
const path = require('path');

/*
* >>========================================>
* Setup Tasks
* >>========================================>
*/

function promptForPackageDescription(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([{
			type: 'input',
			name: 'description',
			message: 'Please enter a description of the project...'
		}], function(res){
			settings.description = res.description;
			cb();
		}))
		.pipe(gulp.dest('./'))
}

function setAdditionalPackageInfo(){
	settings.author = getRepoInfo().author;
	settings.name = path.basename(process.cwd());
	(async() => {
		settings.repo = await gitRemoteOriginUrl();
	})();
}

function renameWorkspaceFile(){
	return gulp.src('./kindling.code-workspace')
		.pipe(rename(function (path) {
			path.basename = settings.name;
		}))
		.pipe(gulp.dest('./'))
}

function changePackageName(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'name',
			value: settings.name
		}))
		.pipe(gulp.dest('./'))
}

function changePackageDescription(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'description',
			value: settings.description
		}))
		.pipe(gulp.dest('./'))
}

function changePackageRepo(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'repository.url',
			value: settings.repo
		}))
		.pipe(gulp.dest('./'))
}

function changePackageAuthor(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'author',
			value: settings.author
		}))
		.pipe(gulp.dest('./'))
}

const removeWorkspaceFile = () => del(['./kindling.code-workspace']);

function promptForProjectType(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt({
			type: 'list',
			name: 'type',
			message: 'Please enter the project type...',
			choices: ['email', 'static', 'wordpress']
		}, function(res){
			settings.type = res.type;
			cb();
		}))
}

function changeProjectType(cb){
	return gulp.src('./.setup/settings.json')
		.pipe(jsonModify({
				key: 'type',
				value: settings.type
			}))
		.pipe(gulp.dest('./'));
	
	cb();
}

function promptForAddressInfo(cb){
	return gulp.src('./settings.json')
		.pipe(prompt.prompt({
				type: 'input',
				name: 'address',
				message: 'Please enter a remote URL...'
		}), function(res){
			settings.address = res.address;
			cb();
		})
}

function changeProjectAddress(cb){
	return gulp.src('./settings.json')
		.pipe(jsonModify({
				key: 'address',
				value: settings.type
			}))
		.pipe(gulp.dest('./'));

	cb();
}

function promptForDatabaseInfo(cb){
	if(settings.type == 'wordpress'){
		return gulp.src('./settings.json')
			.pipe(prompt.prompt({
				type: 'input',
				name: 'database',
				message: 'Please enter a database name...'
			}), function(res){
				settings.database = res.database;
				cb();
			})
	}else{
		cb();
	}
}

function changeProjectDatabase(cb){
	return gulp.src('./settings.json')
		.pipe(jsonModify({
				key: 'database',
				value: settings.database
			}))
		.pipe(gulp.dest('./'));

	cb();
}

function promptForWordpressTheme(cb){
	if(settings.type == 'wordpress'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
				{
					type: 'input',
					name: 'theme',
					message: 'Please enter a theme name...'
			}], function(res){
				settings.theme = res.theme;
				cb();
			}));
	}else{
		cb();
	}
}

function changeProjectTheme(cb){
	return gulp.src('./settings.json')
		.pipe(jsonModify({
				key: 'theme',
				value: settings.theme
			}))
		.pipe(gulp.dest('./'))

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
	}
	cb();
}

function modifyNotificationIcon(cb){
	return gulp
		.src('./.setup/Terminal.icns')
		.pipe(gulp.dest('./node_modules/node-notifier/vendor/mac.noindex/terminal-notifier.app/Contents/Resources/'))
	cb();
}

function updateBuildTasks(cb){
	return gulp
		.src('./.setup/tasks.json')
		.pipe(gulp.dest('./.vscode/'))
	cb();
}

const removeSetupFiles = () => del(['./.setup']);

/*
* >>========================================>
* Setup Tasks
* >>========================================>
*/

const setupProject = gulp.series(
	promptForPackageDescription,
	setAdditionalPackageInfo,
	renameWorkspaceFile,
	removeWorkspaceFile,
	changePackageName,
	changePackageDescription,
	changePackageRepo,
	changePackageAuthor,
	promptForProjectType,
	changeProjectType,
	promptForAddressInfo,
	changeProjectAddress,
	promptForDatabaseInfo,
	changeProjectDatabase,
	promptForWordpressTheme,
	changeProjectTheme,
	copyGulpFileToRoot,
	copyTemplateAssetsToSrc,
	copyTemplateFilesToSrc,
	copyTemplateFilesToDist,
	cloneWP,
	modifyNotificationIcon,
	updateBuildTasks,
	removeSetupFiles
);

gulp.task("setup", setupProject);