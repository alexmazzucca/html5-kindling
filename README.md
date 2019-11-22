![Kindling Logo](https://lh3.googleusercontent.com/9TtOLP-LI0CFfnhfwhSMh0qtlaUIhsk9upIe6uZeh7bu3ZNs-lw2s4jJA-YMgJcDJufOCEZBDn37M7bO5K7VPRHbxFpkb_94Zrii5uTJvLTqA-bDFdPv8tWYgAMkLwhNipLjfdi1i8ubyw9zkU2CmA2WrLdvWdiej0nZuqMbK8sn6_I9ISpXTkXVY1WMFsLzcP32IT-BlEfwQDjZSGaRHEbelbS9m9RECoCtVF4u60z4lPNtcrZoZsQqQ2vf6aztdw_VWJu4O28O4FKZTtnN0hVkUOfEPPP5I_-8BBlt4JO17R0Ohv2yH-RqomVrBDLOKVNQfSMfHctNAsvCIO2AxgWREB_NYD9UAsZuiCYCxwVI-iVNhVMSNOFDd-_xIE0PGzCX83ujQ38PEGAZ6YgdCthdI1x6GxrsRO8E0wiXL8wl323uVTo_-muUKmGfBnPwbr7MktqPDN-a-v4Fm2tUcnxsNXFqz9KP6NdanY7lplArYshrccyvGS4jQe3ewmo44oQMxw2PYU450ueHkf3EItdFnJjQGPobNUGUREK0g76847GzjjefLK0EjOdE0-G66-uy-WmFIvxp5FTTxBiOlHw1_yJ5yYI1lqojhjpesGDrbGMF7lae6kwgXsReHHLZf6EBqxXQ5RxcuOyqnD4dhhKLEfwmPhVMIpemGcgsZeedWklOrjozbvE=s200-no)

*The following instructions assume a basic knowledge of npm,  gulp.js and my brain.*
## Configuration
**Please follow the following instructions to properly set up your project:**
  1. Open the Gulp configuration file (./gulpfile.js)
  2. Specify a project type by modifying settings.type on line 7. Available options are:
              a. `const settings = {type: 'static'}`
              b. `const settings = {type: 'email'}`
              c. `const settings = {type: 'wordpress'}`

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
