var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')();

exports = module.exports = {
	get : function(stripeid, cb) {
		if(!stripeid || stripeid === '')return 'no id passed';
		stripe.setApiKey(keystone.get('stripeApiKey'));
		console.log('stripeid' , stripeid);
		stripe.customers.retrieve(stripeid, function (e, c) {
			cb(c);
		});
	}
}