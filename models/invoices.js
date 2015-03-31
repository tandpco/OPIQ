var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Invoice = new keystone.List('Invoices', {
	track : true
});

Invoice.add({
	licensePartner: {type: Types.Relationship, ref: 'User', filters: {userLevel: 'Distributor Level'}},
	status: {type: Types.Select, options: 'Paid, Pending, Cancelled'},
	dueDate: {type: Types.Date},
	numberOfKeys: {type: Number},
	amountDue: {type: Types.Money}
});

Invoice.schema.pre('save', function(next) {

	console.log('A check to ensure that this function is running.');

	var invoice = this,
			User    = keystone.list('User');

	// Force Two Digit Amount
	var amount  = invoice.amountDue.toFixed(2);

	User.model.findOne().where('_id', invoice.licensePartner).exec(function(err, user) {

		new keystone.Email('invoice').send({
			user: user,
			invoice: invoice,
			total: amount,
			link: '/partner',
			subject: 'Opportunity IQ Invoice - ' + invoice._.createdAt.format('MMMM Do, YYYY'),
			to: user.email,
			from: {
				name: 'Opportunity IQ',
				email: 'support@opportunityiq.com'
			}
		});

	})

	next();

});

Invoice.defaultColumns = 'licensePartner, status, amountDue'

Invoice.register();