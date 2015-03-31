var async = require('async'),
		keystone = require('keystone'),
		mongoose = require('mongoose');
 
var User    = keystone.list('User');
 
/**
 * List Users
 */
exports.list = function(req, res) {

	User.model.find(function(err, users) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			data: users
		});
		
	});
	
}

exports.get = function(req, res) {
	User.model.findById(req.params.id).exec(function(err, user) {
		
		if (err) return res.apiError('database error', err);
		if (!user) return res.apiError('not found');
		
		res.apiResponse({
			data: user
		});
		
	});
}


/**
 * Get Clients by License Partner
 */
exports.partnerClients = function(req, res) {
	User.model.find({licensePartner: req.params.id, userLevel: 'Client Level'}).exec(function(err, user) {
		
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
	User.model.find({licensePartner: req.params.id, userLevel: 'Staff Level'}).exec(function(err, user) {
		
		if (err) return res.apiError('database error', err);
		if (!user) return res.apiError('not found');
		
		res.apiResponse({
			data: user
		});
		
	});
}

/**
 * Create Client for License Partner
 */
exports.createClient = function(req, res) {

	var data = req.body,
			pass = keystone.utils.randomString([16,24]);

	newUser = new User.model({
		name: {
			first: data.name['first'],
			last: data.name['last']
		},
		password: pass,
		tempPass: pass,
		email: data.email,
		userLevel: 'Client Level',
		licensePartner: data.licensePartner
	});

	newUser.save(function(err) {
		if (err) return err;
		console.log('Saved.')
	});

	res.apiResponse({
		data: newUser
	})

}

/**
 * Update Client for License Partner
 */
exports.updateClient = function(req, res) {

	var userID = req.params.id,
			data   = req.body;

	User.model.findOne({_id: userID}).exec(function(err, user) {
		user.set({
			name: {
				first: data.name['first'],
				last: data.name['last']
			},
			email: data.email
		})
		user.save(function(err) {
			if (err) return err;
		});
		res.apiResponse({
			data: user
		});
	});
	// res.redirect('/partner')

}

/**
 * Remove Client for License Partner
 */
exports.removeClient = function(req, res) {

	var userID = req.params.id,
			data   = req.body;

	User.model.findOne({_id: userID}).exec(function(err, user) {
		user.remove(function(err) {
			if (err) return err;
			res.apiResponse({
				data: user
			});
		});
	});
	// res.redirect('/partner')

}

/**
 * Create Client for License Partner
 */
exports.createStaff = function(req, res) {

	var data = req.body,
			pass = keystone.utils.randomString([16,24]);

	newUser = new User.model({
		name: {
			first: data.name['first'],
			last: data.name['last']
		},
		password: pass,
		tempPass: pass,
		email: data.email,
		userLevel: 'Staff Level',
		licensePartner: data.licensePartner,
		role: data.role
	});

	newUser.save(function(err) {
		if (err) return err;
		console.log('Staff Member Created');
	});

	res.apiResponse({
		data: newUser
	});

}

/**
 * Update Client for License Partner
 */
exports.updateStaff = function(req, res) {

	var userID = req.params.id,
			data   = req.body;

	User.model.findOne({_id: userID}).exec(function(err, user) {
		user.set({
			name: {
				first: data.name['first'],
				last: data.name['last']
			},
			email: data.email,
			role: data.role
		})
		user.save(function(err) {
			if (err) return err;
		});
		res.apiResponse({
			data: user
		});
	});
	// res.redirect('/partner')

}

/**
 * Remove Client for License Partner
 */
exports.removeStaff = function(req, res) {

	var userID = req.params.id,
			data   = req.body;

	User.model.findOne({_id: userID}).exec(function(err, user) {
		user.remove(function(err) {
			if (err) return err;
			res.apiResponse({
				data: user
			});
		});
	});
	// res.redirect('/partner')

}

/**
 * Get Users for Client
 */
exports.listClientUsers = function(req, res) {

	var userID = req.params.id;

	User.model.find({client: userID}).exec(function(err, users) {
		res.apiResponse({
			data: users
		});
	});

}

/**
 * Update User for Client
 */
exports.updateUser = function(req, res) {

	var userID = req.params.id,
			data   = req.body;

	User.model.findOne({_id: userID}).exec(function(err, user) {
		user.set({
			name: {
				first: data.name['first'],
				last: data.name['last']
			},
			email: data.email
		})
		user.save(function(err) {
			if (err) return err;
		});
		res.apiResponse({
			data: user
		});
	});

}

/**
 * Remove User for Client
 */
exports.removeUser = function(req, res) {

	var userID = req.params.id,
			data   = req.body;

	User.model.findOne({_id: userID}).exec(function(err, user) {
		user.remove(function(err) {
			if (err) return err;
			res.apiResponse({
				data: user
			});
		});
	});

}

/**
 * Create Client for License Partner
 */
exports.createUser = function(req, res) {

	var data = req.body,
			pass = keystone.utils.randomString([16,24]);

	newUser = new User.model({
		name: {
			first: data.name['first'],
			last: data.name['last']
		},
		password: pass,
		tempPass: 'true',
		email: data.email,
		userLevel: 'User Level',
		client: data.client
	});

	newUser.save(function(err) {
		if (err) return err;
		console.log('Saved.')
	});

	res.apiResponse({
		data: newUser
	});

}