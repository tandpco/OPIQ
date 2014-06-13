var keystone = require('keystone'),
	User = keystone.list('User'),
	stripe = require('stripe')(),
	Answer = keystone.list('Answer'),
	Analysis = keystone.list('Analysis'),
	Page = keystone.list('Page'),
	session = require('keystone/lib/session'),
	_ = require('underscore');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals,
		fields = req.body || {},
		ip = req.connection.remoteAddress;


	locals.categories = {};
	locals.categories.cats = [];
	locals.analysis = {};
	locals.cat_totals = {};
	locals.main_total = 0;
	
	if(req.method === 'GET')
		view.render('register');
	else{
		var coupon;
		// Set your secret key: remember to change this to your live secret key in production
		// See your keys here https://manage.stripe.com/account
		stripe.setApiKey("sk_live_cSlbqodvJ9gkpQ9030kwv46v");
		// stripe.setApiKey("sk_test_His9L7RGJvdVRuuPOkCeuand"); // TESTING PURPOSES

		var amount = 17900;

		var COUPON_ID = req.body.coupon;

		
		if(COUPON_ID){
			console.log('retreiveing coupon')
			stripe.coupons.retrieve(COUPON_ID, function (e, c) {
				console.log(e, c);
				if(!e){
					console.log(c)
					if(c.percent_off){
						var percent = amount * (c.percent_off / 100);
						amount = amount - percent;
					}else if(c.amount_off){
						amount = amount - c.amount_off;
					}
					start();
				}else start();
				
				
			});
		}else start();
		


		function start(){
			// Get the credit card details submitted by the form
			var stripeToken = req.body.stripeToken;

			if(!req.body.freepass)
				var charge = stripe.charges.create({
				  amount: amount, // amount in cents, again
				  currency: "usd",
				  card: stripeToken,
				  description: "payinguser@example.com"
				}, function(err, charge) {
				
					// console.log(err, charge);
				  if (err && err.type === 'StripeCardError') {
				    
				  }else
				  	if(!req.user){
				  		build_user(fields, view, req, locals, res);
				  	}else getPages(view, locals, req, res);
				  
				});
			else
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

	var ip = req.connection.remoteAddress;
	newUser.save(function(err){
		if(err)console.log(err)

		User.model.findOne({email : fields.email}).exec(function(er, user){
			var backlog = keystone.get(ip + 'backlog'), ans;

			
			
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
							notes : backlog[i].notes
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
				console.log("Failed to sign in");
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