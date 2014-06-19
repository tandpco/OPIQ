var	stripe = require('stripe')();


exports = module.exports = function(req, res) {
	var amount = 17900;
	stripe.setApiKey("sk_test_His9L7RGJvdVRuuPOkCeuand"); // TESTING PURPOSES
	// stripe.setApiKey("sk_live_cSlbqodvJ9gkpQ9030kwv46v");


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