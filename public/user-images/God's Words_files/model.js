// Models
var Models =  function(type, modelId, reference){
	this.id = modelId += 1,
	this.type = reference[ type ];
	this.modeltype = type;

}

Models.prototype = {
	errors : [],
	error : function (err) {
		this.errors = err;
	},
	save : function () {
		var self = this;
		$.post('/' + this.type , this.model, function (data) {
			self._id = data._id;
		});
	},
	destroy : function (cb) {
		$.ajax({
			url : '/' + this.type + '/' + this._id,
			type : 'DELETE'
		})
	},
	edit : function () {
		$.ajax({
			url : '/' + this.type + '/' + this._id,
			type : 'PUT',
			data : { id : this.model }
		})	
	},
	create : function (obj) {
		this.model = obj;
		this.save();
	}
}

	

	

	

