![Kindling Logo](https://lh3.googleusercontent.com/9TtOLP-LI0CFfnhfwhSMh0qtlaUIhsk9upIe6uZeh7bu3ZNs-lw2s4jJA-YMgJcDJufOCEZBDn37M7bO5K7VPRHbxFpkb_94Zrii5uTJvLTqA-bDFdPv8tWYgAMkLwhNipLjfdi1i8ubyw9zkU2CmA2WrLdvWdiej0nZuqMbK8sn6_I9ISpXTkXVY1WMFsLzcP32IT-BlEfwQDjZSGaRHEbelbS9m9RECoCtVF4u60z4lPNtcrZoZsQqQ2vf6aztdw_VWJu4O28O4FKZTtnN0hVkUOfEPPP5I_-8BBlt4JO17R0Ohv2yH-RqomVrBDLOKVNQfSMfHctNAsvCIO2AxgWREB_NYD9UAsZuiCYCxwVI-iVNhVMSNOFDd-_xIE0PGzCX83ujQ38PEGAZ6YgdCthdI1x6GxrsRO8E0wiXL8wl323uVTo_-muUKmGfBnPwbr7MktqPDN-a-v4Fm2tUcnxsNXFqz9KP6NdanY7lplArYshrccyvGS4jQe3ewmo44oQMxw2PYU450ueHkf3EItdFnJjQGPobNUGUREK0g76847GzjjefLK0EjOdE0-G66-uy-WmFIvxp5FTTxBiOlHw1_yJ5yYI1lqojhjpesGDrbGMF7lae6kwgXsReHHLZf6EBqxXQ5RxcuOyqnD4dhhKLEfwmPhVMIpemGcgsZeedWklOrjozbvE=s200-no)

## Configuration
Please follow the following instructions to properly set up your project:
  1. Open the Gulp configuration file (./gulpfile.js)
  2. Specify a project type by modifying settings.type on line 32. Available options are:
	  a. "static"
	  b. "email"
	  c. "wordpress"
  
When beginning a new WordPress project, you will be required to specify:
  1. The site's address ('settings.address') for server configuration
  2. A database name ('settings.database')
  3. A theme name (settings.theme) which will establish a path to the theme ('/wp-content/themes/your_theme_name') when compiling

When beginning a new email project, you can optionally specify a remote image folder path ('settings.address'), which will be necessary for remote deployment
  
## Gulp Tasks

After the Configuration steps are complete, the following Gulp tasks will become available. Optionally, you can use VSCode build tasks (Command + Shift + B) to execute these tasks from the VSCode build menu.

### setup

Run 'gulp setup' to copy appropriate template files to the 'src' and 'dist' directories

### build

Run 'gulp build' to build the project without starting the server

### serve

Run 'gulp serve' to start the server and associated folder 'watch' tasks

### database

Run 'gulp database' to export a copy of the project's database ('settings.database') into the root of the repo
