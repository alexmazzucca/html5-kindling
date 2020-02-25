var settings = {
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

const c = require('ansi-colors');
const del = require("del");

/*
* >>========================================>
* Setup Tasks
* >>========================================>
*/

function promptForPackageInfo(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([{
			type: 'input',
			name: 'name',
			message: 'Please enter the name of the project...'
		},
		{
			type: 'input',
			name: 'description',
			message: 'Please enter a description of the project...'
		},
		{
			type: 'input',
			name: 'repo',
			message: "Please enter the URL for the project's GitHub repository..."
		},
		{
			type: 'input',
			name: 'author',
			message: "Please enter the author's name..."
		}], function(res){
			renameWorkspaceFile(res.name);
			changePackageName(res.name);
			changePackageDescription(res.description);
			changePackageRepo(res.repo);
			cb();
		}))
		.pipe(gulp.dest('./'))
}

function renameWorkspaceFile(packageName){
	return gulp.src('./kindling.code-workspace')
		.pipe(rename(function (path) {
			path.basename = packageName;
		}))
		.pipe(gulp.dest('./'))
}

function changePackageName(packageName){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'name',
			value: packageName
		}))
		.pipe(gulp.dest('./'))
}

function changePackageRepo(packageRepo){
	return gulp.src('./package.json')
		.pipe(jsonModify([{
			key: 'repository.url',
			value: packageRepo
		},
		{
			key: 'url',
			value: packageRepo
		}
		]))
		.pipe(gulp.dest('./'))
}

function changePackageDescription(projectDescription){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'description',
			value: projectDescription
		}))
		.pipe(gulp.dest('./'))
}

const removeWorkspaceFile = () => del(['./kindling.code-workspace']);

function promptForProjectInfo(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt({
			type: 'list',
			name: 'type',
			message: 'Please enter the project type...',
			choices: ['email', 'static', 'wordpress']
		}, function(res){
			if(res.type == 'wordpress') {
				return gulp
					.pipe(prompt.prompt(
						[{
							type: 'input',
							name: 'address',
							message: 'Please enter a development URL...'
						},
						{
							type: 'input',
							name: 'database',
							message: 'Please enter a database name...'
						},
						{
							type: 'input',
							name: 'theme',
							message: 'Please enter a theme name...'
						}]
					), function(res){
						settings.type = res.type;
						settings.address = res.address;
						settings.database = res.database;
						settings.theme = res.theme;

						// cb();
					})
			}else{
				settings.type = res.type;

				// cb();
			}
		}))

		cb();
}

function changeProjectSettings(){
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
		.pipe(gulp.dest('./'))
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
		git.clone('https://github.com/WordPress/WordPress/releases/latest', {args: './dist'}, function(err){
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
	promptForPackageInfo,
	removeWorkspaceFile,
	promptForProjectInfo,
	changeProjectSettings,
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