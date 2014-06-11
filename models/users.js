var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('User', {
	// hidden : true
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: false },
	image : { type : Types.LocalFile, dest : 'images'},

}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
	freeAccess : {type : Boolean, label : 'Free Analysis'}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin, freeAccess';
User.register();
