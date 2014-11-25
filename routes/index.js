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



// keystone.set('stripeApiKey', 'sk_test_His9L7RGJvdVRuuPOkCeuand'); // Test ENV key
// keystone.set('stripeApiKeyClient', 'pk_test_SxLXrzbxiAiTwnt8qiOW1agS'); // Test client ENV key

keystone.set('stripeApiKey', 'sk_live_cSlbqodvJ9gkpQ9030kwv46v'); // Live ENV key
keystone.set('stripeApiKeyClient', 'pk_live_xzV0TfLXuFF0sHWeon1lkayd'); // Live client ENV key


// // Common Middleware
// keystone.pre('routes',  function (req, res, next) {


// 	if(/opportunity/.test(req.headers.host)){
// 		keystone.set('stripeApiKey', 'sk_live_cSlbqodvJ9gkpQ9030kwv46v'); // Live ENV key
// 		keystone.set('stripeApiKeyClient', 'pk_live_xzV0TfLXuFF0sHWeon1lkayd'); // Live client ENV key
		
// 	}else{
// 		keystone.set('stripeApiKey', 'sk_test_His9L7RGJvdVRuuPOkCeuand'); // Test ENV key
// 		keystone.set('stripeApiKeyClient', 'pk_test_SxLXrzbxiAiTwnt8qiOW1agS'); // Test client ENV key	
// 	}

	
// 	next();
// });

keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);






// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	updatedb: importRoutes('./updatedb'),
	lib : importRoutes('./lib'),
	api: importRoutes('./api')
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
	app.get('/dashboard', routes.views.dashboard);
	app.get('/operational', routes.views.content);
	app.get('/product-services', routes.views.content);
	app.get('/customer', routes.views.content);
	app.get('/tos', routes.views.tos);
	app.get('/register-success', routes.views.register_success);
	app.post('/coupon', routes.lib.coupon);
	app.post('/logged', routes.updatedb.checklogged);
	app.post('/bklog', routes.lib.newbl);
	app.post('/savequestion', routes.updatedb.savequestion);
	app.post('/pdf', routes.lib.pdf);
	app.post('/charge', routes.lib.charge);
	app.post('/message', get_message);
	app.get('/forgot-page', routes.views.forgotPage);
	app.all('/print', routes.views.printable);
	app.post('/help', function(req, res) {
		var nodemailer = require("nodemailer");
		// create reusable transport method (opens pool of SMTP connections)
		var smtpTransport = nodemailer.createTransport("SMTP",{
		    service: "Mandrill",
		    auth: {
		        user: "opiq@launchthought.com",
		        pass: "0hhMPW05BM24YY73g7KzOg"
		    }
		});
		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: "OpportunityIQ <opiq@launchthought.com>", // sender address
		    to: "grantmwebster@gmail.com", // list of receivers
		    subject: "OPIQ " + req.body.page, // Subject line
			html: '<strong>' + req.body.page + '</strong><br /><br />' + req.body.question + '<br /><br /><b>From:</b> ' + req.body.user + '<br><b>Email Address:</b> ' + req.body.email // html body
		}
		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        res.send(true);
		    }

		    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
		});
	});
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

	app.post('/questions', routes.views.index);
	app.get('/questions', function(req, res, next) {
		// if(req.session.analysisid) {
		// 	if (req.originalUrl != '/questions')
		// 		res.redirect('/');
		// 	else
		// 		res.writeHead(200);
		// 		res.pause();
		// 		console.log(req.headers)
		// } else {
		// 	res.redirect('/');
		// }
		res.redirect('/');
	});
	app.all('/login', routes.views.login);
	app.all('/register', routes.views.register);
	app.all('/contact', routes.views.contact);

	app.all('/api/v1/users/list', keystone.initAPI, routes.api.users.list);
	app.all('/api/v1/user/:id', keystone.initAPI, routes.api.users.get);
	app.all('/api/v1/user/:id/assessments', keystone.initAPI, routes.api.analysis.list);
	app.all('/api/v1/assessment/:id/:user', keystone.initAPI, routes.api.analysis.answers);
	app.all('/api/v1/pages/list', keystone.initAPI, routes.api.analysis.pages);
	app.all('/api/v1/assessment/:id', keystone.initAPI, routes.api.analysis.assessment);
	app.all('/api/v1/answer/:id/:page', keystone.initAPI, routes.api.analysis.answer);
	app.all('/api/v1/page/:id', keystone.initAPI, routes.api.analysis.page);

	// UI Router States
	app.get('/partials/user', routes.views.states.user)
	app.get('/partials/search', routes.views.states.search)
	app.get('/partials/assessment', routes.views.states.assessment)
	app.get('/partials/page', routes.views.states.page)
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
}
