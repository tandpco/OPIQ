// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv')().load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	
	'name': 'OpportunityIQ',
	'brand': 'OpportunityIQ',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	
	'views': 'templates/views',
	'view engine': 'jade',
	
	'emails': 'templates/emails',

	'updates' : 'updates',
	'auto update': true,
	
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': '|8m`TMRzRnxJQPr3q:vv+*~T`Ns;m|ygG5_a&!do)V[d:=s!3iRhxVCSIci}aq0>'
	
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	moment : require('moment'),
	utils: keystone.utils,
	editable: keystone.content.editable
});
require('dotenv')().load();

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);


// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'Users': 'User',
	'Assessments': ['Analysis', 'Answer'],
	'Dashboard': ['Invoices', 'License Keys'],
	'Pages': 'Page',
	// 'User Levels': ['License Partner', 'License Partner Clients']
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
