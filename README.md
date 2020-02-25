<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

# Kindling v2.0

This project is based on Kindling ([https://github.com/alexmazzucca/kindling/](https://github.com/alexmazzucca/kindling)): a starting point for static website, WordPress and email development. The following instructions assume a basic knowledge of npm and gulp.js
## Configuration
**Please follow the following instructions to properly set up your project:**
  1. In the terminal go to the root folder of your new project
  1. Download required node modules by running `npm i`
  2. Open the Gulp configuration file (./gulpfile.js)
  3. Specify a project type by modifying `type` on line 8. Available options are:
  * `type: 'static'`
  * `type: 'email'`
  * `type: 'wordpress'`

**When beginning a new WordPress project:**
  1. Specify the website's address by modifying `address` on line 9. Please include necessary protocol and trailing slash.
  2. Specify your local database name by modifying `database` on line 10.
  3. Specify the name of your theme folder name by modifying `theme` on line 11.

**When beginning a new email project:**

You can specify an absolute image path by modifying `address` on line 9. This will update all image paths in your compiled HTML automatically. For example, by specifying `address = 'http://yoursite.com/'`, image paths will change from `src="img/spacer.gif"` to `src="http://yoursite.com/img/spacer.gif"` when the project is built.
  
## Gulp Tasks

The following tasks can be run via CLI or as VSCode build tasks (Command + Shift + B).

### `gulp setup`

<b>Run this command first.</b> This command will copy appropriate files from [kindling/setup](/setup) to the [kindling/src](/src) and [kindling/dist](/dist) directories. Please note, after running this command, 'Setup' will no longer appear as a build task in VSCode.

### `gulp build`*

Run this command to build the project to [kindling/dist](/dist).

### `gulp serve`*

Run this command to build the project and start the server with associated `gulp.watch` tasks.

### `gulp database`*

Run this command to export a copy of the project's database to [kindling/](/).

*Please note, you must run the 'Setup' build task in VSCode to see this task as an available option.
