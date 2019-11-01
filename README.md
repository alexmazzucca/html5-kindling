# Kindling

## Configuration

  1. Open the Gulp configuration file ('gulpfile.js'), located in the root of the repository
  2. Specify a project type ('settings.type') [line 32]:
    1. 'static'
    2. 'email'
    3. 'wordpress'
  
### Please note:  
  
  1. When beginning a new WordPress project, you will be required to specify the site's address ('settings.address') for server configuration, a database name ('settings.database'), and a theme name (settings.theme) which will establish a path to the theme ('/wp-content/themes/your_theme_name') when compiling
  4. When beginning a new email project, you can optionally specify a remote image folder path ('settings.address'), which will be necessary for testing in Litmus
  
## Usage
  
  1. After the Configuration process is complete, run 'gulp setup' to copy appropriate template files to 'src'
  3. Run 'gulp build' to start a "Production Build"
  2. Run 'gulp dev' to produce a "Development Build"

Optionally, you can use VSCode Tasks to perform the aforementioned Gulp tasks by pressing Command+Shift+B.