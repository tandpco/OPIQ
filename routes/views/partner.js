var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	req.session = false;

	var id = req.user._id;

	locals.userID = id;
	
	view.render('partner');
	
}