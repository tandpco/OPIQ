$(window).load(function () {
	$.each($('.show-your-work'), function () {
		if($.trim($(this).val()) === '')$(this).addClass('none');
	})
	$('form').append($("<input>", {type : 'hidden', name : 'analysis', value : $('.analysis').text()}))
	.append($('<input>', {type : 'hidden', name : 'html', value :$('.main-content').html()})).submit();
})	
