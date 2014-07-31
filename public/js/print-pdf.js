var today = new Date();
var dd = today.getDate();
var mm = today.getMonth(); //January is 0!
var yyyy = today.getFullYear();
var months = ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

if(dd<10) {
    dd='0'+dd
} 


today = months[mm]+' '+dd+', '+yyyy;
$('.date').html(today);

$(window).load(function () {
	$.each($('.show-your-work'), function () {
		if($.trim($(this).val()) === '')$(this).addClass('none');
	})
	$('form').append($("<input>", {type : 'hidden', name : 'analysis', value : $('.analysis').text()}))
	.append($('<input>', {type : 'hidden', name : 'html', value :$('.main-content').html()})).submit();
})	
