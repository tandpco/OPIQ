var keystone = require('keystone'),
	session = require('keystone/lib/session');

exports = module.exports = function(req, res) {
	session.signout(req, res, function() {
			res.redirect('/');
	});
	
}
