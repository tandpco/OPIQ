var phantom = require('phantom');

exports = module.exports = function(req, res) {
  var body = req.body;
  var analysis = req.session.analysis;
  var text = body.html;

  text += '<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">';
  text += '<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">';
  text += '<style>';
  text += '@media print{.report__header,.loading-overlay{display:none !important}.report__container{background:none !important;}.report__container:after{display:none !important}.report__content{width:100% !important;margin:0 !important;max-width:none !important;font-family:sans-serif !important;}.report__content .content__page{font-family:sans-serif !important;height:100% !important;margin-bottom:0 !important;padding-bottom:0 !important;}.report__content .content__page .page__content .content__section span{background-color:#e8e8e8 !important;float:left;}.report__content .content__page .page__content .content__section span:first-of-type{display:none !important}.report__content .content__page .page__content .content__section span:last-of-type{font-weight:bold;letter-spacing:.075em;padding-left:1%;text-transform:uppercase;width:100% !important}.report__content .content__page .page__content .content__section .section__header span{padding:0 15px !important}.report__content .content__page .page__content .content__section .section__body{padding:0 15px !important}.report__content .content__page.overview .page__header{line-height:60px !important;color:#fff !important;zoom:1;}.report__content .content__page.overview .page__header:before,.report__content .content__page.overview .page__header:after{content:"";display:table}.report__content .content__page.overview .page__header:after{clear:both}.report__content .content__page.overview .page__header .overall-score{background:none !important;color:#fff !important;position:relative !important;right:initial !important;top:initial !important;float:right !important;text-align:right !important;height:auto !important;width:auto !important}.chart.inverse{background-color:transparent !important}.chart table td,.chart table th{font-size:12px !important;vertical-align:middle !important;}.chart table td span.circle,.chart table th span.circle{position:relative !important;top:1px !important}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.gray{border:1px solid #383d40 !important;}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.gray span{background-color:#383d40 !important;display:block !important}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.darkGreen{border:1px solid #778632 !important;}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.darkGreen span{background-color:#778632 !important;display:block !important}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.fadedGreen{border:1px solid #a8ba57 !important;}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.fadedGreen span{background-color:#a8ba57 !important;display:block !important}table,tbody,thead,th,td,tr{page-break-after:avoid !important}.cover .cover__title{color:#fff !important;}.cover .cover__title span{color:#fff !important}}@media all{.download-btn{color:#fff;position:fixed;right:15px;bottom:15px;line-height:32px;border:2px solid;padding:0 15px;-webkit-transition:all 300ms ease;-moz-transition:all 300ms ease;-o-transition:all 300ms ease;-ms-transition:all 300ms ease;transition:all 300ms ease;}.download-btn:hover{text-decoration:none;color:#fff;background-color:rgba(255,255,255,0.15)}.print{cursor:pointer}.align-left{text-align:left}.align-right{text-align:right}.align-middle{text-align:center}.loading{display:none}.loaded{display:inline-block}.dl-overlay{background-color:rgba(31,34,35,0.95);bottom:0;left:0;opacity:0;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";filter:alpha(opacity=0);right:0;position:fixed;top:60px;text-align:center;-webkit-transition:all 300ms ease;-moz-transition:all 300ms ease;-o-transition:all 300ms ease;-ms-transition:all 300ms ease;transition:all 300ms ease;visibility:hidden;z-index:3;}.dl-overlay .shut{cursor:pointer}.dl-overlay .text{bottom:0;color:#fff;position:fixed;left:0;right:0;text-align:center;top:45%;}.dl-overlay .text #print{display:inline-block}.dl-overlay .text .btn{-webkit-border-radius:0;border-radius:0;color:#fff;display:inline-block;letter-spacing:.125em;text-transform:uppercase;border:2px solid #fff}.dl-overlay .text small{display:inline-block;letter-spacing:.125em;margin-top:15px;padding-top:15px;position:relative;text-transform:uppercase;}.dl-overlay .text small:before{background-color:#fff;content:"";height:1px;left:50%;margin-left:-15px;position:absolute;top:1px;width:30px}.overlay{opacity:0;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";filter:alpha(opacity=0);visibility:hidden;background-color:#383d40;bottom:0;left:0;position:fixed;right:0;top:60px;-webkit-transition:all 300ms ease;-moz-transition:all 300ms ease;-o-transition:all 300ms ease;-ms-transition:all 300ms ease;transition:all 300ms ease;z-index:3;}.overlay .text{position:fixed;top:45%;left:0;right:0;text-align:center;font-family:"Museo",sans-serif;font-size:24px;font-weight:100;color:#999}.show{overflow:hidden;}.show .loading-overlay .overlay{opacity:1;-ms-filter:none;filter:none;visibility:visible}.show .loading-overlay .loading{display:inline-block}.show .loading-overlay .loaded{display:none}.download{overflow:hidden;}.download .dl-overlay{opacity:1;-ms-filter:none;filter:none;visibility:visible}.download .download-btn{display:none}.report__container{background-color:#222526;z-index:1;}.report__container:after{background-image:url("/images/report-bg.png");background-repeat:repeat;bottom:0;content:"";left:0;opacity:.25;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=25)";filter:alpha(opacity=25);position:fixed;right:0;top:0;z-index:1}.report__header{background-color:#383d40;color:#fff;letter-spacing:.1em;left:0;line-height:60px;position:fixed;right:0;top:0;-webkit-transition:all 300ms ease;-moz-transition:all 300ms ease;-o-transition:all 300ms ease;-ms-transition:all 300ms ease;transition:all 300ms ease;vertical-align:middle;z-index:3;}.report__header .header__logo{color:#fff;text-decoration:none;}.report__header .header__logo span{color:#b3d338}.report__header .header__title{font-size:24px;font-weight:100}.report__header.opaque{background-color:rgba(56,61,64,0.95);line-height:32px;}.report__header.opaque .header__logo img{display:none}.report__header.opaque .header__title{font-size:16px}.report__content{margin:75px auto 40px;max-width:816px;position:relative;width:80%;z-index:2;}.report__content .content__page{background-color:#fff;-webkit-box-shadow:0 0 5px #000;box-shadow:0 0 5px #000;height:1056px;margin-bottom:30px;padding-bottom:50px;padding-top:50px;page-break-after:always;}.report__content .content__page.cover{padding-top:200px;position:relative;}.report__content .content__page.cover .cover__body{margin-top:200px;}.report__content .content__page.cover .cover__body p{color:#5d5d5d;font-size:18px}.report__content .content__page.cover .cover__body .cover__title{background-color:#4c5b28 !important;border-top:6px solid #b3d338;color:#fff !important;font-family:serif;font-size:72px;line-height:144px}.report__content .content__page.cover .cover__footer{background-color:#dde7c9 !important;bottom:0;color:#4c5b28 !important;left:0;position:absolute;right:0;padding-top:30px;padding-bottom:30px;}.report__content .content__page.cover .cover__footer p{margin:0;font-size:16px}.report__content .content__page.overview .page__header{background-color:#a8ba57 !important;color:#fff !important;font-size:18px !important;line-height:48px !important;margin-bottom:25px !important;padding:0 15px !important;zoom:1;}.report__content .content__page.overview .page__header:before,.report__content .content__page.overview .page__header:after{content:"";display:table}.report__content .content__page.overview .page__header:after{clear:both}.report__content .content__page.overview .page__header .overall-score{background-color:#383d40;height:60px;line-height:60px;position:absolute;right:15px;text-align:center;top:-6px;width:70px}.report__content .content__page.answer{padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:30px;}.report__content .content__page.answer .page__header{border-bottom:1px solid #ddd;color:#b3d338;margin-bottom:10px;padding-bottom:10px;text-transform:capitalize}.report__content .content__page.answer .page__content .content__section{color:#666;margin-bottom:30px;}.report__content .content__page.answer .page__content .content__section .section__header{line-height:32px;margin-bottom:15px;zoom:1;}.report__content .content__page.answer .page__content .content__section .section__header:before,.report__content .content__page.answer .page__content .content__section .section__header:after{content:"";display:table}.report__content .content__page.answer .page__content .content__section .section__header:after{clear:both}.report__content .content__page.answer .page__content .content__section .section__header span{background-color:#e8e8e8 !important;float:left;}.report__content .content__page.answer .page__content .content__section .section__header span:first-of-type{margin-right:1%;text-align:center;width:5%}.report__content .content__page.answer .page__content .content__section .section__header span:last-of-type{font-weight:bold;letter-spacing:.075em;padding-left:1%;text-transform:uppercase;width:94%}.report__content .content__page.answer .page__content .content__section .section__body{font-size:13px;padding-left:7%;white-space:pre-line !important;}.report__content .content__page.answer .page__content .content__section .section__body p{margin:0}.report__content .content__page.answer .page__content .content__section.answer{background-color:#e8e8e8 !important;padding:30px;}.report__content .content__page.answer .page__content .content__section.answer .section__header{font-weight:bold;line-height:18px;margin-bottom:5px;text-transform:uppercase}.report__content .content__page.answer .page__content .content__section.answer .section__body{padding:0;white-space:initial !important;}.report__content .content__page.answer .page__content .content__section.answer .section__body .opt:nth-child(n+2){margin-top:10px}.report__content .content__page.answer .page__content .content__section.answer .section__body .opt{line-height:2em;padding-left:30px;position:relative;}.report__content .content__page.answer .page__content .content__section.answer .section__body .opt .fa-stack{left:0;position:absolute}.report__content .content__page.answer .page__content .content__section.answer .section__body .fa-stack{margin-right:5px}.report__content .content__page.answer .page__content .content__section.answer .section__body i.fa.fa-check.fa-stack-1x{color:#b3d338 !important}.report__content .content__page.answer .page__content .content__section.answer .section__body i.fa.fa-square{color:#fff}.report__content .content__page.back-cover{background-color:#4c5b28 !important;}.report__content .content__page.back-cover img{margin-top:300px}.report__content .content__page.back-cover .cover__footer{background-color:#dde7c9 !important;bottom:0;color:#4c5b28 !important;left:0;position:absolute;right:0;padding-top:60px;padding-bottom:60px;}.report__content .content__page.back-cover .cover__footer p{margin:0;font-size:16px}.chart table{background-color:transparent !important;margin-bottom:0;table-layout:fixed !important;}.chart table span.circle{background-color:#383d40 !important;-webkit-border-radius:50% !important;border-radius:50% !important;display:inline-block !important;height:11px !important;margin-right:5px !important;width:11px !important}.chart table .progress-bar{background-color:transparent;-webkit-box-shadow:none;box-shadow:none;height:20px;overflow:hidden;width:100%;}.chart table .progress-bar span{color:#fff !important;display:block;font-size:11px;height:18px;line-height:18px;min-width:30%;text-align:center}.chart table .progress-bar.gray{border:1px solid #383d40 !important;}.chart table .progress-bar.gray > span{background-color:#383d40 !important}.chart table .progress-bar.darkGreen{border:1px solid #778632 !important;}.chart table .progress-bar.darkGreen > span{background-color:#778632 !important}.chart table .progress-bar.fadedGreen{border:1px solid #a8ba57 !important;}.chart table .progress-bar.fadedGreen > span{background-color:#a8ba57 !important}.chart table.answer-score{text-transform:capitalize}.chart.inverse{background-color:#f9f9f9;padding:15px;}.chart.inverse table{background-color:transparent !important;}.chart.inverse table span.circle{background-color:#666 !important}.chart.inverse table tr.sub-row:nth-child(n+3) td.sub-list{position:relative !important;}.chart.inverse table tr.sub-row:nth-child(n+3) td.sub-list:before{background-color:#666 !important;content:"" !important;height:30px !important;left:25px !important;position:absolute !important;top:-15px !important;width:1px !important}.chart.inverse table td{border:0 !important;text-transform:capitalize !important;}.chart.inverse table td.sub-list{padding-left:20px !important}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.gray{border:1px solid #383d40 !important;}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.gray span{background-color:#383d40 !important}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.darkGreen{border:1px solid #778632 !important;}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.darkGreen span{background-color:#778632 !important}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.fadedGreen{border:1px solid #a8ba57 !important;}.report__content .content__page.answer .page__content .content__section.chart .section__header .progress-bar.fadedGreen span{background-color:#a8ba57 !important}}';
  text += '</style>';

  startPhantom(text);

  function startPhantom(text) {

    phantom.create(function(ph) {

      ph.createPage(function(page) {

        page.set('content', text);
        
        setTimeout(function(){
          page.set('paperSize', {format: 'A4', margin: 0}, start)
        }, 1000)

        function start() {
          page.render(analysis  + '.pdf', function() {
            res.download(analysis + ".pdf");
            ph.exit(function(code){console.log(code)});
          });
        }

      });

    }, { port: 12301 });

  }

}