var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Answer = new keystone.List('Answer', {
	// hidden : true
	nocreate: true,
	noedit: true
});

Answer.add({
	answer : { type : String},
	page : { type : String},
	category : { type : String},
	user : { type: Types.Relationship, ref: 'User' },
	analysis : { type : String },
	analysistitle : {type : String},
	whatthismeans :{type : String},
	notes : {type : String},
	work : {type : String}
});

Answer.register();
