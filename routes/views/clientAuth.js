var keystone = require('keystone'),
		session  = require('keystone/lib/session');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	if (req.method == 'POST') {

		var user = req.user;

		locals.userID = user._id;

		var success = function() {
					console.log('Signed in!');
					res.redirect('/client-center');
				},
				fail    = function() {
					console.log('Fail.');
				};

		var data = req.body;

		user.password = data.password;
		user.tempPass = false;

		user.save(function(err) {
			session.signin(user._id, req, res, success, fail);
		});

	} else {

		var auth = req.query.auth;

		var success = function(user) {
			req.session.newPassword = true;
			user.tempPass = true;
			user.save();
			res.redirect('/client-center');
		}

		var fail = function(err) {
			console.log(err);
		}

		session.signin(auth, req, res, success, fail);

	}

	// res.redirect('/partner');
	
}