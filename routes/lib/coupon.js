var keystone = require('keystone'),
	stripe = require('stripe')();



exports = module.exports = function(req, res) {
	if(req.body.page.match('register'))
		var amount = 17900;
	else var amount = 4900;

	
	stripe.setApiKey(keystone.get('stripeApiKey'));


	stripe.coupons.retrieve(req.body.coupon || '', function (e, c) {
		if(!e){
			if(c.percent_off){
				var percent = amount * (c.percent_off / 100);
				amount = amount - percent;
			}else if(c.amount_off){
				amount = amount - c.amount_off;
			}
			amount = amount.toString();
			if(amount > 0)
				amount = amount.slice(0, -2) + '.' + amount.substr(-2);

			res.send(amount);
		}else res.send('error');
		
		
	});
}