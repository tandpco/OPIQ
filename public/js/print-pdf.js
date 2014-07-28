$(window).load(function () {
	$('form').append($('<input>', {name : 'html', value :$('body').html()})).submit();
})	
