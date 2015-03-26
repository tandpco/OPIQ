var async = require('async'),
	keystone = require('keystone');
 
var Post    = keystone.list('User'),
		Clients = keystone.list('License Partner Clients');
 
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


/**
 * Get Users by License Partner
 */
exports.partnerClients = function(req, res) {
	Post.model.find({licensePartner: req.params.id, userLevel: 'Client Level'}).exec(function(err, user) {
		
		if (err) return res.apiError('database error', err);
		if (!user) return res.apiError('not found');
		
		res.apiResponse({
			data: user
		});
		
	});
}

/**
 * Get Staff by License Partner
 */
exports.partnerStaff = function(req, res) {
	Post.model.find({licensePartner: req.params.id, userLevel: 'Staff Level'}).exec(function(err, user) {
		
		if (err) return res.apiError('database error', err);
		if (!user) return res.apiError('not found');
		
		res.apiResponse({
			data: user
		});
		
	});
}
