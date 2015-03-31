var _        = require('underscore'),
		keystone = require('keystone'),
		Types    = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('User', {
	track: true
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, required: false },
	image : { type: Types.LocalFile, dest: 'images'},
	stripeid : { type: String, hidden: true},
	zip : {type: String},
	oneYearPaidAccess : {type: Date},
	resetPasswordKey : {type: String},
	trialID: {type: String, hidden: true},
	tempPass: {type: String, hidden: true},
	// _id: {type: String},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
	freeAccess: { type : Boolean, label : 'Free Analysis' }
}, 'User Level', {
	userLevel: { type: Types.Select, options: 'Distributor Level, Client Level, User Level, Staff Level', initial: true },
	discount: {type: String, note: 'This is the percentage discount the license partner recieves when purchasing license keys. Do not include the % sign.', dependsOn: {userLevel: 'Distributor Level'}, initial: true },
	licensePartner: {type: Types.Relationship, ref: 'User', filters: { userLevel: 'Distributor Level' }, dependsOn: {userLevel: ['Client Level', 'Staff Level']}, initial: true },
	client: {type: Types.Relationship, ref: 'User', filters: { userLevel: 'Client Level' }, dependsOn: {userLevel: 'User Level' }, initial: true },
	role: {type: String, dependsOn: {userLevel: 'Staff Level' }, initial: true },
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

User.schema.pre('save', function(next) {

	this.wasNew = this.isNew;
	// this.password = 'testing';

	console.log('Password: ', this.password);

	next();

});

User.schema.post('save', function(next) {

	console.log('The post save function is running.');

	var user = this;

	if (user.wasNew && user.userLevel) {
		console.log('The conditionals are passing.');

		if (user.userLevel === 'Client Level') {
			var link     = 'client-center',
					template = 'welcomeClient';
		} else if (user.userLevel === 'Distributor Level') {
			var link     = 'partner',
					template = 'welcomeUser';
		}

		new keystone.Email(template).send({
			user: user,
			link: '/' + link + '/login?auth=' + user._id,
			subject: 'Welcome to Opportunity IQ!',
			to: user.email,
			from: {
				name: 'Opportunity IQ',
				email: 'welcome@opportunityiq.com'
			}
		});

	}

	// next();

})

/**
 * Registration
 */

User.defaultColumns = 'name, email';
User.register();
