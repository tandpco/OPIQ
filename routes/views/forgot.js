// var keystone = require('keystone');
// var forgot = require('password-reset-nodemailer')({
//     uri : 'http://localhost:8080/password_reset',
//     from : 'password-robot@localhost',
//     host : 'localhost', port : 25,
// });


// exports = module.exports = function(req, res) {
// 	var view = new keystone.View(req, res);
//     var email = req.body.email;
//     var reset = forgot(email, function (err) {
//         if (err) res.flash('error','Error sending message: ' + err)
//         else res.flash('error', 'Check your inbox for a password reset message.')
//     });

//     reset.on('request', function (req_, res_) {
//         req_.session.reset = { email : email, id : reset.id };
//         res_.locals = res_;
//         view.render('reset');
//     });
// }