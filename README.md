<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

*The following instructions assume a basic knowledge of npm,  gulp.js and my brain.*
## Configuration
**Please follow the following instructions to properly set up your project:**
  1. Open the Gulp configuration file (./gulpfile.js)
  2. Specify a project type by modifying settings.type on line 7. Available options are:
  * `const settings = {type: 'static'}`
  * `const settings = {type: 'email'}`
  * `const settings = {type: 'wordpress'}`

**When beginning a new WordPress project:**
  1. Specify your site's address `const settings = {address: 'YOUR_URL'}`
  2. Specify a database name `const settings = {database: 'DB_NAME'}`
  3. Specify a theme name `const settings = {theme: 'THEME_NAME'}`

**When beginning a new email project:**

You can specify an absolute remote image path by modifying `settings.address` This will update image paths by adding the specified address to the beginning of the images' `src` attribute
  
## Gulp Tasks

After the Configuration steps are complete, the following Gulp tasks will become available. Optionally, you can use VSCode build tasks (Command + Shift + B) to execute these tasks from the VSCode build menu.

### `gulp setup`

Run this command to copy appropriate template files from [kindling/templates](/templates) to the [kindling/src](/src) and [kindling/dist](/dist) directories

### `gulp build`

Run this command to build the project to [kindling/dist](/dist)

### `gulp serve`

Run this command to build the project and start the server with associated `gulp.watch` tasks

### `gulp database`

Run this command to export a copy of the project's database to [kindling/](/)
