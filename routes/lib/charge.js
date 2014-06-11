var keystone = require('keystone'),
	stripe = require('stripe')();

exports = module.exports = function(req, res) {



	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://manage.stripe.com/account
	// stripe.setApiKey("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
	stripe.setApiKey('sk_test_His9L7RGJvdVRuuPOkCeuand');

	// (Assuming you're using express - expressjs.com)
	// Get the credit card details submitted by the form
	var stripeToken = req.body.stripeToken;

	
	var charge = stripe.charges.create({
	  amount: 1000, // amount in cents, again
	  currency: "usd",
	  card: stripeToken,
	  description: "payinguser@example.com"
	}, function(err, charge) {
		
		
	  if (err && err.type === 'StripeCardError') {
	    
	  }else{
	  	getPages();
	  }
	});
}

function getPages (req) {
	var view = new keystone.View(req, res),
		locals = res.locals;


		locals.categories = {};
		locals.categories.cats = [];
 		locals.analysis = {};
 		locals.cat_totals = {};
 		locals.main_total = 0;

	Page.model.find()
		.sort('order')
	    .exec(function(err, pages) {
	    		var cat_totals = {}, total_pages_answered = 0, main_total = 0;
	    		for(var i = 0; i < pages.length; i++){
					var answer;
	    			if(answers)
	    				answer = _.findWhere(answers, {page : pages[i].name});

					locals.categories.cats = _.uniq(_.pluck(pages, 'category'));


					pages[i].answer =  answer ? answer.answer : 0;


					if(typeof locals.categories[pages[i].category] === 'undefined')
						locals.categories[pages[i].category] = [];


					if(typeof cat_totals[pages[i].category] === 'undefined'){
						// console.log(pages[i].category)
						cat_totals[pages[i].category] = {};
						cat_totals[pages[i].category].total = 0;
						cat_totals[pages[i].category].total_pages = 0;
					}

					if(answer){
						total_pages_answered += 1;
						cat_totals[ pages[i].category ].total +=  Number(answer.answer);
						// console.log(pages[i].category, answer.answer)
						cat_totals[ pages[i].category ].total_pages += 1;
						main_total += Number(answer.answer);
					}
					locals.categories[pages[i].category].push(pages[i]);
					
					
				}
				


				locals.main_total = (main_total / total_pages_answered) * 20;

				for(var i in cat_totals){
					// console.log(cat_totals[i])
					locals.cat_totals[ i ] = (cat_totals[i].total / cat_totals[i].total_pages) * 20;
				}
				
				
				if(answers)
					locals.answers = answers;
				

				// Set locals
				locals.pages = pages;
				
				// Render the view
				view.render('index');
			});
		
}