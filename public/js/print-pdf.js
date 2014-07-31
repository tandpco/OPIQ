$(window).load(function () {
	$.each($('.show-your-work'), function () {
		if($.trim($(this).val()) === '')$(this).addClass('none');
	})
	$('form').append($('<input>', {name : 'html', value :$('.main-content').html()})).submit();
})	
