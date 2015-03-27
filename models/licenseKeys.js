var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Key = new keystone.List('License Keys', {
	track : true
});

Key.add({
	licensePartner: {type: Types.Relationship, ref: 'User', filters: {userLevel: 'Distributor Level'}},
	client: {type: Types.Relationship, ref: 'User', filters: {userLevel: 'Client Level'}},
	user: {type: String, note: 'Will be the user the key is assigned to by the client.'},
	status: {type: Types.Select, options: 'Active, Pending, Inactive'}
});

Key.register();