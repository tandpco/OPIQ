var keystone = require('keystone'),
		Analysis = keystone.list('Analysis');

exports = module.exports = function(req, res) {

	var locals = res.locals,
		  view = new keystone.View(req, res);

	if (req.user) {

	  console.log(req.user.tempPass);

		Analysis.model.find({user: req.user._id}).exec(function(eerr, analysis){
			locals.analysis = analysis;
			view.render('analysis');
		});

	} else {

		req.session.trialID = keystone.utils.randomString([16,24]);
		locals.analysis = [];
		view.render('analysis');

	}

}