var async = require('async'),
		keystone = require('keystone'),
		mongoose = require('mongoose');
 
var User = keystone.list('User'),
		Keys = keystone.list('License Keys');
 
/**
 * List Keys for License Partner
 */
exports.listKeysDist = function(req, res) {

	var userID = req.params.id;
			// data   = req.body;

	Keys.model.find({licensePartner: userID}).exec(function(err, keys) {
		res.apiResponse({
			data: keys
		});
	});
	// res.redirect('/partner')

}