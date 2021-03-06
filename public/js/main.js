$(document).ready(function(e) {
  updateAllScores();

  $('.qaform').submit(function(req) {
    var form = $(this);
    var updatePage = function(data) {
      $(form).fadeOut(function() {
        $(form).html('We have received your inquiry and will get back to you as soon as possible.').fadeIn();
      });
    };
    var printError = function(error) {
      $(form).html('We were unable to send your message.');
      $('button[value="SUBMIT"]').prop('disabled', false);
    };
    var ajaxOptions = {
      url: '/help',
      type: 'POST',
      data: $(form).serialize(),
      success: updatePage,
      error: printError
    };
    $.ajax(ajaxOptions);
    $('button[value="SUBMIT"]').prop('disabled', true);
    return false;
  });

});

$('.welcome-video').on('click', function(e) {
  if (e.target.id == 'overlay')
    $('.welcome-video').fadeOut()
});

$('#viewReport').on('click', function() {
  $('#main-inner').hide();
  $('#report').show();
})

var $percentComplete = $('input#percentComplete');
var mark = $('#nav-items i.fa-stack');
$(mark).click(function() {
  var tooltip = $(this).find('#lightbox');
  var lightbox = document.getElementById('lightbox');
  var $this = $(this).parent().parent();
  $('.overlay').fadeIn();
  $(this).find('#lightbox').fadeIn(function() {
    $('body').addClass('open');
  });
  $this.siblings().find('#lightbox').fadeOut(function() {
    $('body').removeClass('open');
  });
  return false;
});
$('.overlay').click(function() {
  $('body').removeClass('open');
  $(this).fadeOut();
  $('section').fadeOut();
});
$('.close').click(function() {
  $('body').removeClass('open');
  $('.overlay').fadeOut();
  $('section#lightbox').fadeOut();
  return false;
});
// HELPER FUNCS
if(Answers)
$.each(Answers, function  (i, v) {
  $.each(Pages, function (l, p) {
    if(p.name === v.page)
      Pages[l].answer = v.answer;
  })
});
$.fn.set = function(num, overall){

  $(this).find('.bar-complete').animate({width : (num || 0) + '%' }, 2000).end().find('.num span')
    .text((num || 0) + '%');

}
$.fn.getTotalAnswers = function (num) {
  var obj = $(this).find('.bar').attr('base'), arr = [];
  
  obj = $.parseJSON(obj);
  
  obj[ current.name ] = num;

  for(key in obj){
      arr.push(obj[key]);
  }
  $(this).find('.bar').attr('base', JSON.stringify(obj));
  
  return arr.join(',');
}

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
function add(arg){
  var total = 0;
  for(var i = 0 ; i < arg.length;i++)
    total += Number(arg[i]);
  return total;
}


// GLOBALS
var current, BASE, notLogged = 0, current_page, TOTAL_SCORE,
  VENTURE = $('span[analysis]').attr('analysis');

$('.answer').on('click', pickAnswer);
$('.save').on('click', save);
$('#outline > li > a').on('click', mainMenu);
$('.nav div ul li, #report table tr.page-wrap').on('click', subMenu);
$('.section:not(#definition):not(#keyprinciple) .body .t, .readall').on('click', readall);
$('.nextprev span:not(:first-child)').on('click', next_submenu);
$('.nextprev span:first-child').on('click', prev_submenu);
$('.readallrightwrong').on('click', readallrightwrong);
$('#get-pdf').on('click', requestPDF);
$('.outline').on('click', function () {
  $(this).next().removeClass('selected').end().addClass('selected');
  $('#score').hide();
  $('#outline').show();
});
$('.score').on('click', function () {
  $(this).prev().removeClass('selected').end().addClass('selected');
  $('#score').show();
  $('#outline').hide();
})
$('.show-report').on('click', function () {
  $('#main-inner').hide();
  $('#report').show();
})
$('#tos').on('click', function () {
  $('#main-inner').hide();
  $('#tos').show();
})

var ID;

if(location.hash){
  if(location.hash === '#report')
    $('.show-report').click();
  else if(location.hash === '#tos'){
    $('#main-inner').hide();
    $('#tos').show();
  } else {
    var li = $('#outline > li > div > ul > li#' + location.hash.substring(2))
    li.parents('li.main-nav').children('a').click();
    li.click();
    ID = li;
  }
}else{
  $('#industry-market').addClass('active');
  $('#industry-market div ul li:first-child').addClass('active'); 
  ID = $('#industry-market div ul li:first-child').attr('id');
} 


// INIT 
updateAllScores();
getPage(ID);
current_page = ID;
BASE = $('#page-' + ID + ', #score, #report');
console.log(BASE);
makeSureSectionsAreGreenChecked();


