var year = new Date().getFullYear();
var years = [];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var fp;
var email = $('#email'),
	password = $('#password'),
	confirm = $('#confirm'),
	lastname = $('#lastname'),
	firstname = $('#firstname'),
	company = $('#company'),
	newCard = $('.new-card');


function setExpirationDates(){
	years = [];
	year = new Date().getFullYear();
	for(var i = 0; i < 20; i++)
		years.push(year++);
	$.each(years, function(i, v){
		$('.year').append($('<option>', {text: v, value : v.toString().substring(2)}));
	});

	$.each(months, function (i, v) {
		i++;
		i = i < 10 ? '0' + i : i;
		$('.date').append($('<option>', {text : v, value : i}));
	})
}
setExpirationDates();
var timer;
$('[name=coupon]').on('keyup', function () {
	var self = $(this),
		l = $('.loader');

	if($.trim($(this).val()) === ''){
		l.hide();
		clearTimeout(timer);
		return;
	}

	clearTimeout(timer);
	
	timer = setTimeout(function () {
		l.show();

		$.ajax({
			type : 'post',
			url : '/coupon',
			data : {coupon : $.trim(self.val())}, 
			success : function (d) {

				if(d == 0){
					$('.payment-form').append($('<input>', {type : 'hidden', name : 'freepass'}))
						.find('input').each(function () {
							if($(this).hasClass('coupon')){
								$(this).val( $.trim($(this).val()));
								$('.payment-form').append($(this).clone().prop('type', 'hidden'))
								.append($('<input>',{type : 'hidden', name : 'freepass'}));
							}
							$(this).prop('disabled', true);
						})
						.end().find('select').each(function () {
							$(this).prop('disabled', true);
						});
					fp = true;
				}
				if(d !== 'error')
					$('.price').text(d);
				
				l.hide();
				
			}
		})
	}, 500)
})

email.on('keyup change paste blur', function () {
	if($(this).val().match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/)){
		$(this).next('.check').show();
	}else $(this).next('.check').hide();
})

confirm.on('keyup change paste blur', function () {
	if($(this).val() === $('#password').val() && $.trim($(this).val()) !== '')
		$(this).next('.check').show();
	else $(this).next('.check').hide();
})
password.on('keyup change paste blur', function () {
	if($(this).val() === $('#confirm').val() && $.trim($(this).val()) !== '')
		$(this).parents('.password').find('.check').show();
	else $(this).parents('.password').find('.check').hide();
})

lastname.add(firstname).on('keyup change paste blur', function () {
	
	if($('#firstname').val() !== '' && $('#lastname').val() !== '')
		$(this).parent().find('.check').show();
	else $(this).parent().find('.check').hide();

});
company.on('keyup change paste blur', function () {
	if($(this).val() !== '')
		$(this).next('.check').show();
	else $(this).next('.check').hide();
});
newCard.on('click', function () {
	$(this).hide();
	
});
$('.checkout .start-venture').on('click', checkout);
$('body').on('click', '.chosen-card input', function () {
	$('.chosen-card input').prop('checked', false);
	$(this).prop('checked', true);
})

