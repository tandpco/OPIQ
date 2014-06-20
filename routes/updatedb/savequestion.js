var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var Answer = keystone.list('Answer'),
		post = req.body;
	console.log('this is post in savequestion' , post);
	Answer.model.findOne({page : post.page, user : req.user._id, analysis : post.analysis}).exec(function (err, answer) {
		if(err)console.log(err);

		if(answer){
			answer.answer = post.answer;
			answer.notes = post.notes;
			answer.test = post.test;
			answer.save();
			return;
		}
		var newAnswer = new Answer.model({
			answer : post.answer,
			page : post.page,
			category : post.category,
			user : req.user._id,
			analysis : post.analysis,
			analysistitle : post.analysistitle,
			whatthismeans : post.whatthismeans,
			notes : post.notes,
			test : post.test,
			// work : answer.work
		});
		 
		 
		newAnswer.save(function(err) {
		    if(err)console.log(err);
		    else res.send('complete');
		});
		
	})
	
	
}
