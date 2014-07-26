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
	stripeid : { type : String, hidden : true},
	zip : {type : String}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
	freeAccess : {type : Boolean, label : 'Free Analysis'}
});


var TestSchema = new keystone.mongoose.Schema({
   zip : String,
   last4 : String,
   stripeCardID : String
});

User.schema.add({
    cards: [TestSchema]
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
