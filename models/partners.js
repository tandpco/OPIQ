var _        = require('underscore'),
		keystone = require('keystone'),
		Types    = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('License Partner', {
	track: true
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password },
	stripeid : { type: String, hidden: true},
	zip : {type: String},
	resetPasswordKey: {type: String, hidden: true},
	trialID: {type: String, hidden: true},
	discount: {type: Number, note: 'This is the percentage discount the license partner recieves when purchasing license keys. Do not include the % sign.'}
	// _id: {type: String},
}, 'Permissions', {
	freeAccess: { type : Boolean, label : 'Free Analysis' }
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

User.defaultColumns = 'name, email';

User.register(function() {
	console.log("Why is there no callback here?")
});