<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

# Kindling v2.5

This project is based on Kindling ([https://github.com/alexmazzucca/kindling/](https://github.com/alexmazzucca/kindling)): a starting point for static website, WordPress and email development. The following instructions assume a basic knowledge of npm and gulp.js
  
## Setup

**Please follow the following instructions to properly set up your project:**

  1. In the terminal, go to the root folder of your new project
  2. Download required node modules by running `npm i`
  3. Run `gulp setup` or use the VSCode build task called 'Setup' to begin (⇧⌘B).

### `gulp setup`

This command will lead you through a series of prompts which will help you set up your new project appropriately. If you'd like to change a setting after the setup process has been completed, you can edit the `settings.json` file located in the root folder of your new project.

This command will create appropriate starter files for your new project depending on the project type that you select. These starter files will be moved to [./src](/src) and [./dist](/dist) directories as needed.

**A note about working with email projects:**

During the setup process, you can specify an absolute path for images by providing a "Development URL" when prompted. This will update all image paths in your compiled HTML automatically when the project is built. For example, by specifying `'http://yoursite.com/'` as the URL, image source attributes will change from `src="img/spacer.gif"` to `src="http://yoursite.com/img/spacer.gif"`.
  
## Build Tasks

Once the setup process is complete, the following tasks will be enabled. These tasks can be run via CLI or via the VSCode build tasks menu (⇧⌘B).

### `gulp build`

This task will appear as "Build" in the VSCode build task menu. Once executed, this command will compress the project's CSS files and uglify JS files, preparing your project for deployment.

### `gulp develop`

This task will appear as "Develop" in the VSCode build task menu. Once executed, this command will start a local development server. It will concatenate and compile JS files, but it will not compress them, allowing for faster load times and readility.

Gulp will watch for changes in the following files and directories and process them accordingly. After the changes have been recognized, your browser will be automatically refreshed:

1. "./src/js/vendor/*.js"
2. "./src/js/main.js"
3. "./src/scss/*.scss"
4. "./src/**/*.html",
5. "./src/**/*.php"
6. "./src/img/*"

### `gulp database`

This task will appear as "Backup Database" in the VSCode build task menu. Once executed, this command will export a copy of the project's database to the root folder of your new project.