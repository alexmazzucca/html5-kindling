<!doctype html>
<?php echo '<html class="no-js" lang="en">'; ?>
    <head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<title><?php wp_title(''); ?></title>
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--Icons-->

		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/favicons/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/favicons/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/favicons/favicon-16x16.png">
		<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/favicons/site.webmanifest">
		<link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/favicons/safari-pinned-tab.svg" color="#0f034e">
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicons/favicon.ico">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-config" content="<?php echo get_template_directory_uri(); ?>/favicons/browserconfig.xml">
		<meta name="theme-color" content="#ffffff">

		<!--Fonts-->

		<?php wp_head(); ?>

	</head>

	<?php echo '<body '; ?><?php body_class(); ?><?php echo '>'; ?>

		<!--[if lte IE 9]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/" target="_blank" rel="noopener">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]-->

		<!--
		>>================================================================================>
		Primary Navigation
		>>================================================================================>
		-->

		<?php wp_nav_menu(array(
			'menu' => 'Primary'
		)); ?>

		<!--
		>>================================================================================>
		Burger
		>>================================================================================>
		-->

		<button id="burger" aria-label="Click to expand full site navigation">
			<span class="line"></span>
			<span class="line"></span>
			<span class="line"></span>
		</button>

		<!--
		>>================================================================================>
		Main Page Content
		>>================================================================================>
		-->

		<?php echo '<main>'; ?>

			<!--
			>>================================================================================>
			Main Header
			>>================================================================================>
			-->

			<header id="main-header">
				<div class="container">
					<h1 class="site-logo">
						<a href="/">
							<img src="<?php echo get_template_directory_uri() . '/img/logo.svg'; ?>" alt="Site Name">
							<span>Site Name</span>
						</a>
					</h1>
				</div>
			</header>