var async = require('async'),
	keystone = require('keystone');
 
var Post = keystone.list('Analysis'),
	Answers = keystone.list('Answer'),
	Pages = keystone.list('Page');
 
/**
 * List Posts
 */
exports.list = function(req, res) {
	Post.model.find({'user': req.params.id}, function(err, analysis) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			data: analysis
		});
	});
}

exports.assessment = function(req, res) {
	Post.model.find({'_id': req.params.id}, function(err, analysis) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			data: analysis
		});

	});
}

exports.answers = function(req, res) {
	Answers.model.find({'analysis': req.params.id, 'user': req.params.user}, function(err, answer) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			data: answer
		});

	});
}

exports.pages = function(req, res) {
	Pages.model.find(function(err, pages) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			data: pages
		});

	});
}

// Need Answer + Page Endpoints
exports.answer = function(req, res) {
	Answers.model.find({'analysis': req.params.id, 'page': req.params.page}, function(err, answer) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			data: answer
		});

	});
}

exports.page = function(req, res) {
	Pages.model.find({'name': req.params.id}, function(err, page) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			data: page
		});

	});
}

// exports.answers = function(req, res) {
// 	Answers.model.find({'user': req.params.id})
// }

// exports.get = function(req, res) {
// 	Post.model.findById(req.params.id).exec(function(err, user) {
		
// 		if (err) return res.apiError('database error', err);
// 		if (!user) return res.apiError('not found');
		
// 		res.apiResponse({
// 			data: user
// 		});
		
// 	});
// }
