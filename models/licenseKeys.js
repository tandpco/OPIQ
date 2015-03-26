var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Key = new keystone.List('License Keys', {
	// hidden : true
	track : true
});

Key.add({
	licensePartner: {type: Types.Relationship, ref: 'License Partner'},
	client: {type: Types.Relationship, ref: 'License Partner Clients'},
	user: {type: String, note: 'Will be the user the key is assigned to by the client.'}
});

Key.register();