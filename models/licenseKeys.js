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
	user: {type: Types.Relationship, ref: 'User', filters: {userLevel: 'User Level'}},
	status: {type: Types.Select, options: 'Active, Pending, Inactive, Distributed'}
});

Key.register();