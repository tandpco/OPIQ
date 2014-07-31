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

showLoading();
$.each($('.show-your-work'), function () {
	if($.trim($(this).val()) === '')$(this).addClass('none');
})
$(window).load(function () {
	setTimeout(function(){
		var a = $("<a>", {id :'get-pdf', 'class' : 'large-main-button', text : 'Download PDF'})
			.on('click', downloadpdf);
		$('#loader').html(a.clone(true));
		$('.logo').prepend(a.clone(true));
	}, 1000)
})


function showLoading(){
	var splash = $('<div>').css({
			top : 0,
			left : 0,
			position : 'absolute', 
			width : $(window).width(),
			height : $(document).height(),
			background : 'transparent'//rgba(0,0,0,0.2)'
		}).on('click', function(){$(this).hide()}),
		loader = $('<div>', {id : 'loader', text : 'One moment while we generate your report'}).css({
			top : $(document).scrollTop() + ($(window).height() / 2 - 25),
			left : ($(window).width() / 2) - 150,
			width : 300,
			height : 70,
			background : 'rgba(0,0,0,0.4)',
			position : 'absolute',
			borderRadius : 5,
			color : 'white',
			padding : 10,
			textAlign : 'center',
		}).append($('<div>', {html : "<img src='pdfimg/ajax-loader.gif'>"}))
	$('body').append(splash.append(loader));
}
function downloadpdf () {
	$('form').append($("<input>", {type : 'hidden', name : 'analysis', value : $('.analysis').text()}))
	.append($('<input>', {type : 'hidden', name : 'html', value :$('.main-content').html()})).submit();
}
