$(window).load(function () {
	$('form').append($('<input>', {name : 'html', value :$('.main-content').html()})).submit();
})	
