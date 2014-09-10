var phantom = require('phantom');
	// keystone = require('keystone'),
	// Answer = keystone.list('Answer'),
	// Page = keystone.list('Page'),
	// _ = require('underscore');




exports = module.exports = function(req, res) {
	// var analysis = req.body.analysis,
	// 	total = req.body.total,
	// 	categories = JSON.parse(req.body.categories),
	// 	text = '<body>',
	// 	fakeText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	// 	section_headers = {
	// 		"industry / market" :
	// 			"<div class='title_header'>Industry / Market</div>" +
	// 			"<div class='question'>\"How Does the Industry / Market Context and External Forces Impact the Opportunity?\"</div>" +
	// 			"<div class='section_text'>" +
	// 			"<p>The industry and market context has a dramatic impact on the potential for success of any opportunity. In fact, one research study of startups over a 20-year period by Scott Shane of Case Western Reserve University, found that the industry itself had more influence on a company's outcome than the skills and experience of the entrepreneur or management team.</p>" +
	// 			"<p>Shane categorized startups by industry and analyzed which ones made the Inc. 500 list, a list of fast-growth, highly-successful startups. While this, of course, is not the only measure that can be used, it is a fair proxy for startups that went on to achieve business success. For sake of comparison, while about 1 in 25 of all the startups in the computer and office equipment industry made the Inc. 500, only around 1 in 20,000 in the hotel and motel industries did. Eating and drinking establishments fared little better with only 1 in 14,300 making the list. In short, the probability of success over the study’s time horizon was approximately 800 times higher if an entrepreneur started a computer company instead of a lodging company.</p>" +
	// 			"<p>It shouldn't surprise us that the market has such a critical impact on an opportunity's success – it is a key component in the overall context. The dynamics of an industry are the external market forces that shape the market and the demand for goods and services. The industry you choose is much like the ground or foundation that you select to build your house upon: the characteristics can be relatively fixed with some shifting over time, affecting the to achieve business success. For sake of comparison, while about 1 in 25 of all the startups in the computer and office equipment industry made the Inc. 500, only around 1 in 20,000 in the hotel and motel industries did. Eating and drinking establishments fared little better with only 1 in 14,300 making the list. In short, the probability of success over the study’s time horizon was approximately 800 times higher if an entrepreneur started a computer company instead of a lodging company. It shouldn't surprise us that the market has such a critical impact on an opportunity's success – it is a key component in the overall context. The dynamics of an industry are the external market forces that shape the market and the demand for goods and services. The industry you choose is much like the ground or foundation that you select to build your house upon: the characteristics can be relatively fixed with some shifting over time, affecting the stability of what you build and your ability to expand. In a similar way, an entrepreneur should carefully consider their target market because it is foundational to the potential success of any opportunity.</p>" +
	// 			"<p>This section clarifies the issues that need to be analyzed in order to fully assess the value and viability of an opportunity based upon its industry and market context and the weaknesses to focus on in order to dramatically improve the potential outcome.</p>" +
	// 			"</div>" ,
	// 		"financial" :
	// 			"<div class='title_header'>Financial</div>" +
	// 			"<div class='question'>\"How Do the Financial Characteristics of the Business Model Affect the Opportunity?\"</div>" +
	// 			"<div class='section_text'>" +
	// 			"<p>The financial aspects of various opportunities can vary dramatically depending upon how the business model works, including the investment required, profitability, timing of cash flows and other such criteria. It is critical to carefully and deliberately analyze all financial aspects of a potential business venture to insure that the business model will actually work.</p>" +
	// 			"<p>The lack of adequate planning, the lack of understanding the financial impact of how the business model was put together, and the lack of sufficient capital resources are among the three top reasons an opportunity fails. Unfortunately, while this aspect of analysis is absolutely critical, it is also one of the least-understood and least-embraced parts of any business plan. This section clarifies the issues that need to be analyzed in order to fully assess the value and viability of an opportunity based upon its financial characteristics and the weaknesses to focus on in order to dramatically improve the potential outcome.</p>" +
	// 			"<p>(Note: Most of the questions in this section will require a detailed understanding of the financial model for the opportunity. We highly recommend the Startup Financial Model (www.StartupFinancialModel.com) to help with this critical planning.)</p>" +
	// 			"</div>" ,
	// 		"operational" :
	// 			"<div class='title_header'>Operational</div>" +
	// 			"<div class='question'>\"How Do the Operational Characteristics of the Business Model Affect the Opportunity?\"</div>" +
	// 			"<div class='section_text'>" +
	// 			"<p>The operational aspects of various opportunities can vary dramatically depending upon how the business model works. For example, an opportunity that delivers a customized offering to each customer will be far harder to scale and will have very few learning curve and experience curve advantages compared to an opportunity with a standardized offering. There are several operational characteristics that can make or break a business venture, but if thought through carefully in the planning stage, the operational model can be fine-tuned to dramatically increase the overall potential success of the opportunity.</p>" +
	// 			"<p>This section clarifies the issues that need to be analyzed in order to fully assess the value and viability of an opportunity based upon its operational  characteristics and the weaknesses to focus on in order to dramatically improve the potential outcome.</p>" +
	// 			"</div>" ,
	// 		"offering" :
	// 			"<div class='title_header'>Offering</div>" + 
	// 			"<div class='question'>\"How Do the Characteristics of the Offering Affect the Opportunity?\"</div>" + 
	// 			"<div class='section_text'>" + 
	// 			"<p>The aspects of the actual product sold or service delivered will also have an important impact on an opportunity. While these characteristics may vary from product to product or service to service within a company, a company will typically have a portfolio of products or services with similar characteristics. A significant failure point of an opportunity is often a poorly-conceived offering that does not offer a sufficient enough value proposition to the targeted customer: the offering did not solve a real problem, the offering was directed at the wrong problem, the offering didn’t deliver enough value compared to its price, or the offering was not at all distinctive in a sea of similar offerings. While most entrepreneurs have significant passion and a deep sense of ownership over the product or service they deliver, they need to fully understand the problem they are trying to solve from the customer’s perspective as dispassionately as possible in order to fairly assess whether or not the offering is on target.</p>" + 
	// 			"<p>Over time, a typical portfolio of products and services will change along with the market feedback, but sufficient time needs to be spent analyzing whether or not the offering at the launch of the opportunity is properly aligned with the customer and market demand.</p>" + 
	// 			"<p>This section clarifies the issues that need to be analyzed in order to fully assess the value and viability of an opportunity based upon its offering and the weaknesses to focus on in order to dramatically improve the potential outcome.</p>" + 
	// 			"</div>" ,
	// 		"customer" :
	// 			"<div class='title_header'>Customer</div>" +
	// 			"<div class='question'>\"How Do the Characteristics of the Customer Relationship Affect the Opportunity?\"</div>" +
	// 			"<div class='section_text'>" +
	// 			"<p>The aspects of how you acquire and interact with customers will have an enormous impact on an opportunity – far more than most entrepreneurs appreciate.  </p>" +
	// 			"<p>The Entrepreneurship department of St. Thomas University undertook a study of 500 failed companies to understand why they failed. The number one reason was a “lack of sufficient sales.” The study determined that it wasn’t necessarily a failure in strategy or insufficient financial resources. The root cause was the inability of the companies to ramp up an adequate level of sales in a timely manner in order to get fully launched. The opportunities basically floundered on the runway and never got liftoff because of the lack of customer traction.</p>" +
	// 			"<p>In many cases, a few early customers are easy to land, but once underway, it can become apparent that it is far harder to acquire customers on an ongoing, predictable basis. Often the length and cost of the sales cycle are dramatically higher than anticipated because of a lack of analysis of the dynamics of the actual sales process.</p>" +
	// 			"<p>There are many customer relationship characteristics that all have significant implications for an opportunity’s required level of investment, ability to grow, profitability, ability to reach breakeven before running out of cash, and more. This section covers everything from how to find potential customers to how sensitive they are to pricing to how long it takes to work them through the sales process from prospect to customer.</p>" +
	// 			"<p>This section clarifies the issues that need to be analyzed in order to fully assess the value and viability of an opportunity based upon how it relates to customers and the weaknesses to focus on in order to dramatically improve the potential outcome.</p>" +
	// 			"</div>" 


	// 	};
	// 	console.log(categories, total, analysis);
	


	// Page.model.find().sort('order').exec(function  (b, pages) {
		
	// 	Answer.model.find({analysis : analysis}).exec(function (e, a) {


	// 		// text += "<div class='lg main_head'>Opportunity IQ Section Overviews</div>";
			

	// 		_.each(a, function  (i) {
	// 			var page = _.findWhere(pages, {name : i.page});
	// 			i.category = i.category.substring(0,1).toUpperCase() + i.category.substring(1);
	// 			var score = Number(i.answer) * 20;
	// 			var cat = _.values(_.filter(categories, function(l, v){return _.keys(l)[0] === i.category.toLowerCase()}))[0][ i.category.toLowerCase()];
				
	// 			cat = Number(cat);
	// 			console.log(i.category);
	// 			if(section_headers[ i.category.toLowerCase() ]){
	// 				text += "<div class='section'>";
	// 				text += section_headers[ i.category.toLowerCase() ];
	// 				// Footer
	// 				text +=	"<div id='footer'>Copyright &copy; 2014 Opportunity IQ</div>";
	// 				text += "</div>";
	// 				delete section_headers[ i.category.toLowerCase() ];	
	// 			}
	// 			text += "<div class='section'>";

	// 			text += 
	// 			"<div class='how-you-answered sb-head'>" +
	// 				"<div class='header'>" +
	// 					"<span>" +
	// 						"<div class='mini-bar'></div>" +
	// 						"<div class='mini-bar'></div>" +
	// 						"<div class='mini-bar'></div>" +
	// 					"</span>" +
	// 					"<span>" +
	// 						"How You Answered" +
	// 					"</span>" +
	// 				"</div>" + 
	// 				"<div class='body'>" +
	// 					"<div class='top'>" +
	// 						"<span> Poor <span>" +
	// 						"<span class='excellent'> Excellent</span>" +
	// 						"<span> Percentile</span>" +
	// 					"</div>" + 
	// 					"<div class='body'>" +
	// 						"<div class='overall'>" +
	// 							"<div class='bars'>" +
	// 								"OPPORTUNITY SCORE" +
	// 								"<div class='bar'> <div class='bar-complete' style='width:" + total + "%'>ffjksflwe</div></div>" +
	// 							"</div>" +
	// 							"<div class='percentages'> <div class='num'> <span> " + total + "%</span></div></div>" +
	// 						"</div><br>" +
	// 						"<div class='category-score'>" +
	// 							"<div class='bars'>" +
	// 								"<div class='t'>" + i.category.toUpperCase() +  ' ANALYSIS SCORE</div>' +
	// 								"<div class='bar'> <div class='bar-complete' style='width:" + cat + "%;'>fjksflwef</div></div>" +
	// 							"</div>" +
	// 							"<div class='percentages'> <div class='num'> <span> "+cat+"% </span></div></div>" +
	// 						"</div><br>" +
	// 						"<div class='page-score'>" +
	// 							"<div class='bars'>" +
	// 								"<div class='t'>" + i.page.toUpperCase() +  ' SCORE </div>' +
	// 								"<div class='bar'><div class='bar-complete' style='width:"+score+"%;'>fjksflwe</div></div>" +
	// 							"</div>" +
	// 							"<div class='percentages'><div class='num'><span>" +score+ "%</span></div></div>" +
	// 						"</div>" +
	// 					"</div>" +
	// 				"</div>" +
	// 			"</div>";


	// 			text += "<p class='col'>";
	// 			text += "</p>";
	// 			text += "<div class='cat'><span><span class='col'>" + i.category + ":</span><span> " + i.page + "</span></span></div><br>";
	// 			text += "<p class='score'>YOUR SCORE : " + (Number(i.answer) * 20) + "%</p><br>";
	// 			text += "<div class='sub'>Key Question The Principle Is Asking:</div>";
	// 			text += "<span class='col'>" + (page['Key Principle'] ? page['Key Principle'].replace(/style="[^>]*"/g, '') : '' )+ "</span><br><br><br>";
	// 			text += "<div class='youranswer'>Your Answer: " + page['answer ' + i.answer + ' text'] + "<br></div>";
	// 			text += "<div class='youranswer'>Your Answer: <span class='col'>" + (page['answer' + i.answer]) + "</span></div><br>";
	// 			text += "<div class='sub'>Definition Of The Principle:</div>";
	// 			text += "<span class='col move15'>" + (page['Definition'] ? page['Definition'].replace(/style="[^>]*"/g, '') : '') + "</span><br><br><br>";
	// 			text += "<div class='sub'>Why This Principle Matters:</div>";
	// 			text += "<span class='col move15'>" + (page['Why This Matters'] ? page['Why This Matters'].replace(/style="[^>]*"/g, '') : '' ) + "</span><br><br><br>";
	// 			text += "<div class='sub'>Explanation Of The Principle:</div>";
	// 			text += "<span class='col move15'>" + (page['Explanation'] ? page['Explanation'].replace(/style="[^>]*"/g, '') : '') + "</span><br><br>";
	// 			// text += "<div class='sub'>Examples:</div>";
	// 			// text += "<span class='col'>" + (page['Examples'] ? page['Examples'].replace(/style="[^>]*"/g, '') : '') + "</span><br><br>";
	// 			// text += "<div class='sub'>What this means:</div>";
	// 			// text += "<span class='col'>" + (i.whatthismeans || fakeText) + "</span><br><br>";
				
	// 			// Footer
	// 			text +=	"<div id='footer'>Copyright &copy; 2014 Opportunity IQ</div>";
	// 			text += "</div>";
	// 		})
	// 		text += "</body>";
			// text += "<style>"+
			// 		"body{font-size:12px;}" + 
			// 		".section{" +
			// 			"position:relative;" +
			// 			"height:1000px;" +
			// 			"padding:50px;" +
			// 			"page-break-after:always;" +

			// 		"}" +
			// 		".main_section{height:990px;}" + 
			// 		"#footer{" + 
			// 			"position:absolute;" +
			// 			"bottom:10px;" +
			// 			"text-align:center;" +
			// 			"width:100%;" +

			// 		"}" +

 		// 			".lg{font-size:30px;}.lg span{border-bottom:1px solid #999}" + 
			// 		".cat > span{"+
			// 			"border-bottom : 1px solid #999;"+
			// 			"font-size:20px;" + 
			// 		"}"+
			// 		".main_head{text-align:center;}" + 
			// 		".move15{margin-bottom:-20px;}" + 
			// 		".sub{" + 
			// 			"font-size:10px;" + 
			// 			"font-weight:800;" +
			// 		"}" +
			// 		".col {" +
			// 			"color:#999;" +
			// 			"display:inline-block;" +
			// 		"}" +
			// 		".score{" +
			// 			"font-size:15px;" +
			// 			"margin-bottom:60px;" +
			// 		"}" +
			// 		".title_header{" + 
			// 			"background: #eee;" +
			// 			"padding:5px 2px;" +
			// 			"margin-bottom:10px;" +
			// 			"color:#555;" + 
			// 			"font-size:10px;" + 
			// 		"}" +
			// 		".section_text{" + 
			// 			"color:#999;" +
			// 		"}" +

			// 		".mini-bar{" +
			// 			"height:1px;" + 
			// 			"background:white;" +
			// 			"margin-bottom:2.8px;" +
			// 			"margin-top:2.8px;" +
			// 		"}" +


			// 		".how-you-answered {" +
			// 			"width:200px;" +
			// 			"position:absolute;" +
			// 			"top: 85px; " +
			// 			"font-size:9px; " +
			// 			"right: 50px;" +
			// 		"}" +
			// 		".how-you-answered .header span:first-child { "+
			// 			"width:6%;" + 
			// 			"text-align:center;" +
			// 			"padding:2px;" +
			// 		"}" +
			// 		".how-you-answered .header span{" +
			// 			"background:#a8ba57; " +
			// 			"height:100%;" +
			// 			"display:inline-block;" +
			// 			"padding:2px 3px;" +
			// 			"color:white;" +
			// 		"}" +
			// 		".how-you-answered .header span:last-child { "+
			// 			"width:83%;" + 
			// 			"padding:2px 5px;" +
			// 			"float:right;" + 
			// 		"}" +
			// 		".how-you-answered .top .excellent{" +
			// 			"margin-left:75px;" +
			// 			"margin-right:40px;" +
			// 		"}" +
			// 		".how-you-answered .body {" +
			// 		    "margin-top: 6px;" +
			// 		    "font-size: 7px;" +
			// 		"}" +
			// 		".how-you-answered .top {" +
			// 		    "border-bottom: 1px solid #999;" +
			// 		    "margin-bottom: 5px;" +	
			// 		"}" +
			// 		".how-you-answered .bottom{margin-top: 15px;}" +
			// 		".how-you-answered .bars{" +
			// 			"color: #8A8888;" +
			// 			"width:76%;" +
			// 		"}" +
			// 		".how-you-answered .bar{" +
			// 		    "border: 1px solid #a8ba57;" +
			// 		    "width:100%;" +
			// 			"color:transparent;" +

			// 		"}" +
			// 		".how-you-answered .bar-complete{background: #a8ba57;height: 100%;}" +
			// 		".how-you-answered >.body >.body > div > div {" +
			// 		    "display: inline-block;" +
			// 		    "vertical-align:bottom;" +
			// 		"}" +
					
			// 		".how-you-answered .percentages{" +
			// 			"width: 13%;" +
			// 			"margin-left:4%;" +
			// 		"}" +	
			// 		".how-you-answered .num{" +
			// 		    "background: #545454;" +
			// 			"color: white;" +
			// 			"padding: 1px 8px;" +
			// 			"width:100%;" +
			// 			"text-align: center;" +
			// 		"}" +
				


			// 		"</style>";
			
	// 		startPhantom(text);
	// 	})

	// })
var style = require('./pdf-styles')();
var text = req.body.html;
	text += '<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet">';
	// text += '<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">';
	text += '<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">';
	text += "<style>";
	text += style;
	text += "#report, .first-page{" + "page-break-after:always;" + "}";
	text += "@font-face {font-family: museo; src: url(http://opiq-stage.herokuapp.com/fonts/Museo_Slab_500.otf); }";
	text += ".show-your-work.sb-head.grey.notes .body {margin-right: 1px !important; }";
	text += ".none{display:none;}";
	text += ".main-content{margin-left:-7px;}";
	text += ".date {top:800px !important; }";
	text += ".last-page{height:800px; text-align: center;}";
	text += ".last-page .analysis-subtitle {font-size: 16px; margin-bottom: 10px; color: #9E9E9E;}";
	text += ".last-page .link {font-weight: bold; font-size: 12px; color: #BCDA44; letter-spacing: 2px;}";
	text += "#sidebar .sb-head .header>span:last-child, #notes .sb-head .header>span:last-child {width: 93%;float:right; }";
	text += "#sidebar .sb-head .header>span:first-child, #notes .sb-head .header>span:first-child {width: 5%;padding:6px 0px 5px 0px !important; }";
	text += ".float-right {float: right; margin-right: 7px;}";
	text += ".how-you-answered .body .percentages .num{padding-top:2px;padding-bottom:2px;}"
	text += ".section .header .icon{width:5% !important;padding-top:4px !important; padding-bottom:5px !important;}";
	text += ".section:not(:first-child) .header .icon{padding-bottom:6px !important;padding-top:3px !important;}";
	text += ".section:first-child .header .icon{padding-top:4px !important;}";
	text += ".section *, .section>.body>.t *{font-size:13px !important;}";
	text += ".section .header div:last-child{width:94% !important;}";
	text += "div#login{width:100%;}";
	text += ".body .t{height:auto !important;}";
	text += ".last-page img{width:200px; height: auto; margin-top: 300px; margin-bottom: 80px;}";
	text += ".question {margin-bottom: 10px; }";
	text += ".analysis-header {color: #999; text-align: center; font-size: 50px; }";
	// text += "#sidebar{float:none;clear:both;}";
	text += ".content-content{margin:10px; }";
	text += "#sidebar{page-break-after:always;}";
	text += "table{width:100%;}";
	text += ".analysis-subtitle{width: 100%;text-align: center; color: #9E9E9E; font-size: 16px;}";
	text += ".date {color: #a8ba57 !important; top: 525px !important; font-size: 14px !important; }";
	text += ".section>.body{padding-left:50px !important;margin-bottom:0px !important;padding-bottom:2px !important;}";
	text += ".section .body .t{padding-bottom:2px !important; margin-bottom:0px !important;}";
	text += ".first-page {position: relative; text-align: center;} ";
	text += ".first-page img {width: 160px; margin: 200px auto 40px; height: auto;}";
	text += ".last-page img{vertical-align:middle;}";
	text += ".date {width: 100%; text-align: center; color: white; font-size: 17px; }";
	text += ".first-page .analysis-header{color:#6e6e6e !important;width:100%; font-family: museo !important; }";
	// text += ".content-header{display: none !important;}";
	text += ".analysis{display:none !important;}";
	text +=	"</style>";

startPhantom(text);
	function startPhantom (text) {
				
		phantom.create(function(ph){
		  	ph.createPage(function(page) {
		  	
		  		
				page.set('content', text);
				
				// page.set('viewportSize', {width:1100, height:800}, start);
				setTimeout(function(){
					page.set('paperSize', {format: 'A4', margin: 50}, start)
				}, 1000)
			
				function start(){
				    page.render(req.body.analysis  + '.pdf', function(){
				      	console.log('page rendered');
				      	
				     
						
						res.download(req.body.analysis + ".pdf");
					
				        ph.exit(function(code){console.log(code)});

				    });
	  	
		  		}
		  	


		  	});
		    
		}, { port: 12301 });
	}
}