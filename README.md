<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

# Kindling v2.5

This project is based on Kindling ([https://github.com/alexmazzucca/kindling/](https://github.com/alexmazzucca/kindling)): a starting point for static website, WordPress and email development. The following instructions assume a basic knowledge of npm and gulp.js
  
## Setup

**Please follow the following instructions to properly set up your project:**

  1. In the terminal, go to the root folder of your new project
  2. Download required node modules by running `npm i`
  3. Run `gulp setup` or use the VSCode build task called 'Setup' to begin (⇧⌘B).

### `gulp setup`

This command will lead you through a series of prompts which will help you set up your new project appropriately. If you'd like to change a setting after the setup process has been completed, you can edit the `settings.json` file located in the root of your project's directory.

This command will also create appropriate starter files depending on the project type that you select. These files will be moved to [kindling/src](/src) and [kindling/dist](/dist) directories where appropriate.

**A note about working with email projects:**

During the setup process, you can specify an absolute path for images by specifying a Development URL. This will update all image paths in your compiled HTML automatically when the project is built. For example, by specifying `'http://yoursite.com/'` as the URL, image source attributes will change from `src="img/spacer.gif"` to `src="http://yoursite.com/img/spacer.gif"`.
  
## Build Tasks

Once the setup process is complete, the following tasks will be enabled. These tasks can be run via CLI or via the VSCode build tasks menu.

### `gulp build`*

Run this command to build the project to [kindling/dist](/dist).

### `gulp serve`*

Run this command to build the project and start the server with associated `gulp.watch` tasks.

### `gulp database`*

Run this command to export a copy of the project's database to [kindling/](/).