var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')();
	stripe.setApiKey(keystone.get('stripeApiKey'));

exports = module.exports = {
	get : function(stripeid, cb) {
		if(!stripeid || stripeid === '')cb('no id passed');
		stripe.customers.retrieve(stripeid, function (e, c) {
			cb(e, c);
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
	addCard : function  (req, stripeCardID, cb) {
		var zip = req.body.zip || req.session.zip || null,
			last4 = req.body.last4 || req.session.last4 || null,
			stripeCardID = stripeCardID || req.session.card || null;

		if(!req.user._id)return;


		User.model.findOne({_id : req.user._id}).exec(function (e, u) {
			var found;
			if(!e){

				// If User has cards, try to see if they have this one on file
				// If so just update
				if(u.cards)
					for(var i = 0 ; i < u.cards.length ; i++)
						if(zip === u.cards[i]){
							found = true;
							u.cards[i].zip = zip;
							u.cards[i].last4 = last4;
							u.cards[i].stripeCardID = stripeCardID;
						}

				// If User does not have cards create it.
				if(!u.cards)u.cards = [];

				// If no match on file add it.
				if(!found)
					u.cards.push({
						zip : zip,
						last4 : last4,
						stripeCardID : stripeCardID
					});

				// Save User
				u.save(function () {
					if(cb)cb();
				})
			}else{
				if(cb)cb(e);
			}
		})
	},
	retrieveCard : function  (req, zipLast4, cb) {
		var found = false,
			zip, last4;
		if(zipLast4 instanceof Function){
			if(req.zip)zip = req.body.zip || req.session.zip || null;
			if(req.last4)last4 = req.body.last4 || req.session.last4 || null;
		}else{
			if(zipLast4.zip)zip = zipLast4.zip;
			if(zipLast4.last4)last4 = zipLast4.last4;
		}

		if(!req.user._id || !zip || !last4){
			cb('failed to retreive card');
			return;
		}

		User.model.findOne({_id : req.user._id}).exec(function (e, u) {
			if(!e){
				for(var i = 0 ; i < u.cards.length; i++){
					var card = u.cards[i];
					if(zip && zip === card.zip && last4 && last4 === card.last4){
						
						found = true;
					}
				}
				if(!found)cb('no card found');
				else{
					stripe.customers.retrieveCard(u.stripeid, card.stripeCardID, function (e, c) {
						if(e)cb(e, null);
						else cb(null, c);
					});
				}
			}else cb('no user found');
		})
	},
	createCustomerAndCharge : function (req, res, stripeToken, amount, cb) {
		var self = this,
			zip = req.body.zip || null,
			last4 = req.body.last4 || null,
			customer;

		req.session.zip = zip;
		req.session.last4 = last4;

		stripe.customers.create({
		  description: 'OPIQ Customer',
		  card: stripeToken, // obtained with Stripe.js
		  email: req.body.email || req.user.email
		}, function(e, customer){
			if(!e){
				req.session.stripeid = customer.id;
				customer = customer;
				self.charge({
				    amount: amount, // amount in cents, again
				    currency: "usd",
				    customer: customer.id,
				    description : "OPIQ Charge"
				}, req, function(e, c){cb(e, customer)})
			}else cb(e);
		})
	},
	// Create customer also charges
	createCustomer : function (req, stripeToken, cb) {
		var self = this,
			customer,
			customerObject = {
			  	description: 'OPIQ Customer',
			  	email: req.body.email || req.user.email
			};
		
		

		if(stripeToken instanceof Function){
			cb = stripeToken;
			stripeToken = null;
		}else if(stripeToken){
			customerObject.card = stripeToken; 
		}

		stripe.customers.create(customerObject, function (e, customer) {
			req.session.zip = req.body.zip || null;
			req.session.last4 = req.body.last4 || null;
			req.session.stripeid = customer.id;

			cb(e, customer);			
		})
	},
	getCoupon : function  (COUPON_ID, amount, cb) {
			stripe.coupons.retrieve(COUPON_ID, function (e, c) {
				if(!e){
					if(c.percent_off){
						var percent = amount * (c.percent_off / 100);
						amount = amount - percent;
					}else if(c.amount_off){
						amount = amount - c.amount_off;
					}

					cb(amount);
				}else cb(null);
				
				
			});
	},
	renderCheckout : function (req, res) {
		var view = new keystone.View(req, res),
			self = this;

		res.locals.analysis = req.body.analysis;
		if(req.user.stripeid)
			this.get(req.user.stripeid, function(e, customer){
				if(!e){
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

				}else self.createCustomer(req, function () {
					view.render('checkout');
				});
			});
		else {
			view.render('checkout');
		}
	},
	charge : function  (chargeObject, req, cb) {
		var self = this;
		if(req instanceof Function)cb = req;

		 stripe.charges.create(chargeObject, function(err, charge) {
		  	if (err)
		  		cb(err, null);
			else{
				if(req instanceof Object && req.user)
					self.addCard(req, charge.card.id , cb);
				req.session.card = charge.card.id;
				cb(null, charge);
			} 
		  
		});
	},
	createCard : function  (req, zip, stripeid, stripeToken, cb) {
		var self = this;
		stripe.customers.createCard(stripeid,{card: stripeToken}, function(err, card) {
			if(!err){
				req.session.zip = zip;
				req.session.last4 = card.last4;
				self.addCard(req, card.id, function (err) {
					if(err)cb(err, null);
					else cb(null, card.id);
				})
			   	
			}
			else cb(err, null);
		});
	},
	createCustomerIfNone : function  (req, stripeid, cb) {
		var self = this;
		stripe.customers.retrieve(stripeid, function (e, c) {
			if(e)
				self.createCustomer(req, function  (customer) {
					cb(null, customer);
				});
			else cb(null, c);
		});
	},
	createCardIfNone : function  (req, stripeToken, cb) {
		var self = this,
			stripeid = req.user.stripeid,
			last4 = req.body.last4,
			zip = req.body.zip;
		

		this.createCustomerIfNone(req, stripeid, function(err, customer) {
		  	var d, gotit = false;
		  	if(err)cb(err);
		  	else{
		  		if(!customer)cb('no customer found');
		  		
		  		d = customer.cards.data;
		  		if(!d.length)self.createCard(req, zip, stripeid, stripeToken, cb);
		  		else{
			  		for(var i = 0 ; i < d.length ; i++){
			  			if(d[i].last4 === last4){
			  				gotit = d[i].id;
			  				break;
			  			}
			  		}
			  		if(!gotit)self.createCard(req, zip, stripeid, stripeToken, cb);
			  		else cb(null, gotit);
			  	}
		  	}

		});
	}
}