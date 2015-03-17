var keystone = require('keystone'),
	Analysis = keystone.list('Analysis');

exports = module.exports = function(req, res) {

	var locals = res.locals,
		  view = new keystone.View(req, res);

	if (!req.user) {
		req.session.userID = keystone.utils.randomString([16,24]);
	}

	if (req.user) {

		Analysis.model.find({user: req.user._id}).exec(function(e, analysis){
			locals.analysis = analysis;
			view.render('analysis');
		});

	} else {

		locals.analysis = [];
		view.render('analysis');

	}

}