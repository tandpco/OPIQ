var keystone = require('keystone'),
	session = require('keystone/lib/session'),
	Answer = keystone.list('Answer');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;


	if (req.method == "POST") {
		
		if (!req.body.email || !req.body.password) {

			req.flash('error', 'Please enter your email address and password.');			
			return view.render('login');
			
		}
		
		var onSuccess = function(user) {

			var redirect = req.query.redirect;
			
			res.redirect('/');
			
		}
		
		var onFail = function() {

			req.flash('error', 'Sorry, that email and password combo are not valid.');
			view.render('login');

		}
		
		session.signin(req.body, req, res, onSuccess, onFail);

	}

	else {

		if (req.query.auth) {

			var onSuccess = function(user) {
				req.session.newPassword = true;
				user.tempPass = true;
				user.save();
				res.redirect('/');
			}
			
			var onFail = function() {
				req.flash('error', 'Sorry, that email and password combo are not valid.');
				view.render('login');
			}

			session.signin(req.query.auth, req, res, onSuccess, onFail);			

		} else {

			view.render('login');

		}

	}

}