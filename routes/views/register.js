var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')(),
	Answer = keystone.list('Answer'),
	Analysis = keystone.list('Analysis'),
	Page = keystone.list('Page'),
	session = require('keystone/lib/session'),
	_ = require('underscore'),
	request = require('request'),
	stripecust = require('../lib/stripecust.js');


exports = module.exports = function(req, res) {
	
	var view   = new keystone.View(req, res),
		  locals = res.locals,
		  fields = req.body || {},
		  ip     = req.headers['x-forwarded-for'],
		  page   = req.body.checkout ? 'checkout' : 'register';

	locals.categories = {};
	locals.categories.cats = [];
	locals.analysis = {};
	locals.cat_totals = {};
	locals.main_total = 0;
	locals.stripeApiKey = keystone.get('stripeApiKeyClient');

	locals.anID = req.query.an;
	req.session.analysisid = req.query.an;

  console.log('Trial ID: ', req.session.trialID);

	if (req.body.last4 instanceof Array) req.body.last4 = req.body.last4[0];
	if (req.body.freepass instanceof Array) req.body.freepass = 'true';	

	if(req.body.analysis)
		req.session.newanalysis = req.body.analysis;
	
	if (req.method === 'GET') {

		view.render('register');

	} else {

		var coupon, amount = 9900;

		// Set Stripe api key to ENV variable
		stripe.setApiKey(keystone.get('stripeApiKey'));

		var COUPON_ID = req.body.coupon;

		if (COUPON_ID) {

			stripecust.getCoupon(COUPON_ID, amount, startWithCoupon);

		} else start(amount);

		function startWithCoupon (e, amount) {
			if(!e){
				if(amount < 50)amount = 50;
				start(amount);	
			}else{
				resendPost(req, res);
				locals.error = 'Failed to retrieve coupon';
				page === 'checkout' ? stripecust.renderCheckout(req, res) : view.render('register');
			}
		}
		
		function start(amount){
			// Get the credit card details submitted by the form
			var stripeToken = req.body.stripeToken;
			// console.log(amount);
			if(!stripeToken && req.headers.referer.match('register') && amount !== 0)
				res.locals.error = 'No card info was put in';
			
			if (!req.body.freepass || (req.user && !req.user.freeAccess) || !(req.user && Date.now() - req.user.oneYearPaidAccess >=  31536000730)) {
				
				if(req.headers.referer.match('register') && !req.body.checkout){
					
					/****************/
					/** REGISTER ****/
					/****************/

					User.model.findOne({email : req.body.email}).exec(function (e, u) {
					
						if(u){
							resendPost(req, res);
							locals.error = 'User with email already exists';
							view.render('register');
						}else
							stripecust.createCustomerAndCharge(req, res, stripeToken, amount, function (err, charge) {
								if(!err)
									if(!req.user){
							  			build_user(fields, view, req, locals, res);
							  		}else getPages(view, locals, req, res);
							  	else{
							  		resendPost(req, res);
							  		locals.error = err.message;// "Failed to charge card";
							  		view.render("register");
							  	}
							});
					})
				}else{

				/////////////////////
				// CHECKOUT        //
				/////////////////////


					// Initial check to see if user is defined
					if(!req.user)keystone.redirect("/");

					// Update to have free access for one year
					var user = User.model.findOne({_id : req.user._id}).exec(function(err, user){
						user.oneYearPaidAccess = Date.now();
						user.save();
					})

					if(req.body.savedCard){
						stripecust.retrieveCard(req, {zip : req.body.zip, last4 : req.body.last4}, function (e, card) {
							if(e){
								resendPost(req, res);
								locals.error = e;
								stripecust.renderCheckout(req, res);
							}else{
								
								charge({
									amount: amount, // amount in cents, again
									currency: "usd",
									card: card.id,
									customer : req.user.stripeid,
									description: "OPIQ Checkout Charge"
								}, req);
							}
						})
						
					}else{
						var chargeObject = {
							amount: amount, // amount in cents, again
							currency: "usd",
							card: stripeToken,
							description: "OPIQ Charge"
						}

						// Check to see if user has stripe id
						if(req.user.stripeid){
							chargeObject.customer = req.user.stripeid;
							// Create new card then charge
							if(req.user.stripeid)
								stripecust.createCardIfNone(req, stripeToken, function(err, card){
									if(!err){
										chargeObject.card = card;
										charge(chargeObject, req);
									}else{
										resendPost(req, res);
										locals.error = err;
										// keystone.redirect('checkout');
										stripecust.renderCheckout(req, res);
									}
								})
							else charge(chargeObject, req);
						// If no id create customer
						}else{

							stripecust.createCustomerAndCharge(req, res, stripeToken, amount, function (e, c) {
								
								if(e){
									resendPost(req, res);
							   		locals.error = e.message;
				  					// keystone.redirect('checkout');	
									stripecust.renderCheckout(req, res);

						   		}else getPages(view, locals, req, res);
							});
						}
						
						
					}
					function charge(chargeObject, req){
						stripecust.charge(chargeObject, req, function (e, ch) {
							
					   		if(e){
					   			resendPost(req, res);
						   		locals.error = e.message;
			  					stripecust.renderCheckout(req, res);	
					   		}else if(ch) getPages(view, locals, req, res);
					   		
					   })
					}
					
				}	 
				

					
			}else{
				
				if(!req.body.checkout)
					User.model.findOne({email : req.body.email}).exec(function (e, u) {

						if(u){
							resendPost(req, res);
							locals.error = 'User with email already exists';
							view.render('register');
						}else
							stripecust.createCustomer(req, function () {
								if(!req.user)
						  			build_user(fields, view, req, locals, res);
						  		else getPages(view, locals, req, res);
							})
					});
				else getPages(view, locals, req, res);
			}

		}

	} 
	
}
function resendPost (req, res) {
	var locals = res.locals;
	for(var i in req.body){
		locals[i] = req.body[i];
	}
}

