# Kindling

## Configuration

  1. Open the Gulp configuration file ('gulpfile.js'), located in the root of the repository
  2. Specify a project type ('settings.type') [line 32]:
    1. 'static'
    2. 'email'
    3. 'wordpress'
  
### Please note:  
  
  1. When beginning a new WordPress project, you will be required to specify the site's address ('settings.address') for server configuration, a database name ('settings.database'), and a theme name (settings.theme) to establish a path when compiling
  4. When beginning a new email project, you can optionally specify a remote image folder path ('settings.address'), which will be necessary when compiling for testing in Litmus.
  
## Usage
  
  1. After the Configuration process is complete, run 'gulp setup' to copy appropriate template files to 'src'
  3. Run 'gulp build' to produce a production build of the project in 'dist'
  2. Run 'gulp dev' to produce a development build of the project in 'dist'

  << Further instructional material(s): Pending >>