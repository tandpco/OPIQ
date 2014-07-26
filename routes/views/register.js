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
	
	var view = new keystone.View(req, res),
		locals = res.locals,
		fields = req.body || {},
		ip = req.headers['x-forwarded-for'];

	locals.categories = {};
	locals.categories.cats = [];
	locals.analysis = {};
	locals.cat_totals = {};
	locals.main_total = 0;
	locals.stripeApiKey = keystone.get('stripeApiKeyClient');

	if(req.body.last4 instanceof Array)req.body.last4 = req.body.last4[0];
	if(req.body.freepass instanceof Array)req.body.freepass = 'true';	

	console.log(req.body);



	if(req.body.analysis)
		req.session.newanalysis = req.body.analysis;
	
	if(req.method === 'GET'){
		view.render('register');
	}else{
		var coupon, amount;


		// Set Stripe api key to ENV variable
		stripe.setApiKey(keystone.get('stripeApiKey'));


		if(req.headers.referer.match('register'))
			amount = 17900;
		// Checkout is only $49
		else amount = 4900;

		var COUPON_ID = req.body.coupon;
		if(COUPON_ID){
			stripecust.getCoupon(COUPON_ID, amount, function (amount) {
				amount = amount;
				start();
			})
		}else start();
		


		function start(){
			// Get the credit card details submitted by the form
			var stripeToken = req.body.stripeToken;
			// console.log(amount);

			if(!stripeToken && req.headers.referer.match('register') && amount !== 0)
					res.locals.error = 'No card info was put in';
				
			console.log(req.body.freepass)
			if(!req.body.freepass){// || !(req.user && req.user.freeAccess)){
				console.log('no freepass')
				if(req.headers.referer.match('register') && !req.body.checkout){
					
					stripecust.createCustomerAndCharge(req, res, stripeToken, amount, function (err, charge) {
						if(!err)
							if(!req.user){
					  			build_user(fields, view, req, locals, res);
					  		}else getPages(view, locals, req, res);
					  	else{
					  		locals.error = "Failed to charge card";
					  		view.render("register");
					  	}
					});
				}else{

				/////////////////////
				// CHECKOUT        //
				/////////////////////


					// Initial check to see if user is defined
					if(!req.user)keystone.redirect("/");



					if(req.body.savedCard){
						stripecust.retrieveCard(req, {zip : req.body.zip, last4 : req.body.last4}, function (e, card) {
							if(e){
								locals.error = e;
								stripecust.renderCheckout(req, res);
							}else{
								console.log('charging');
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
										locals.error = err.type;
										keystone.redirect('checkout');
									}
								})
							else charge(chargeObject, req);
						// If no id create customer
						}else{

							stripecust.createCustomerAndCharge(req, res, stripeToken, amount, function (e, c) {
								stripecust.setUserStripeId(req, c.id);
								if(e){
							   		locals.error = e.type;
				  					keystone.redirect('checkout');	
						   		}else getPages(view, locals, req, res);
							});
						}
						
						
					}
					function charge(chargeObject, req){
						stripecust.charge(chargeObject, req, function (e, ch) {
							
					   		if(e){
						   		locals.error = e.type;
			  					keystone.redirect('checkout');	
					   		}else if(ch) getPages(view, locals, req, res);
					   		
					   })
					}
					
				}	 
				

					
			}else{
				console.log('freepass')
				if(req.headers.referer.match('register'))
					stripecust.createCustomer(req, function () {
						if(!req.user)
				  			build_user(fields, view, req, locals, res);
				  		else getPages(view, locals, req, res);
					})
				else getPages(view, locals, req, res);
			}
				

		}
		
		

	} 
	
}


function build_user (fields, view, req, locals, res) {
	var newUser = User.model({
		name : { first : fields.firstname, last : fields.lastname},
		email : fields.email,
		password : fields.password,
		stripeid : req.session.stripeid,
		zip : fields.zip
	})
	var oldsession = req.session;

	locals.categories = {};
	locals.categories.cats = [];
	locals.analysis = {};
	locals.cat_totals = {};
	locals.main_total = 0;


	var ip = req.headers['x-forwarded-for'];
	newUser.save(function(err){
		if(err)console.log(err);


		User.model.findOne({email : fields.email}).exec(function(er, user){
			var backlog = keystone.get(ip + 'backlog'), ans;

			// console.log('this is the ip in register' , req.headers['x-forwarded-for']);
			
			if(backlog){

				Analysis.model.findOne({title : backlog[0].analysistitle, user : ip}).exec(function(e, a){
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
				
				
			}else {
				session.signin(req.body, req, res, onSuccess, onFail);
			}

			function onSuccess () {
				req.session.zip = oldsession.zip || null;
				req.session.last4 = oldsession.last4 || null;
				req.session.stripeid = oldsession.stripeid || null;
				req.session.card = oldsession.card || null;
				console.log(req.session);			
				res.redirect('register-success');
			}
			function onFail () {
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
	console.log('getting pages');
	


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
