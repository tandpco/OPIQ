var keystone   = require('keystone'),
		Analysis   = keystone.list('Analysis'),
		stripecust = require('../lib/stripecust.js');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	
	stripecust.addCard(req);

	if (req.session.analysisid) {

		res.redirect('/questions/'+req.session.analysisid);

	} else {

		var id = (req.user.trialID ? req.user.trialID : req.user._id);

		Analysis.model.findOne({user: id}).exec(function(err, assessment) {

			if (assessment) {

				res.redirect('/questions/'+assessment._id);

				assessment.set({
					user: req.user._id
				});

				assessment.save();

			} else {

				view.render('register_success');
				
			}

		});

	}

}