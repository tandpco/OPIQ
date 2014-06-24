var keystone = require('keystone'),
	session = require('keystone/lib/session'),
	Answer = keystone.list('Answer');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;


	if (req.method == "POST") {
		
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email address and password.');
			
			return view.render('signin');
		}
		
		var onSuccess = function(user) {
			
			res.redirect('questions');
			
		}
		
		var onFail = function() {
			req.flash('error', 'Sorry, that email and password combo are not valid.');
			view.render('signin');
		}
		
		session.signin(req.body, req, res, onSuccess, onFail);

	}
	else {
		view.render('signin');
	}
}