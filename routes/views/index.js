var keystone = require('keystone'),
	_ = require('underscore');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res),
	    Page = keystone.list('Page'),
	    Answer = keystone.list('Answer'),
	    Analysis = keystone.list('Analysis'),
	    ip = req.connection.remoteAddress;

	    locals.categories = {};
		locals.categories.cats = [];
 		locals.analysis = {};
 		locals.cat_totals = {};
 		locals.main_total = 0;

 	if(req.user){
 		// console.log(req.body);
 	
 		if(req.body.newa){
 			Analysis.model.find({user : req.user._id}).exec(function (e, an) {
 				// locals.analysis = req.body.analysis;
 				if(an.length === 0 || req.user.freeAccess){
 					var a = new Analysis.model({
 						title : req.body.analysis,
 						user : req.user._id
 					});
 					a.save(function(){
	 					Analysis.model.findOne({user: req.user._id, _id : a._id}).exec(function(e, an){
	 						locals.analysis = an;
	 						getPages();					
	 					})
 					});

 				
 				}else {
 					locals.analysis = req.body.analysis;
 					
 					view.render('checkout');
 				}
 			})
 			
 			// getPages();
 		}else{
 	
 			Analysis.model.findOne({_id : req.body._id}).exec(function(e, an){
 				if(e)console.log(e);
 				locals.analysis = an;
 				console.log(an);
 				start(an);
 			});
 		}

 		function start(an){
 		if(an)
			Answer.model.find({user : req.user._id, analysis : an._id}).exec(function (err, answers) {
				if(err)console.log(err);
				keystone.set('analysis', an._id);
				keystone.set('analysis-title', an.title);
				getPages(answers);
			});

		}

		function getPages (answers) {
		
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
						
						console.log(answers);
						// Set locals
						locals.pages = pages;
						
						// Render the view
						view.render('index');
					});
				
		}
		
	}else{
	
		var a = new Analysis.model({
			title : req.body.analysis,
			user : ip
		})

		locals.analysis.title = req.body.analysis;
		a.save();
		lgetPages();
 		

 	
 		function lgetPages () {
	 		Page.model.find()
			.sort('order')
		    .exec(function(err, pages) {
		    	for(var i = 0; i < pages.length; i++){
					
		    		

					locals.categories.cats = _.uniq(_.pluck(pages, 'category'));

					pages[i].answer = 0;
					if(typeof locals.categories[pages[i].category] === 'undefined')
						locals.categories[pages[i].category] = [];


					locals.categories[pages[i].category].push(pages[i]);
					
				}


				// Set locals
				locals.pages = pages;
				
				// Render the view
				view.render('index');
			});
		}
	}
		

}