var keystone = require('keystone'),
		licenses = keystone.list('License Keys'),
		User     = keystone.list('User');
	// Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;


	if (req.method == 'POST') {

		var data = req.body,
				user = req.user;

		licenses.model.find({licensePartner: data.licensePartner, status: 'Inactive'}).sort('date').limit(data.amount).exec(function(err, keys) {
			for (i = 0; i < keys.length; i++) {
				keys[i].set({
					client: data.client,
					status: 'Pending'
				});
				keys[i].save();
			}
		});

		new keystone.Email('newKeys').send({
			user: user,
			amount: data.amount,
			link: '/client-center',
			subject: data.amount + ' New Licenses Keys Available on Opportunity IQ',
			to: user.email,
			from: {
				name: 'Opportunity IQ',
				email: 'support@opportunityiq.com'
			}
		}, res.status('200').end());

	} else {

		view.render('partnerPanel/manageClientKeys');

	}
	
}


// user.model.findOne().exec(function(err, theUser) {
// 	// Update theUser Record
// })

// for (i = 0; i < cars.length; i++) { 
//     text += cars[i] + "<br>";
// }