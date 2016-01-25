(function ( $ ) {

	$.Window = $(window);
	var $mobileBreakpoint = 767,
		$windowSize;

	function sizeCheck(){
		if($.Window.width() <= $mobileBreakpoint){
			$windowSize = 'mobile';
		}else{
			$windowSize = 'desktop';
		}
	}

	$.Window.bind("load resize", function() {
		sizeCheck();
	});

	/*-------------------------------------
	Plugins
	-------------------------------------*/
	

}(jQuery));