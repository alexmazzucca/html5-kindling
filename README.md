## Configuration

  1. Open the Gulp configuration file ('gulpfile.js'), located in the root of the repository
  2. Specify a project type ('settings.type') [line 32]:
    1. static
    2. email
    3. wordpress
  
### Please note:  
  
When beginning a new WordPress project, you will be required to specify:
  1. The site's address ('settings.address') for server configuration
  2. A database name ('settings.database')
  3. A theme name (settings.theme) which will establish a path to the theme ('/wp-content/themes/your_theme_name') when compiling

When beginning a new email project, you can optionally specify a remote image folder path ('settings.address'), which will be necessary for remote deployment
  
## Available Tasks

After the Configuration steps are complete, the following Gulp tasks will become available. Optionally, you can use VSCode build tasks (Command + Shift + B) to execute these tasks from the VSCode build menu.

### setup

Run 'gulp setup' to copy appropriate template files to the 'src' and 'dist' directories

### build

Run 'gulp build' to build the project without starting the server

### serve

Run 'gulp serve' to start the server and associated folder 'watch' tasks

### database

Run 'gulp database' to export a copy of the project's database ('settings.database') into the root of the repo