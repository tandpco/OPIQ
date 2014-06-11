var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var name = req.url.substring(1);

	if(name === 'product-services')
		name = 'product / services';

	if(req.user)
		keystone.list('Answer').model.find()
		.where('user').equals(req.user._id)
		.exec(function (err, answers) {
			keystone.list('Page').model.find()
			.where('category', name)
			.exec(function(err, pages) {

				res.send({pages : pages, answers : answers});
			})
		});
	else keystone.list('Page').model.find()
		.where('category', name)
		.exec(function (err, pages) {
			res.send({pages : pages})
		})
	
}