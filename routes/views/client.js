var keystone = require('keystone'),
		session  = require('keystone/lib/session'),
		User     = keystone.list('User');

exports = module.exports = function(req, res) {

	var view   = new keystone.View(req, res),
			locals = res.locals,
			user   = req.user;

	locals.newPassword = user.tempPass;

	if (user.userLevel === 'Client Level') {
		locals.userID = user._id;
		view.render('client');
	} else {
		req.flash('error', 'Your account type does not have access to the client center.')
		res.redirect('/');
	}
	
}