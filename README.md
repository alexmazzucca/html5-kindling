<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

# Kindling v3

This project is based on Kindling ([https://github.com/alexmazzucca/kindling/](https://github.com/alexmazzucca/kindling)): a starting point for static website, WordPress and email development. The following instructions assume a basic knowledge of npm and gulp.js
  
## Setup

**Please follow the following instructions to properly set up your project:**

  1. Using the CLI of your choice, navigate to the 'src' folder of your new project
  2. Download required node modules by running `npm i`
  3. Run `gulp setup` or use the VSCode build task called 'Setup' to begin (⇧⌘B).

### `gulp setup`

This command will lead you through a series of prompts which will help you set up your new project appropriately. If you'd like to change a setting after the setup process has been completed, you can edit the `settings.json` file located in the root folder of your new project.

This command will create appropriate template files for your new project depending on the project type that you select. These template files will be moved to the [./src](/src) and [./dist](/dist) directories where appropriate.

Once the setup process has been completed, the project will be automatically committed with a summary of "Initial commit" and pushed to the project's Git repo.

**A note about working with email projects:**

During the setup process, you can specify an absolute path for images by providing a "Development URL" when prompted. This will update all image paths in your compiled HTML automatically when the project is built. For example, by specifying `'http://yoursite.com/images/'` as the URL, image source attributes will change from `src="img/spacer.gif"` to `src="http://yoursite.com/images/spacer.gif"`.
  
## Available Tasks

Once the setup process is complete, the following tasks will be enabled depending on your project type. These tasks can be run via CLI or via the VSCode build tasks menu (⇧⌘B).

### `gulp build`

This task will appear as "Build" in the VSCode build task menu. Once executed, this command will compile and compress project files (CSS, JS, PNG, JPG, etc.). A copy of the project's database (if available) will export to the root directory. All changes will be automatically timestamped and committed to the project's Git repo. The timestamped commit will be automatically pushed.

### `gulp develop`

This task will appear as "Start Server" in the VSCode build task menu. Once executed, this command will start a local development server. It will concatenate and compile JS files, but it will not compress them, allowing for faster load times and readility for debugging. SASS will be compiled without compression, and a sourcemap will be created for debugging purposes. Images will not be compressed.

Gulp will then watch for changes in the ".src/" directory and process them accordingly. Your browser will be automatically refreshed when a change is detected.

### `gulp deploy`

This task will appear as "Deploy" in the VSCode build task menu. Once executed, this command will upload files to the Production or Staging environments that were specified during the setup process.