function pickAnswer () {
  var others = BASE.find('.answer').find('i');
  others.hide();
  $(this).find('i').show();
}
function next_submenu () {
  var current = $('#' + current_page);



  if(current.next('li').length)
    current.next('li').click();
  else {
    current = current.parents('.main-nav').next('.main-nav');
    current.children('a').click();
    current.find('li:first-child').click();
  }
}
function prev_submenu () {
  var current = $('#' + current_page);



  if(current.prev('li').length)
    current.prev('li').click();
  else {
    current = current.parents('.main-nav').prev('.main-nav');
    current.children('a').click();
    current.find('li:last-child').click();
  }
}

function mainMenu () {
  
  if(!$(this).parent().hasClass('active'))
    $('#nav-items > ul > li').removeClass('active').children('div').slideUp();
    
  $(this).parent().toggleClass('active').children('div').slideToggle();
}


function subMenu () {
  var page = $(this).attr('id');
  $('#report').hide();
  $('#tos').hide();
  $('#main-inner').show();
  
  current_page = page;


  $('#outline > li > div > ul > li').removeClass('active');
  $('#' + page).addClass('active');
  if(!check_logged())return;

  getPage(page);

  BASE = $('#page-' + page + ', #score, #report');
  if(notLogged >= 4){
    show_login_splash();
    return;
  }
  
  $('.whole-page:visible').fadeOut(500);
  setTimeout(function(){
    $('#page-' + page).fadeIn(500);       
  }, 500)
  
    

  location.hash = '/' + page;


  
  

}
function save () {
  var answer = BASE.find('.answer i:visible').attr('answer');
  if(!answer){
    alert('Please Choose An Answer.');
    return;
  }
  setanswer(answer);
}

function setanswer (answer) {

  console.log('Analysis ID: ', Analysis._id);
  console.log('Analysis Title: ', Analysis.title)

  var obj = {
    answer : answer,
    page : current.name,
    category : current.category,
    analysis : Analysis._id || '',
    analysistitle : Analysis.title,
    whatthismeans : current[ 'Answer ' + answer + ' text'] || current['Answer ' + answer + ' text'],
    notes : BASE.find('textarea[name=notes]').val(),
    work : BASE.find('textarea[name=work]').val()
  }

  current.answer = answer;

  if(User)
    obj.user = User._id;

  $('#' + current._id).addClass('page-complete');

  if (User) {
    $.post('/savequestion', obj);
    show_check(answer);
  } else {
    notLogged++;
    if(notLogged >= 4){
      show_login_splash();
    }else{
      console.log(obj);
      $.post('bklog', obj);
      show_check(answer, obj.whatthismeans);
    }
  }
  
}

function show_check(answer, wtm){
  var spl = $('.splash.answered'),
    check = spl.find('.check-mark');

  check.css({
    left : $(window).width() / 2 - check.width() / 2,
    top : $(document).scrollTop() + ($(window).height() / 2 - check.height() / 2)
  })

  spl.fadeIn().height($(document).height()).on('click', function () {
    $(spl).fadeOut();
  });
  spl.is(':visible', function() {
    $(document).click(function() {
      $(spl).fadeOut();
    });
  });
  setTimeout(function () {
    spl.fadeOut();
    updatePercent(answer);
    whatthismeans(wtm);
    complete_section();
  }, 1000);
}

function getPage (page) {
  $.each(Pages, function (i, v) {
    if(v._id === page){
      current = v;  
    }
  })
}

function complete_section () {
  var section = $('.main-nav').filter(function(){ return $(this).hasClass('active');}),
    notComplete;

  $.each(section.find('li'), function () {
    if(!$(this).hasClass('page-complete'))
      notComplete = true;
  })

  if(!notComplete)section.addClass('complete');
}
function check_logged () {
  var open = false;
  if(!User)
    $.each(Pages, function(i, v){
      if(i < 4)
        if(v._id === current_page)
          open = true;
    });
  else return true;

  if(open) return true;

}


/**
 * UPDATE SCORES
 */
function updatePercent (num) {
  var total = Pages.length;
  var answers = getAnswers();
  var o = answers.main_total;
  // var o = BASE.find('.sidebar-how-you-answered .overall').getTotalAnswers(num);
  var c = answers.cat_answers[current.category];
  // var c = BASE.find('.sidebar-how-you-answered .category-score').getTotalAnswers(num);

  console.log(o);
  $('.overall').find('.bar').attr('percent', o || 0);
  $('.category-wrap:contains(' + current.category + '), .category-score:contains(' + current.category + ')').find('.bar').attr('percent', c || 0);
  $('.page-wrap:contains(' + current.name + '), .page-score:contains(' + current.name + ')').find('.bar').attr('percent', num || 0);



  updateAllScores(num);
}

