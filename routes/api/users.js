var async = require('async'),
	keystone = require('keystone');
 
var Post = keystone.list('User');
 
/**
 * List Posts
 */
exports.list = function(req, res) {

	Post.model.find(function(err, users) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			data: users
		});
		
	});
	
}

exports.get = function(req, res) {
	Post.model.findById(req.params.id).exec(function(err, user) {
		
		if (err) return res.apiError('database error', err);
		if (!user) return res.apiError('not found');
		
		res.apiResponse({
			data: user
		});
		
	});
}
