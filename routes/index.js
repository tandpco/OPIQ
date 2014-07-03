/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname),
	url = require('url'),
	User = keystone.list('User');






// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
// keystone.set('cloudinary config', { 
// 	cloud_name: 'duemkn2nj', 
// 	api_key: '568768714353137', 
// 	api_secret: 'uLeUIKycXGk4_kMaw9WalaDpM1Y' 
// });
//

 
// Set api keys globally
// keystone.set('stripeApiKey', 'sk_live_cSlbqodvJ9gkpQ9030kwv46v'); // Live ENV key
keystone.set('stripeApiKey', 'sk_test_His9L7RGJvdVRuuPOkCeuand'); // Test ENV key


// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	updatedb: importRoutes('./updatedb'),
	lib : importRoutes('./lib')
};


function get_message (req, res) {
	console.log(req.body);
}

// Setup Route Bindings
exports = module.exports = function(app) {
	// Session
	app.all('/:route', middleware.forceSSL);
	app.all('/', middleware.forceSSL);




	// Views
	app.get('/', routes.views.analysis);
	app.get('/allanswers', routes.updatedb.getallanswers);
	app.get('/report', routes.views.report);
	app.get('/signout', routes.views.signout);
	app.get('/industry', routes.views.content);
	app.get('/financial', routes.views.content);
	app.get('/operational', routes.views.content);
	app.get('/product-services', routes.views.content);
	app.get('/customer', routes.views.content);
	app.get('/tos', routes.views.tos);
	app.get('/print', routes.views.printable);
	app.get('/register-success', routes.views.register_success);
	app.post('/coupon', routes.lib.coupon);
	app.post('/logged', routes.updatedb.checklogged);
	app.post('/bklog', routes.lib.newbl);
	app.post('/savequestion', routes.updatedb.savequestion);
	app.post('/charge', routes.lib.charge);
	app.post('/message', get_message);
	app.get('/forgot-page', routes.views.forgotPage);
	app.post('/forgot', function (req, res) {
		var view = new keystone.View(req, res);
	    var email = req.body.email;
	    var ip = req.connection.remoteAddress;
		
		var crypto = require('crypto')
		  , shasum = crypto.createHash('sha1')
		var mail = require("nodemailer").mail;



		User.model.find({email : email}).exec(function (i, e) {
			if(e.length > 0){
				shasum.update("foo");
				var uri = shasum.digest('hex');

				keystone.set(ip + 'reset', {email : email , token : uri});

				mail({
				    from: "notifications@opportunityIQ.com", // sender address
				    to: email, // list of receivers
				    subject: "Change Password", // Subject line
				    html: "Click <a href='http://localhost:3000/reset?" + uri + "'>here to change your password</a>"
				});
				req.flash('success', 'Check your inbox or spam box for a password reset message.');
			    view.render('forgot-page');
			}else{
				req.flash('error', 'No user found for email address');
				view.render('forgot-page');
			}
		})

	});
	app.get('/reset', function  (req, res) {
		var view = new keystone.View(req, res);

		view.render('reset');
	})
	app.post('/reset', function (req, res) {
		var view = new keystone.View(req, res),
			User = keystone.list('User'),
			ip = req.connection.remoteAddress;

	    if (!keystone.get(ip + 'reset')) {
	    	req.flash('error', 'reset token not set');
	    	view.render('reset');
	    	return;
	    }

	    var password = req.body.password;
	    var confirm = req.body.confirm;
	    if (password !== confirm) {
	    	req.flash('error', 'passwords do not match');
	    	view.render('reset');
	    	return;
	    }

	    User.model.findOne({email : keystone.get(ip + 'reset').email}).exec(function (e, u) {
	    	u.password = password;
	    	u.save();
	    })

	   

	    req.flash('success', 'password reset');
	    keystone.set(ip + 'reset', null);
	    res.locals.relocate = 'true';
	    view.render('reset');

	    
	});
	app.all('/questions', routes.views.index);
	app.all('/login', routes.views.login);
	app.all('/register', routes.views.register);
	app.all('/contact', routes.views.contact);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
}
