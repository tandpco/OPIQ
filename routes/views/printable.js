var	keystone = require('keystone'),
	Answer = keystone.list('Answer'),
	Analysis = keystone.list('Analysis'),
	Page = keystone.list('Page'),
	_ = require('underscore');



exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals,
		ip = req.headers['x-forwarded-for'];
	// locals.analysis = req.session.analysis;
	locals.categories = {};
	locals.categories.cats = [];
	locals.cat_totals = {};

	var id, user;

	if (req.body.origin == 'dashboard') {
		var id  = req.body['an-id']
			user  = req.body['an-user'],
			title = req.body['an-title'];
		  req.session.analysis = title;
	} else if (req.session.analysisid) {
		var id   = req.session.analysisid,
				user = req.user._id;
	}

	// Analysis.model.find({_id = id}).exec(function(e, analysis) {
	// 	locals.analysis = 
	// })

	Answer.model.find({analysis : id, user : user}).exec(function (e, answers) {
		locals.analysis = answers;
		Page.model.find().sort('order').exec(function  (e, pages) {
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
			


			locals.main_total = Math.round((main_total / total_pages_answered) * 20);

			for(var i in cat_totals){
				// console.log(cat_totals[i])
				locals.cat_totals[i] = (cat_totals[i].total / cat_totals[i].total_pages) * 20;
			}
			
			
			if(answers) {
				locals.answers = answers;
			}

			// Set locals
			locals.pages = pages;

			showPage();
		})
	})

	function showPage () {
		view.render('print-report');
	}
}