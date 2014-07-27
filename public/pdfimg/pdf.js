var phantom = require('phantom'),
	keystone = require('keystone'),
	Answer = keystone.list('Answer'),
	Page = keystone.list('Page'),
	_ = require('underscore');




exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;
		locals.categories = {};
		locals.categories.cats = [];
		
	if(req.user)
	Page.model.find().sort('order').exec(function(err, pages) {
		Answer.model.find({user : req.user._id}).exec(function (err, answers) {
			for(var i = 0; i < pages.length; i++){
				var answer = _.where(answers, {page : pages[i].name})[0];
				pages[i].answer =  answer ? answer.answer : 0;

				if(locals.categories.cats.indexOf(pages[i].category) < 0)
					locals.categories.cats.push(pages[i].category);

				if(typeof locals.categories[pages[i].category] === 'undefined')
					locals.categories[pages[i].category] = [];
				locals.categories[pages[i].category].push(pages[i]);
				
			}

			locals.analysis = keystone.get('analysis-title');
			
			locals.pages = pages;
			locals.categories.cats;
			locals.answers = answers;

			view.render('newpdf');		
		})
	})
}