function updateAllScores(){
  var $percentComplete = $('input#percentComplete');
  $('#report .page-wrap, .page-score').each(function(){
    var num = Number($(this).find('.bar').attr('percent'));

    $(this).set(num * 20);
  });

  $('.category-wrap, .category-score, .overall-wrap, .overall').each(function(){
    // var total = $(this).find('.bar').attr('percent').split(',');
    // var num = Number(add(total));
    // var number = Math.round(num / (total.length * 5) * 10000) /100;
    var number = Math.round(Number($(this).find('.bar').attr('percent') * 1));
    
    if($(this).hasClass('overall'))
      TOTAL_SCORE = number;
    $(this).set(number);
  });

  $('#report .stripe .box-score').text(TOTAL_SCORE + '%');

  $('.overall-wrap').set(TOTAL_SCORE)


  $('.percent-complete').set(Math.round($('#outline div li.page-complete').length / Pages.length * 1000) / 10);
  percentComplete();
  var $percentCompleteVal = $percentComplete.val() > 0 ? $percentComplete.val() : 0;
  if ($percentComplete.val() != '100') {
    $('#report > .header > h1').html('Your analysis is ' + $percentCompleteVal + '% complete.');
    if (typeof $percentCompleteVal === 'object') {
      var $percentComplete = 100;
    }
  } else if ($percentComplete.val() == '100') {
    $('#report > .header > h1').html('Congratulations! Your analysis is complete.');
  }
}


function percentComplete() {
  var $val = $percentComplete.val(Math.round($('#outline div li.page-complete').length / Pages.length * 1000) / 10);
  $('#report > .header > h1').html('Your analysis is ' + $val + '% complete.');
}

$('span[data-action=next]').click(function() {
  updateAllScores();
})

function getAnswers () {
  var main_total = 0, total = 0, cat_answers = {}, cat_totals = {};
  $.each(Pages, function (i, v) {
    if(v.answer){
      if(!cat_answers[v.category]){
        cat_answers[v.category] = {};
        cat_answers[v.category].answer = 0;
        cat_answers[v.category].total = 0;
      }

      cat_answers[v.category].answer += Number(v.answer);
      cat_answers[v.category].total += 1;
      main_total += Number(v.answer);
      total += 1;

      console.log(cat_answers);
    }
    
  })

  for(var i in cat_answers){
    cat_totals[i] = (cat_answers[i].answer / cat_answers[i].total) * 20;

  }

  console.log(cat_totals)

  return {main_total : (main_total / total) * 20 , cat_answers : cat_totals}

}

/**
 * READALL
 */
function readall () {
  var section = $(this).parents('.section'),
    id = section.attr('id'),
    self = $(this);

  if(!$(this).data('limited')){
    section.find('.t').height('100%');
    section.find('.gradient-overlay').hide();
    
    $(this).data('limited', true);  
  }else {
    $(this).data('limited', false);
    section.find('.t').height(42);
    section.find('.gradient-overlay').show();
  }
  

}
function readallrightwrong (e) {
  var type = $(this).attr('type'),
    text = $(this).find('.t'),
    inner = $('.splash.rightwrong-box .inner'),
    splash = splashed('rightwrong-box', inner);
    
  if(current[type + ' image'])
    inner.find('img').attr('src', current[type + ' image'].secure_url)
      .css('max-width', '250px')
      .end().find('.body').html(text.html());
  e.stopPropagation();
  return false;
}
function splashed (cl, inner) {
  splash = $('.splash.' + cl);
  
  splash.height($(document).height()).show();
  inner.show().css({
    left : $(window).width() / 2 - inner.width() / 2
    , top : $(document).scrollTop() + $(window).height() / 2 - inner.height() / 2
  })
  splash.on('click', function () {
    $(this).hide();
  });
}
function show_login_splash () {
  var inner = $('.splash.not-logged .inner'),
    splash = splashed('not-logged', inner);

      

  splash.on('click', function () {
    splash.add(inner).hide();
  })
}
function requestPDF () {
  // var form = $(this).parents('form'), CATEGORIES = [];
  // var t = $('.category-wrap').length - 1;

  // $('.category-wrap').each(function (i, v) {
  //  var name = $(this).find('.category .t').text().toLowerCase();
  //  var num = Number($(this).find('.num span').text().slice(0,-1));
  //  var obj = {};

  //  obj[name] = num;

  //  CATEGORIES.push(obj);

  // })
  
  
  // form.append(input('total', TOTAL_SCORE))
  //  .append(input('venture', VENTURE))
  //  .append(input('categories', JSON.stringify(CATEGORIES)));
  // form.submit();


  // function input (name, val) {
  //  return $("<input>")
 //               .attr("type", "hidden")
  //                .attr("name", name).val(val)
  // }
}

function whatthismeans (text) {
  $('.what-this-means').find('.body').text(text).end().show();
}
function makeSureSectionsAreGreenChecked () {
  var m = $('.main-nav');
  var p = m.find('li:not(.page-complete)');

  if(!p.length)m.addClass('complete');
}