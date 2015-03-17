var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')(),
	Answer = keystone.list('Answer'),
	Analysis = keystone.list('Analysis'),
	Page = keystone.list('Page'),
	session = require('keystone/lib/session'),
	_ = require('underscore'),
	request = require('request');


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
	
	if(req.method === 'GET'){

		view.render('checkout');

	}else{
		
		var coupon;
		
		stripe.setApiKey(keystone.get('stripeApiKey'));

		// var amount = 17900;
		var amount = 4900;

		var COUPON_ID = req.body.coupon;
		// console.log('THIS IS COUPON ' + COUPON_ID);
		if(COUPON_ID){
			// console.log('retreiveing coupon')
			stripe.coupons.retrieve(COUPON_ID, function (e, c) {
				// console.log(e, c);
				if(!e){
					// console.log(c)
					if(c.percent_off){
						var percent = amount * (c.percent_off / 100);
						amount = amount - percent;
					}else if(c.amount_off){
						amount = amount - c.amount_off;
					}

					if(amount === 0)
						if(!req.user)
					  		build_user(fields, view, req, locals, res);
					  	else getPages(view, locals, req, res);
					else
						start();
				}else start();
				
				
			});
		}else start();
		


		function start(){
			// Get the credit card details submitted by the form
			var stripeToken = req.body.stripeToken;
			// console.log(amount);

			if(!stripeToken){
				if(amount !== 0){
					res.locals.error = 'No card info was put in';
				
					if(req.path.match('register'))
						view.render('register');				
					else if(!req.body.freepass) {
						view.render('checkout');
					}
				}
			}
			if(!req.body.freepass || freepass.length){
				console.log(req.headers.referer);
				if(req.headers.referer.match('register')){
					stripe.customers.create({
					  description: 'OPIQ Customer',
					  card: stripeToken, // obtained with Stripe.js
					  email: req.body.email
					}).then(function (customer) {
						return stripe.charges.create({
						    amount: amount, // amount in cents, again
						    currency: "usd",
						    customer: customer.id,
						    description : "OPIQ Charge"
						 });
					}).then(function (charge) {

						if(!req.user){
				  			build_user(fields, view, req, locals, res);
				  		}else getPages(view, locals, req, res);
					});
				}else
					 var charge = stripe.charges.create({
						  amount: amount, // amount in cents, again
						  currency: "usd",
						  card: stripeToken,
						  description: "OPIQ Charge"
						}, function(err, charge) {
						
							console.log(err, charge);
						  if (err && err.type === 'StripeCardError') {
						    
						  }else
						  	if(!req.user){
						  		build_user(fields, view, req, locals, res);
						  	}else getPages(view, locals, req, res);
						  
						});
				

					
			}else
				if(!req.user)
			  		build_user(fields, view, req, locals, res);
			  	else getPages(view, locals, req, res);

		}
		
		

	} 
	
}


function build_user (fields, view, req, locals, res) {
	var newUser = User.model({
		name : { first : fields.firstname, last : fields.lastname},
		email : fields.email,
		password : fields.password
	})

	locals.categories = {};
	locals.categories.cats = [];
	locals.analysis = {};
	locals.cat_totals = {};
	locals.main_total = 0;

	var ip = req.headers['x-forwarded-for'];
	newUser.save(function(err){
		if(err)console.log(err)

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
					console.log('setting route to questions');
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
						// Render the view
						// res.redirect('/');
					});
				})
				
				
			}else {
				// res.redirect('/');
				session.signin(req.body, req, res, onSuccess, onFail);
			}

			function onSuccess () {
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
