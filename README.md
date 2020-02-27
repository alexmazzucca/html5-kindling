<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

# Kindling v2.0

This project is based on Kindling ([https://github.com/alexmazzucca/kindling/](https://github.com/alexmazzucca/kindling)): a starting point for static website, WordPress and email development. The following instructions assume a basic knowledge of npm and gulp.js

**Please follow the following instructions to properly set up your project:**

  1. In the terminal go to the root folder of your new project
  2. Download required node modules by running `npm i`
  3. Run `gulp setup` or use the VSCode build task called 'Setup' to begin
  
## Setup

### `gulp setup`*

<b>Run this command first.</b> This command will copy appropriate files from [kindling/setup](/setup) to the [kindling/src](/src) and [kindling/dist](/dist) directories. Please note, this task will become disabled after it is executed for the first time. 'Setup' will also no longer appear as a build task in VSCode.

**A note about working with email projects:**

During the setup process, you can specify an absolute path for images by providing a Development URL when prompted. This will update all image paths in your compiled HTML automatically when the project is built. For example, by specifying `'http://yoursite.com/'` as the URL, image source attributes will change from `src="img/spacer.gif"` to `src="http://yoursite.com/img/spacer.gif"`.
  
## Gulp Tasks

Once the setup process is complete, the following tasks will be enabled (see below). These tasks can be run via CLI or as VSCode build tasks (Command + Shift + B).

### `gulp build`*

Run this command to build the project to [kindling/dist](/dist).

### `gulp serve`*

Run this command to build the project and start the server with associated `gulp.watch` tasks.

### `gulp database`*

Run this command to export a copy of the project's database to [kindling/](/).

*You must run the 'Setup' build task in VSCode to see this task as an available build option.
