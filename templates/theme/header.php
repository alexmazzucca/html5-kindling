<!doctype html>
<html class="no-js" lang="">
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

		<link href="https://fonts.googleapis.com/css?family=Barlow:400,600,700" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

		<?php wp_head(); ?>

	</head>

	<body <?php body_class(); ?>>

		<!--
		>>================================================================================>
		Primary Navigation
		>>================================================================================>
		-->

		<nav class="primary">
			<?php wp_nav_menu(array(
				'menu' => 'Primary'
			)); ?>
		</nav>

		<!--
		>>================================================================================>
		Buttons
		>>================================================================================>
		-->

		<button class="menu-toggle">
			<span class="label">Menu</span>		
			<span class="icon">
				<span class="symbol">
					<span class="line"></span>
					<span class="line"></span>
					<span class="line"></span>
				</span>
			</span>		
		</button>

		<!--
		>>================================================================================>
		Main Page Content
		>>================================================================================>
		-->

		<main>

			<!--
			>>================================================================================>
			Main Header
			>>================================================================================>
			-->

			<header class="main">
				<div class="container">
					<h1 class="site-logo">
						<a href="/">
							<img src="<?php echo get_template_directory_uri() . '/img/logo.svg'; ?>" alt="Company Name">
							<span>Company Name</span>
						</a>
					</h1>
				</div>
			</header>