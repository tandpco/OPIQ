var keystone   = require('keystone'),
		Analysis   = keystone.list('Analysis'),
		stripecust = require('../lib/stripecust.js');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	
	stripecust.addCard(req);

	if (req.session.analysisid) {

		res.redirect('/questions/'+req.session.analysisid);

	} else {

		Analysis.model.findOne({user: req.user._id}).exec(function(err, assessment) {

			if (assessment) {
				res.redirect('/questions/'+assessment._id);
			} else {
				view.render('register_success');
			}

		});

	}

}