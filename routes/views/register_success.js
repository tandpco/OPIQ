var keystone = require('keystone'),
	Analysis = keystone.list('Analysis');


exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var ip = req.headers['x-forwarded-for'];

	if(keystone.get(ip + 'routeToQuestions') || req.session.newanalysis){
		var obj = {user : req.user._id};

		if(req.session.newanalysis)obj.title = req.session.newanalysis;
		Analysis.model.findOne(obj).exec(function (e, r) {
			res.locals.analysis = r;
			view.render('register_success');
			keystone.set(ip + 'routeToQuestions', null);
		})
	}else
		view.render('register_success');
}