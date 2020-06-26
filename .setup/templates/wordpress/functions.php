<?php

	/*
	>>================================================================================>
	Add ACF Options Page
	>>================================================================================>
	*/

	// if( function_exists('acf_add_options_page') ) {
	// 	acf_add_options_page(array(
	// 		'page_title' => 'Options',
	// 		'icon_url' => 'dashicons-align-right',
	// 	));
	// }

	/*
	>>================================================================================>
	Remove Emojis
	>>================================================================================>
	*/

	remove_action( 'wp_head', 'print_emoji_detection_script', 7 ); 
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' ); 
	remove_action( 'wp_print_styles', 'print_emoji_styles' ); 
	remove_action( 'admin_print_styles', 'print_emoji_styles' );

	/*
	>>================================================================================>
	Add styles to editor window
	>>================================================================================>
	*/

	function mytheme_block_editor_styles() {
	    wp_enqueue_style( 'mytheme-block-editor-styles', get_theme_file_uri( '/editor-style.css' ), false, '1.0', 'all' );
	}

	add_action( 'enqueue_block_editor_assets', 'mytheme_block_editor_styles' );

	/*
	>>================================================================================>
	Add support for Featured Image
	>>================================================================================>
	*/

	add_theme_support('post-thumbnails');

	/*
	>>================================================================================>
	Add support for custom menus
	>>================================================================================>
	*/

	register_nav_menus();

	/*
	>>================================================================================>
	Add additional mime types (SVG)
	>>================================================================================>
	*/

	// function cc_mime_types($mimes) {
	// 	$mimes['svg'] = 'image/svg+xml';
	// 	return $mimes;
	// }

	// add_filter('upload_mimes', 'cc_mime_types');

	/*
	>>================================================================================>
	Add Custom Post Types
	>>================================================================================>
	*/

	/*

	add_action( 'init', 'create_post_type' );

	function create_post_type() {
		register_post_type( 'case_study',
			array(
				'labels' => array(
				'name' => __( 'Case Studies' ),
				'singular_name' => __( 'Case Study' )
			),
			'has_archive' => true,
			'public' => true,
			'rewrite' => array(
				'slug' => 'case-studies'
			),
			'menu_icon'   => 'dashicons-portfolio',
			'supports' => array('title','editor','thumbnail', 'revisions','excerpt')
			)
		);
	}

	*/

	/*
	>>================================================================================>
	Include files in <head>
	>>================================================================================>
	*/

	function theme_scripts() {
		wp_enqueue_style( 'main-styles', get_stylesheet_uri(), '', '1' );
		wp_enqueue_script( 'main-scripts', get_template_directory_uri() . '/js/main.js', array(), '3', true );
	}

	add_action( 'wp_enqueue_scripts', 'theme_scripts' );

	/*
	>>================================================================================>
	Register Sidebar(s)
	>>================================================================================>
	*/

	// function wpb_widgets_init() {
	// 	register_sidebar( array(
	// 		'name'         => __( 'Sidebar' ),
	// 	    'id'           => 'sidebar',
	// 	    'description'  => __( 'Widgets in this area will be shown on the right-hand side of each page' ),
	// 	    'before_widget' => '<div id="%1$s" class="widget %2$s">',
	// 		'after_widget'  => '</div>',
	// 		'before_title'  => '<h3>',
	// 		'after_title'   => '</h3>'
	// 	));
	// 	register_sidebar( array(
	// 		'name'         => __( 'Footer' ),
	// 	    'id'           => 'footer',
	// 	    'description'  => __( 'Widgets in this area will be shown in the footer of each page' ),
	// 	    'before_widget' => '<div id="%1$s" class="widget %2$s">',
	// 		'after_widget'  => '</div>',
	// 		'before_title'  => '<h3>',
	// 		'after_title'   => '</h3>'
	// 	));
	// }

	// add_action( 'widgets_init', 'wpb_widgets_init' );

	/*
	>>================================================================================>
	Add custom styles drop-down to editor
	>>================================================================================>
	*/

	// add_filter( 'mce_buttons_2', 'fb_mce_editor_buttons' );

	// function fb_mce_editor_buttons( $buttons ) {
	//     array_unshift( $buttons, 'styleselect' );
	//     return $buttons;
	// }

	// add_filter( 'tiny_mce_before_init', 'fb_mce_before_init' );

	// function fb_mce_before_init( $settings ) {

	//     $style_formats = array(
	//         array(
	//             'title' => 'Rounded Arrow Button',
	//             'selector' => 'a',
	//             'classes' => 'button-rounded-arrow'
	// 		),
	// 		array(
	//             'title' => 'List with Checkmarks',
	//             'selector' => 'ul',
	//             'classes' => 'checkmarks'
	// 		)
	//     );

	//     $settings['style_formats'] = json_encode( $style_formats );

	//     return $settings;
	// }

	/*
	>>================================================================================>
	Shortcode
	>>================================================================================>
	*/

	function shortcode_function() {
		
		$shortcode = "Hello World";

		return $shortcode;
	}

	add_shortcode('shortcode_name', 'shortcode_function');


?>