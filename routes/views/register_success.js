var keystone = require('keystone'),
	Analysis = keystone.list('Analysis');


exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var ip = req.headers['x-forwarded-for'];
	console.log('route to questions ', keystone.get(ip + 'routeToQuestions'));
	if(keystone.get(ip + 'routeToQuestions'))
		Analysis.model.findOne({user : req.user._id}).exec(function (e, r) {
			res.locals.analysis = r;
			view.render('register_success');
			keystone.set(ip + 'routeToQuestions', null);
		})
	else
		view.render('register_success');
}