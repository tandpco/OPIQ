var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')();

exports = module.exports = {
	get : function(stripeid, cb) {
		if(!stripeid || stripeid === '')return 'no id passed';
		stripe.setApiKey(keystone.get('stripeApiKey'));
		stripe.customers.retrieve(stripeid, function (e, c) {
			cb(c);
		});
	},
	set : function (userid, stripeid) {
		User.model.findOne({_id : userid}).exec(function (e, u) {
			u.stripeid = stripeid;
			u.save();
		})
	},
	checkZip : function  (userid, zip, cb) {
		User.model.findOn({_id : userid}).exec(function  (e, u) {
			if(zip === u.zip)cb(true);
			else cb(false);
		})
	}
}