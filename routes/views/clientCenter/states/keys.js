var keystone = require('keystone'),
		license  = keystone.list('License Keys'),
		Invoice  = keystone.list('Invoices');
	// Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	if (req.method == 'POST') {
		var amount = req.body.amount,
				user   = req.user,
				price  = 99;

		// Calculate Amount Due
		// ====================
		// (99 * 100) * {{'0.' + currentUser.discount}} = discount
	  // total = (99 * 100) - discount
		if (user.discount >= 1) {
			var discount = (price * amount) * ('0.' + user.discount),
					total    = (price * amount) - discount;

			console.log('Discount: ', discount);
			console.log('Total: ', total);
		} else {
			var total = (price * amount)
		}

		for (i = 1; i <= amount; i++) {
			console.log('Generating License Key ', i + ' of ' + amount);
			var newLicense = new license.model({
				licensePartner: user._id,
				status: 'Inactive'
			});
			newLicense.save(function(err) {
				if (err) return err;
			});
		}

		// Generate Invoice
		// ================
		// Set date to Advance
		// One month for Invoice
		// Due date
		var currentDate = new Date(),
				currentDate = currentDate.setMonth( currentDate.getMonth() + 1 );

		var invoice = new Invoice.model({
			licensePartner: user._id,
			status: 'Pending',
			dueDate: currentDate,
			numberOfKeys: amount,
			amountDue: total
		});

		invoice.save(function(err) {
			if (err) return err;
		});

		res.status('200').end();

	} else {

		view.render('clientCenter/licenseKeys');

	}
	
}
