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
  User = keystone.list('User'),
  bodyParser = require('body-parser');



// keystone.set('stripeApiKey', 'sk_test_His9L7RGJvdVRuuPOkCeuand'); // Test ENV key
// keystone.set('stripeApiKeyClient', 'pk_test_SxLXrzbxiAiTwnt8qiOW1agS'); // Test client ENV key

keystone.set('stripeApiKey', 'sk_live_cSlbqodvJ9gkpQ9030kwv46v'); // Live ENV key
keystone.set('stripeApiKeyClient', 'pk_live_xzV0TfLXuFF0sHWeon1lkayd'); // Live client ENV key


// // Common Middleware
// keystone.pre('routes',  function (req, res, next) {


//  if(/opportunity/.test(req.headers.host)){
//    keystone.set('stripeApiKey', 'sk_live_cSlbqodvJ9gkpQ9030kwv46v'); // Live ENV key
//    keystone.set('stripeApiKeyClient', 'pk_live_xzV0TfLXuFF0sHWeon1lkayd'); // Live client ENV key
    
//  }else{
//    keystone.set('stripeApiKey', 'sk_test_His9L7RGJvdVRuuPOkCeuand'); // Test ENV key
//    keystone.set('stripeApiKeyClient', 'pk_test_SxLXrzbxiAiTwnt8qiOW1agS'); // Test client ENV key  
//  }

  
//  next();
// });

keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
  updatedb: importRoutes('./updatedb'),
  lib: importRoutes('./lib'),
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

  // Reset Password
  app.all('/forgot-password', routes.views.password.forgotPass);
  app.all('/reset/:key', routes.views.password.resetPass);

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
  app.get('/register-success', routes.views.register_success);
  app.post('/coupon', routes.lib.coupon);
  app.post('/logged', routes.updatedb.checklogged);
  app.post('/bklog', routes.lib.newbl);
  app.post('/savequestion', routes.updatedb.savequestion);
  app.post('/print-report', routes.lib['print-report']);
  app.post('/charge', routes.lib.charge);
  app.post('/message', get_message);
  app.get('/forgot-page', function(req,res) {
    res.redirect('/forgot-password');
  });
  app.all('/print/:id', bodyParser({limit: '10mb'}), routes.views.printable);

  app.all('/report/:id', bodyParser({limit: '10mb'}), routes.views.reportPreview);

  app.all('/help', function(req, res) {
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
      to: "wade@boldmore.com", // list of receivers
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
  
  app.post('/questions', routes.views.index);
  app.get('/questions', function(req, res, next) {
    // if(req.session.analysisid) {
    //  if (req.originalUrl != '/questions')
    //    res.redirect('/');
    //  else
    //    res.writeHead(200);
    //    res.pause();
    //    console.log(req.headers)
    // } else {
    //  res.redirect('/');
    // }
    res.redirect('/');
  });

  app.get('/questions/:id', routes.views.index);
  app.all('/login', routes.views.login);
  app.all('/register', routes.views.register);
  app.all('/contact', routes.views.contact);

  // app.all('/api/v1/users/list', keystone.initAPI, routes.api.users.list);
  // app.all('/api/v1/user/:id', keystone.initAPI, routes.api.users.get);
  // app.all('/api/v1/user/:id/assessments', keystone.initAPI, routes.api.analysis.list);
  // app.all('/api/v1/assessment/:id/:user', keystone.initAPI, routes.api.analysis.answers);
  // app.all('/api/v1/pages/list', keystone.initAPI, routes.api.analysis.pages);
  // app.all('/api/v1/assessment/:id', keystone.initAPI, routes.api.analysis.assessment);
  // app.all('/api/v1/answer/:id/:page', keystone.initAPI, routes.api.analysis.answer);
  // app.all('/api/v1/page/:id', keystone.initAPI, routes.api.analysis.page);

  // 3.0+
  app.all('/api/v1/users/list', keystone.middleware.api, routes.api.users.list);
  // app.all('/api/v1/users/create', keystone.middleware.api, routes.api.users.list);
  app.all('/api/v1/user/:id', keystone.middleware.api, routes.api.users.get);
  app.all('/api/v1/user/:id/assessments', keystone.middleware.api, routes.api.analysis.list);
  app.all('/api/v1/assessment/:id/:user', keystone.middleware.api, routes.api.analysis.answers);
  app.all('/api/v1/pages/list', keystone.middleware.api, routes.api.analysis.pages);
  app.all('/api/v1/assessment/:id', keystone.middleware.api, routes.api.analysis.assessment);
  app.all('/api/v1/answer/:id/:page', keystone.middleware.api, routes.api.analysis.answer);
  app.all('/api/v1/page/:id', keystone.middleware.api, routes.api.analysis.page);

  // UI Router States
  app.get('/dashboard', middleware.requireUser, routes.views.dashboard);
  app.get('/partials/user', routes.views.states.user);
  app.get('/partials/search', routes.views.states.search);
  app.get('/partials/assessment', routes.views.states.assessment);
  app.get('/partials/page', routes.views.states.page);
  
  // app.get('/partials/assessment', routes.views.states.assessment)
  // app.get('/partials/page', routes.views.states.page)

  // Partner Panel
  // =============
  app.get('/partner', routes.views.partner);
  // app.get('/partner-panel/:id', routes.views['partner-panel']);
  // States
  app.get('/partner/partials/client', routes.views.partnerPanel.states.client);
  app.get('/partner/partials/client/create', routes.views.partnerPanel.states.createClient);
  app.get('/partner/partials/client/keys/manage', routes.views.partnerPanel.states.manageClientKeys);
  app.get('/partner/partials/search', routes.views.partnerPanel.states.search);
  app.get('/partner/partials/staff', routes.views.partnerPanel.states.staff);
  app.get('/partner/partials/staff/edit', routes.views.partnerPanel.states.staffEdit);
  app.get('/partner/partials/staff/create', routes.views.partnerPanel.states.staffCreate);
  app.get('/partner/partials/keys', routes.views.partnerPanel.states.keys);
  // API
  app.all('/api/v1/partner/clients', keystone.middleware.api, routes.api.users.createClient);
  app.all('/api/v1/partner/clients/:id', keystone.middleware.api, routes.api.users.partnerClients);
  app.all('/api/v1/partner/clients/:id/update', keystone.middleware.api, routes.api.users.updateClient);
  app.all('/api/v1/partner/clients/:id/delete', keystone.middleware.api, routes.api.users.removeClient);
  app.all('/api/v1/partner/staff', keystone.middleware.api, routes.api.users.createStaff);
  app.all('/api/v1/partner/staff/:id', keystone.middleware.api, routes.api.users.partnerStaff);
  app.all('/api/v1/partner/staff/:id/update', keystone.middleware.api, routes.api.users.updateStaff);
  app.all('/api/v1/partner/staff/:id/delete', keystone.middleware.api, routes.api.users.removeStaff);
  app.all('/api/v1/partner/keys/:id/list', keystone.middleware.api, routes.api.keys.listKeysDist)
  
  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);
  
}
