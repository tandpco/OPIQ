var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Analysis = new keystone.List('Analysis', {
	// hidden : true
	track : true
});

Analysis.add({
	user: {type: String},
	title: {type: String},
	paid: {type: Boolean},
	trial: {type: Boolean, hidden: true}
});

Analysis.register();