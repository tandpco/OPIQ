var keystone = require('keystone');

exports = module.exports = function(req, res) {
		var view = new keystone.View(req, res);


	    if (!req.session.reset) return req.flash('error', 'reset token not set');

	    var password = req.body.password;
	    var confirm = req.body.confirm;
	    if (password !== confirm) return req.flash('error', 'passwords do not match');

	    // update the user db here

	    forgot.expire(req.session.reset.id);
	    delete req.session.reset;
	    res.flash('success','password reset');

	    setTimeout(function () {
	    	view.render('/');
	    }, 3000);
	}