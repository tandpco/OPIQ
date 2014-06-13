$('.payment-form').find('input:not(type=submit)').each(function () {
	$(this).prop('disabled', true);
});
$('form').off('submit');