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

$('.menu-toggle').on('click', function(){
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
}

function closeModal(){
    var $modal = $('.modal.active');
    $modal.removeClass('active');
    $('body').removeClass('modal-active')
}

$('.close-modal').on('click', closeModal);

$('*[data-modal]').on('click', openModal)