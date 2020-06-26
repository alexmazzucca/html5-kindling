console.log('%cΔRCHER', 'background: #14548A; color: #ffffff; border-left: 5px solid #14548A; border-right: 5px solid #14548A; font-size: 15px;', 'http://archerinteractive.com');

/*
* >>========================================>
* Get Viewport Width
* >>========================================>
*/

var viewportWidth;

$(window).on('load resize', function(){
    viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}).trigger('resize');

/*
* >>========================================>
* Detect IE
* >>========================================>
*/

if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
    $('body').addClass('is-msft');
}

/*
* >>========================================>
* On Window Load
* >>========================================>
*/

$(window).on('load', function(){
    $('body').addClass('page-loaded');
});

/*
* >>========================================>
* Menu
* >>========================================>
*/

$('.burger').on('click', function(){
    $('body').toggleClass('menu-active');
});

/*
* >>========================================>
* Modals
* >>========================================>
*/

function openModal(e){
    e.preventDefault();
    var $modal = $('#' + $(this).data('modal'));
    $('body').addClass('modal-active');
    $modal.addClass('active');
	$(window).on('resize', modalOverflowCheck).trigger('resize');
}

function closeModal(){
    var $modal = $('.modal.active');
    $modal.removeClass('active');
	$('body').removeClass('modal-active');
	$(window).off('resize', modalOverflowCheck);
}

function modalOverflowCheck(){
	if($('.modal.active .window').outerHeight() + 40 > $(window).height()){
		$('body').addClass('modal-overflow');
	}else{
		$('body').removeClass('modal-overflow');
	}
}

$('.close-modal').on('click', closeModal);

$('*[data-modal]').on('click', openModal)

/*
* >>========================================>
* Expandable Content
* >>========================================>
*/

$('.expandable-item .trigger').on('click', expandableItem);

function expandableItem($element){
	if(event != undefined && event.type == 'click') {
		$item = $(this).closest('.expandable-item');
	}else{
		$item = $element;
	}
	
	$content = $item.find('.content'),
	content_height = $content.find('> div').outerHeight();

	$item.toggleClass('active');

	if($item.hasClass('active')){
		TweenMax.fromTo($content, .3, {height:0}, {height: content_height, ease:Power1.easeInOut, onComplete:function(){
			$content.attr('style', '').addClass('expanded');
		}});
	}else{
		$content.removeClass('expanded');
		TweenMax.fromTo($content, .3, {height: content_height}, {height: 0, ease:Power3.easeInOut});
	}
}

/*
* >>========================================>
* Hash Jump
* >>========================================>
*/

$("a[href*='#']:not([data-modal])").on('click', function(event){
	if (/#/.test(this.href)) {
		var url = $(this).attr('href');
		var hash = url.substring(url.indexOf('#'));
		var $element = $(hash);

		if($element.length){
			if(history.pushState) {
				history.pushState(null, null, hash);
			}
			event.preventDefault();
			hashJump($element);
			$('body').removeClass('menu-active');
		}
	}
});

$(window).on('load', function(){
	if(window.location.hash) {
		if($(window.location.hash).length) {
			window.scrollTo(0, 0);
			
			setTimeout(function(){
				hashJump($(window.location.hash));
			}, 150)
		}
	}
})

function hashJump($target){
	if(viewportWidth < 768){
		var offset = 0;
	}else{
		var offset = Math.round($('#sticky-header').outerHeight());

		if(Math.round($target.offset().top) == Math.round($('#main-header').outerHeight())){
			var offset = -1;
			console.log(offset)
		}
	}
	
	TweenMax.to('html,body', .6, {scrollTop: $target.offset().top - offset, ease:Power3.easeInOut});	
}