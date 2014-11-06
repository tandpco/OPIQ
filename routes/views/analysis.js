var keystone = require('keystone'),
	Analysis = keystone.list('Analysis');

exports = module.exports = function(req, res) {
	var locals = res.locals,
		view = new keystone.View(req, res);
	if(req.user)
		Analysis.model.find({user : req.user._id}).exec(function(e, analysis){
			locals.analysis = analysis;
			view.render('analysis');
			console.log(req.user)
		})
	else {
		locals.analysis = [];
		view.render('analysis');
	}
}