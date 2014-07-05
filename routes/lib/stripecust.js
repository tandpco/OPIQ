var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')();
	stripe.setApiKey(keystone.get('stripeApiKey'));

exports = module.exports = {
	get : function(stripeid, cb) {
		if(!stripeid || stripeid === '')return 'no id passed';
		stripe.customers.retrieve(stripeid, function (e, c) {
			cb(c);
		});
	},
	setUserStripeId : function  (req, stripeid) {
		User.model.findOne({_id : req.user._id}).exec(function  (e, u) {
			if(!e){
				u.stripeid = stripeid;
				u.save();
			}
		})
	},
	// Create customer also charges
	createCustomer : function (req, res, stripeToken, amount, cb) {
		var self = this,
			customer;;
		stripe.customers.create({
		  description: 'OPIQ Customer',
		  card: stripeToken, // obtained with Stripe.js
		  email: req.body.email || req.user.email
		}).then(function (customer) {
			req.session.stripeid = customer.id;
			customer = customer;
			self.charge({
			    amount: amount, // amount in cents, again
			    currency: "usd",
			    customer: customer.id,
			    description : "OPIQ Charge"
			}, function(e, c){cb(e, customer)})
		})
	},
	renderCheckout : function (req, res) {
		var view = new keystone.View(req, res);

		res.locals.analysis = req.body.analysis;
		if(req.user.stripeid)
			this.get(req.user.stripeid, function(customer){
				if(customer.deleted){
					res.locals.error = "No stripe customer in this name";
					res.redirect('/');
					return;
				}
				var data = customer.cards.data;
				res.locals.cards = [];
				for(var i = 0 ; i < data.length ; i++)
					res.locals.cards.push(data[i]);
				
					view.render('checkout');					
			});
		else view.render('checkout');
	},
	charge : function  (chargeObject, cb) {
		 stripe.charges.create(chargeObject, function(err, charge) {
		  	if (err)
		  		cb(err, null);
			else cb(null, charge);
		  
		});
	},
	createCard : function  (stripeid, stripeToken, cb) {
		stripe.customers.createCard(stripeid,{card: stripeToken}, function(err, card) {
			if(!err)
			   cb(null, card.id);
			else cb(err, null);
		});
	},
	createCardIfNone : function  (stripeid, stripeToken, last4, cb) {
		var self = this;
		stripe.customers.retrieve(stripeid, function(err, customer) {
		  	var d = customer.cards.data, gotit = false;
		  	if(err)cb(err);
		  	if(!d.length)self.createCard(stripeid, stripeToken, cb);
		  	else{
		  		for(var i = 0 ; i < d.length ; i++){
		  			if(d[i].last4 === last4){
		  				gotit = d[i].id;
		  				break;
		  			}
		  		}
		  		if(!gotit)self.createCard(stripeid, stripeToken, cb);
		  		else cb(null, gotit);
		  	}

		});
	}
}