var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('User', {
	track : true
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: false },
	image : { type : Types.LocalFile, dest : 'images'},
	stripeid : { type : String, hidden : true},
	zip : {type : String},
	oneYearPaidAccess : {type : Date},
	resetPasswordKey : {type: String},
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

/* Reset Password */

User.schema.methods.resetPassword = function(callback) {
	
	var user = this;

	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	
	user.save(function(err) {
		
		if (err) return callback(err);
		
		new keystone.Email('forgotten-password').send({
			user: user,
			link: '/reset/' + user.resetPasswordKey,
			subject: 'Reset your password',
			to: user.email,
			from: {
				name: 'Opportunity IQ',
				email: 'support@opportunityiq.com'
			}
		}, callback);
		
	});
	
}


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin, freeAccess';
User.register();
