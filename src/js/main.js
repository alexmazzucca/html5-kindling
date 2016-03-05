(function ( $ ) {

	$.Window = $(window);

	var $mobileBreakpoint = 767,
		$windowSize;

	/*-------------------------------------
	Window Size
	-------------------------------------*/

	function sizeCheck(){
		if($.Window.width() <= $mobileBreakpoint){
			$windowSize = 'mobile';
		}else{
			$windowSize = 'desktop';
		}
	}

	$(document).ready(function() {
		sizeCheck();
	});

	$.Window.bind("resize", function() {
		sizeCheck();
	});

	/*-------------------------------------
	SVG Substitutions
	-------------------------------------*/

	if (!Modernizr.svg) {
		//$(".footer-logo img").attr("src", "img/logo-footer.png");
	}

	/*-------------------------------------
	Navigation
	-------------------------------------*/

	$.fn.navControl = function(options){

		var $stage = $(this),
			$burger = $('#burger');

		// Initialize functions based on viewport size

		function navInit(){
			if($windowSize == 'mobile'){
				if(!$('body').hasClass('mobile-menu')){
					navMobileInit();
				}
				if($('body').hasClass('desktop-menu')){
					navDesktopReset();
				}
			}else{
				if(!$('body').hasClass('desktop-menu')){
					navDesktopInit();
				}
				if($('body').hasClass('mobile-menu')){
					navMobileReset();
				}
			}
		}

		$.Window.bind('load resize', navInit);
		navInit();

		// Specific viewport functions

		function navMobileInit() {
			navDesktopReset();
			$('body').addClass('mobile-menu');
		}

		function navDesktopInit(){
			navMobileReset();
			$('body').addClass('desktop-menu');
		}

		// Reset DOM Modifications

		function navMobileReset(){
			$('body').removeClass('mobile-menu');
		}

		function navDesktopReset(){
			$('body').removeClass('desktop-menu');
		}
	}

	$(document).ready(function() {
		$('header.main').navControl();
	});

}(jQuery));