function build_user (fields, view, req, locals, res) {

	var trialID = (req.session.trialID ? req.session.trialID : null);

	console.log('User ID: ', trialID)

	var newUser = User.model({
		name: { first : fields.firstname, last : fields.lastname},
		email: fields.email,
		password: fields.password,
		stripeid: req.session.stripeid,
		zip: fields.zip,
		_req_user: req.user,
		oneYearPaidAccess: Date.now(),
    trialID: trialID
	});

	var oldsession = req.session;

	locals.categories = {};
	locals.categories.cats = [];
	locals.analysis = {};
	locals.cat_totals = {};
	locals.main_total = 0;

	var ip = req.headers['x-forwarded-for'];

	newUser.save(function(err){

		if(err)console.log(err);

		User.model.findOne({email: fields.email}).exec(function(er, user) {

			var backlog = keystone.get(ip + 'backlog'), ans;

			// console.log('this is the ip in register' , req.headers['x-forwarded-for']);
			
			// session.signin(req.body, req, res, onSuccess, onFail);

			if(backlog){

				Analysis.model.findOne({user: trialID}).exec(function(e, a){
					a.user = user._id;
					a.save();
					for(var i = 0 ; i < backlog.length; i++){
						ans = new Answer.model({
							answer : backlog[i].answer,
							page : backlog[i].page,
							user : user._id,
							category : backlog[i].category,
							analysis : a._id,
							analysistitle : backlog[i].analysistitle,
							whatthismeans : backlog[i].whatthismeans,
							notes : backlog[i].notes,
							work : backlog[i].work
						})
						ans.save();

					}
					keystone.set(ip + 'routeToQuestions', true);
					keystone.set(ip + 'backlog', null);

				Page.model.find()
					.sort('order')
			    .exec(function(err, pages) {
			    		var cat_totals = {}, total_pages_answered = 0, main_total = 0;
			    		for(var i = 0; i < pages.length; i++){
							
							locals.categories.cats = _.uniq(_.pluck(pages, 'category'));

							pages[i].answer = 0;

							if(typeof locals.categories[pages[i].category] === 'undefined')
								locals.categories[pages[i].category] = [];

							if(typeof cat_totals[pages[i].category] === 'undefined'){
								// console.log(pages[i].category)
								cat_totals[pages[i].category] = {};
								cat_totals[pages[i].category].total = 0;
								cat_totals[pages[i].category].total_pages = 0;
							}

							locals.categories[pages[i].category].push(pages[i]);
								
						}
						
						locals.main_total = (main_total / total_pages_answered) * 20;

						for(var i in cat_totals){
							// console.log(cat_totals[i])
							locals.cat_totals[ i ] = (cat_totals[i].total / cat_totals[i].total_pages) * 20;
						}
					
						// Set locals
						locals.pages = pages;

						session.signin(req.body, req, res, onSuccess, onFail);
					
					});
				})
				
			} else {

				session.signin(req.body, req, res, onSuccess, onFail);

			}

			function onSuccess() {

				req.session.zip = oldsession.zip || null;
				req.session.last4 = oldsession.last4 || null;
				req.session.stripeid = oldsession.stripeid || null;
				req.session.card = oldsession.card || null;
				// console.log(req.session);			
				res.redirect('/register-success');

			}

			function onFail() {
				locals.error = "Failed to sign in. Please try again.";
				view.render(req.path.substring(1));
			}
			

		});
	});
}

function getPages (view, locals, req, res) {

	var a = new Analysis.model({
		title : req.body.analysis,
		user : req.user._id
	})

	locals.analysis = a;
	a.save();
	// console.log('getting pages');
	
	Page.model.find()
		.sort('order')
    .exec(function(err, pages) {
    		var cat_totals = {}, total_pages_answered = 0, main_total = 0;
    		for(var i = 0; i < pages.length; i++){
				
				locals.categories.cats = _.uniq(_.pluck(pages, 'category'));

				pages[i].answer = 0;

				if(typeof locals.categories[pages[i].category] === 'undefined')
					locals.categories[pages[i].category] = [];

				if(typeof cat_totals[pages[i].category] === 'undefined'){
					// console.log(pages[i].category)
					cat_totals[pages[i].category] = {};
					cat_totals[pages[i].category].total = 0;
					cat_totals[pages[i].category].total_pages = 0;
				}

				locals.categories[pages[i].category].push(pages[i]);
					
			}
			
			locals.main_total = (main_total / total_pages_answered) * 20;

			for(var i in cat_totals){
				// console.log(cat_totals[i])
				locals.cat_totals[ i ] = (cat_totals[i].total / cat_totals[i].total_pages) * 20;
			}
			
			// Set locals
			locals.pages = pages;
			
			// Render the view
			res.redirect('register-success');
		});
}
