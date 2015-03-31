var async = require('async'),
		keystone = require('keystone'),
		mongoose = require('mongoose');
 
var User     = keystone.list('User'),
		Keys     = keystone.list('License Keys'),
		Invoices = keystone.list('Invoices');
 
/**
 * List Keys for License Partner
 */
exports.listKeysDist = function(req, res) {

	var userID = req.params.id;

	Keys.model.find({licensePartner: userID}).exec(function(err, keys) {
		res.apiResponse({
			data: keys
		});
	});

}

exports.listKeysClient = function(req, res) {

	var userID = req.params.id;

	Keys.model.find({client: userID}).exec(function(err, keys) {
		res.apiResponse({
			data: keys
		});
	});

}

exports.listKeysUser = function(req, res) {

	var userID = req.params.id;

	Keys.model.find({user: userID}).exec(function(err, keys) {
		res.apiResponse({
			data: keys
		});
	});

}

exports.listInvoicesDist = function(req, res) {

	var userID = req.params.id;

	Invoices.model.find({licensePartner: userID}).exec(function(err, invoice) {
		res.apiResponse({
			data: invoice
		});
	});

}