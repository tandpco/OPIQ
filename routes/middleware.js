/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
	querystring = require('querystring'),
	keystone = require('keystone'),
	bodyParser = require('body-parser');


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'Contact',		key: 'contact',		href: '/contact' }
	];
	
	locals.user = req.user;
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		if (req.originalUrl.indexOf('partner') > -1) {
			res.redirect('/login?redirect=partner')
		} else {
			res.redirect('/login');
		}
	} else {
		next();
	}
	
}


/**
 * SSL MIDDLEWARE
 */
exports.forceSSL = function(req,res,next) {
	// console.log('yepp chaning to ssl');
	// //this should work for local development as well
	// var sslHost = keystone.get('ssl host') || keystone.get('host') || process.env.HOST || process.env.IP, 
	// 	sslPort = keystone.get('ssl port') || 3001;
	// if(!sslHost) {
	// 	var gethost=req.get('host').replace('http://','').split(':');
	// 	sslHost=gethost[0];
	// }
	// //fix port for external webserver use
	// // if(sslPort)sslPort=':'+sslPort;
	// // if (!req.secure) {
	// 	return res.redirect('https://' + sslHost  + req.url);
	// // }
	next();
}


exports.initAPI = function(keystone) {
	return function initAPI(req, res, next) {
		
		res.apiResponse = function(data) {
			if (req.query.callback) {
				res.jsonp(data);
			} else {
				res.json(data);
			}
		};

		res.apiError = function(key, err, msg, code) {
			msg = msg || 'Error';
			key = key || 'unknown error';
			msg += ' (' + key + ')';
			if (keystone.get('logger')) {
				console.log(msg + (err ? ':' : ''));
				if (err) {
					console.log(err);
				}
			}
			res.status(code || 500);
			res.apiResponse({ error: key || 'error', detail: err });
		};
		
		res.apiNotFound = function (err, msg) {
			res.apiError('data not found', err, msg || 'not found', 404);
		};
		
		res.apiNotAllowed = function (err, msg) {
			res.apiError('access allowed', err, msg || 'not allowed', 403);
		};

		next();
	};
};
