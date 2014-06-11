var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;



var Page = new keystone.List('Page');

Page.add({
	name: { type: Types.Text, required: true, index: true },
	category: { type: Types.Select, options: 'industry / market, financial, operational, offering, customer', default: 'industry / market', index: true},
	order : { type : Types.Number},
	image : { type: Types.CloudinaryImage },
	"Key Principle" : {type : Types.Html, wysiwyg : true, height: 150},
	"Definition" : { type: Types.Html, wysiwyg: true, height: 150 },
	"Why This Matters" : { type: Types.Html, wysiwyg: true, height: 150 },
	"Explanation" : { type: Types.Html, wysiwyg: true, height: 150 },
	"Examples" : { type: Types.Html, wysiwyg: true, height: 150 },
	right : { type: Types.Html, wysiwyg: true, height: 150 },
	"right image" : { type: Types.CloudinaryImage },
	wrong : { type: Types.Html, wysiwyg: true, height: 150 },
	"wrong image" : { type: Types.CloudinaryImage },
	"Caution" : { type: Types.Html, wysiwyg: true, height: 150 },
	answer1 : { type : String},
	"answer 1 text" : {type : Types.Html, wysiwyg : true, height: 150},
	"how to improve 1" : {type : Types.Html, wysiwyg : true, height: 150},
	answer2 : { type : String},
	"answer 2 text" : {type : Types.Html, wysiwyg : true, height: 150},
	"how to improve 2" : {type : Types.Html, wysiwyg : true, height: 150},
	answer3 : { type : String},
	"answer 3 text" : {type : Types.Html, wysiwyg : true, height: 150},
	"how to improve 3" : {type : Types.Html, wysiwyg : true, height: 150},
	answer4 : { type : String},
	"answer 4 text" : {type : Types.Html, wysiwyg : true, height: 150},
	"how to improve 4" : {type : Types.Html, wysiwyg : true, height: 150},
	answer5 : { type : String},
	"answer 5 text" : {type : Types.Html, wysiwyg : true, height: 150},
	"how to improve 5" : {type : Types.Html, wysiwyg : true, height: 150},
	createdAt : { type : Types.Date, default : Date.now(), index : true }
});


/**
 * Registration
 */

Page.defaultColumns = 'name, category, createdAt';
Page.register();
