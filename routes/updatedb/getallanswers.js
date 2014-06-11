var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var Answer = keystone.list('Answer');
	
	if(req.user)
		Answer.model.find().where("user").ne(req.user._id).exec(function  (err, data) {
			res.send(data);
		})
	else res.send('no user');
}