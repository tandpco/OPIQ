var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Analysis = new keystone.List('Analysis', {
	// hidden : true
});

Analysis.add({
	user : { type: String },
	title : {type : String},
	paid : {type : Boolean}
});

Analysis.register();
