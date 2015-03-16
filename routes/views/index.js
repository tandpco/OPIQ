var keystone = require('keystone'),
  _ = require('underscore'),
  stripecust = require('../lib/stripecust.js');

exports = module.exports = function(req, res) {
  
  var locals = res.locals,
      view = new keystone.View(req, res),
      Page = keystone.list('Page'),
      Answer = keystone.list('Answer'),
      Analysis = keystone.list('Analysis'),
      ip = req.headers['x-forwarded-for'];
      locals.categories = {};
      locals.categories.cats = [];
      locals.analysis = {};
      locals.cat_totals = {};
      locals.main_total = 0;
      locals.stripeApiKey = keystone.get('stripeApiKeyClient');

      console.log('Request From:' + req.originalUrl);

  var anID = req.params.id;

  // IF REQ.METHOD == POST
  // * Create New Analysis
  // ELSE
  // * Look for Analysis by ID
  // ENDIF

  if (req.method == 'POST') {
    // C R E A T I O N P R O C E S S
    // =============================
    // IF User has 0 Analysis OR Has Free Access
    // * Create the Analysis
    // ELSE
    // - IF User Hasn't Paid or Their Year of Access is Up
    // - * Render the Checkout View
    // - ELSE (User has paid)
    // - * Create the Analysis
    // - ENDIF
    // ENDIF
    // =============================
    Analysis.model.find({user: req.user._id}).exec(function(e, an) {
      // IF User has 0 Analysis OR Has Free Access
      if (an.length <= 0 || req.user.freeAccess) {
        // * Create the Analysis
        var newAn = new Analysis.model({
          title : req.body.analysis,
          user : req.user._id
        });
        newAn.save(function(){
          Analysis.model.findOne({_id: newAn._id}).exec(function(e, an){
            locals.analysis = an;
            req.session.analysis = an.title;
            req.session.analysisid = an._id
            start(an);
            res.redirect('/questions/' + an._id);
          });
        });
        // * End Creation
      // ELSE
      } else {
        // - IF User Hasn't Paid or Their Year of Access is Up
        if (!req.user.oneYearPaidAccess || (Date.now() - req.user.oneYearPaidAccess >=  31536000730)) {
          // - * Render the Checkout View
          stripecust.renderCheckout(req, res);
        // - ELSE (User has paid)
        } else {
          // - * Create the Analysis
          var newAn = new Analysis.model({
            title : req.body.analysis,
            user : req.user._id
          });
          newAn.save(function(){
            Analysis.model.findOne({_id: newAn._id}).exec(function(e, an){
              locals.analysis = an;
              req.session.analysis = an.title;
              req.session.analysisid = an._id
              start(an);
              res.redirect('/questions/' + an._id);
            });
          });
          // - * End Creation
        }
        // ENDIF
      }
      // ENDIF
    });
  } else {

    Analysis.model.findOne({_id: anID}).exec(function(err, an){

      if (err || !an) {
        res.redirect('/');
        req.flash('error', 'We were unable to find the opportunity assessment you were looking for.');
      } else if (!req.user) {
        res.redirect('/');
        req.flash('error', 'You do not have the required permissions to view this assessment. Please try logging in or creating an account.');
      } else if (req.user.isAdmin || an.user === req.user._id) {
        locals.analysis = an;
        req.session.analysis = an.title;
        req.session.analysisid = an._id
        start(an);
      } else if (an.user != req.user._id) {
        res.redirect('/');
        req.flash('error', 'You do not have the required permissions to view this assessment.');
      }
    });

  }

function start(an) {
  Answer.model.find({analysis : an._id}).exec(function (err, answers) {
    if(err) console.log(err);
    getPages(answers);
  });
}

function getPages(answers) {
  
  Page.model.find()
    .sort('order')
    .exec(function(err, pages) {

      var cat_totals = {},
        total_pages_answered = 0,
        main_total = 0;

      for (var i = 0; i < pages.length; i++) {

        var answer;
        if (answers)
          answer = _.findWhere(answers, {
            page: pages[i].name
          });

        locals.categories.cats = _.uniq(_.pluck(pages, 'category'));


        pages[i].answer = answer ? answer.answer : 0;


        if (typeof locals.categories[pages[i].category] === 'undefined')
          locals.categories[pages[i].category] = [];


        if (typeof cat_totals[pages[i].category] === 'undefined') {
          // console.log(pages[i].category)
          cat_totals[pages[i].category] = {};
          cat_totals[pages[i].category].total = 0;
          cat_totals[pages[i].category].total_pages = 0;
        }

        if (answer) {
          total_pages_answered += 1;
          cat_totals[pages[i].category].total += Number(answer.answer);
          // console.log(pages[i].category, answer.answer)
          cat_totals[pages[i].category].total_pages += 1;
          main_total += Number(answer.answer);
        }
        locals.categories[pages[i].category].push(pages[i]);

      }

      locals.main_total = (main_total / total_pages_answered) * 20;

      for (var i in cat_totals) {
        // console.log(cat_totals[i])
        locals.cat_totals[i] = (cat_totals[i].total / cat_totals[i].total_pages) * 20;
      }

      if (answers)
        locals.answers = answers;

      // Set locals
      locals.pages = pages;

      // Render the view
      view.render('index');

    });

  }

}