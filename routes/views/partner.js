var keystone = require('keystone'),
		session  = require('keystone/lib/session'),
		User     = keystone.list('User');

exports = module.exports = function(req, res) {

	var view   = new keystone.View(req, res),
			locals = res.locals,
			user   = req.user;

	locals.newPassword = user.tempPass;

	console.log(user.tempPass, locals.newPassword);

	if (user.userLevel === 'Staff Level' || user.userLevel === 'Distributor Level') {
		if (user.userLevel === 'Distributor Level') {
			locals.userID = user._id;
			view.render('partner');
		} else if (user.userLevel === 'Staff Level') {
			User.model.findOne({_id: user.licensePartner}).exec(function(err, userData) {
				if (err) console.log(err);
				console.log(userData);
				locals.userID = userData._id;
				view.render('partner');
			});
		}
	} else {
		req.flash('error', 'Your account type does not have access to the partner center.')
		res.redirect('/');
	}
	
}