$('form#register').on('submit', function (e) {
	var self = $(this), ammount = 17900,
		checkout = this.id === 'checkout' ? true : false;

	if($('#password').length){
		if(confirmInfo()){
			$('.check').parents('.form-group').find('.check:hidden').parent().find('input').addClass('failed');
			setTimeout(function  () {
				$('.failed').removeClass('failed');
			}, 3000);
			$('html, body').animate({
		        scrollTop: 200
		    }, 300);
			return false;
		}
	}
	
	if($.trim($('#zip').val()) === ''){
		alert('Please type in a zip code');
		return false;
	}
	if(!$('.terms input[type=checkbox]').prop('checked')){
		alert('Please accept terms of service');
		return false;
	}
	
	$('.createaccount').prop('disabled', true);

	if(!fp)getStripeToken.call(this);
		
	else self.get(0).submit();
	return false;
});
function createCopyCheckoutForm(){
	var copy = $('.checkoutform').first().clone();
		copy.find('.card').html('<input type="text" name="card" size="20" data-stripe="number" class="form-control">').css('margin-top', '0')
			.end().find('.expiration').html('<select data-stripe="exp-month" class="form-control date"></select> <select data-stripe="exp-year" class="form-control year"></select>')
			.end().removeClass('saved-card')
		copy.find('select').each(function(){
				$(this).css('display', 'inline-block')
				if($(this).hasClass('year'))
					$(this).css('width', '36%');
			});
		copy.find('.zip').html("<input data-stripe='zip'  name='zip'  id='zip' placeholder='or postal ' class='form-control'>")
			.end().find('.cvc').html("<input data-stripe='cvc' name='cvc' placeholder='XXX' class='form-control'>")
			.end().find('.info-block').removeClass('saved-card');
	if(copy.hasClass('none'))copy.removeClass('none');
	$('.cards').append(copy);
	setExpirationDates();
	return false;
}
createCopyCheckoutForm();
function getStripeToken () {
	var self = $(this);
	Stripe.card.createToken(self, function(status, response) {
		  var $form = self;
		if (response.error) {
		    // Show the errors on the form
		    $form.find('.payment-errors').text(response.error.message);
		    $form.find('button').prop('disabled', false);
		} else {
		    // token contains id, last4, and card type
		    var token = response.id;
		    // Insert the token into the form so it gets submitted to the server
		    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
		    // and submit
		    $form.get(0).submit();
		}
		
	});
}
function checkout () {
	if(!$('.chosen-card input:checked').length){
		alert('Please select a card');
		return false;
	}
	var form = $('.checkoutform:visible');
	console.log(form);
	// if($('.chosen-card input:checked').parent().parent().hasClass('saved-card')){
	// 	var form = $('.chosen-card input:checked').parents('form');
	// 	form.append($('<input>', {type : 'hidden', name : 'savedCard'}))
	// 	form.submit();
	// }else{
		getStripeToken.call(form);
	// }
}
function confirmInfo () {
	var password = $.trim($('#password').val()),
		confirm = $.trim($('#confirm').val()),
		email = $.trim($('#email').val()),
		lastname = $.trim($('#lastname').val()),
		firstname = $.trim($('#firstname').val()),
		company = $.trim($('#company').val()),
		error = [];

	if(password !== confirm)
		error.push("Passwords don't match");
	if(!email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/))
		error.push("Not a valid email");
	if(company === '')
		error.push("Company wasn't entered");
	if(lastname === '')
		error.push("Please enter a last name");
	if(firstname === '')
		error.push("Please enter a first name");

	if(error.length > 0){
		printErrors(error);
		return true;
	}
	return false;
}
function printErrors (arr) {
	var err = $('.errors');
	err.html('');
	for(var i = 0; i < arr.length ; i++)
		err.append(arr[i] + '<br>');

	setTimeout(function () {
		err.html('');
	}, 3000);
}

$('a[href=tos]').on('click', function () {
	$.ajax({
		url : 'tos',
		success : function  (page) {
			var container = $('<div>').css({
				left : '20%',
				top : $(document).scrollTop() + ($(window).height() * .1),
				height : $(window).height() * .8,
				width : '60%',
				position : 'absolute',
				background : 'white',
				border : '1px solid black',
				borderRadius : 10,
				padding : 50,
				zIndex : 9999,
				overflowX : 'scroll'
			}),
			splash = $('<div>').css({
				top : 0,
				left : 0,
				background : 'rgba(0,0,0,0.6)',
				width : $(window).width(),
				height : $(document).height(),
				zIndex : 9998,
				position : 'absolute'
			});
			splash.append(container.append(page));

			container.find('.container').css('background', 'white');
			$('body').append(splash)
			splash.add(container).on('click', function () {
				splash.hide();
			})
		}
	})

	return false;
})