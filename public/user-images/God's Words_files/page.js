var Page = function(){
	var self = this;


	// Event Handlers
	$('.createCat').on('click', function () {
		
		data.create('category', {
			title : $('.newcategory').val(),
			level : 2
		});


		return false;
	});
  	
	function updateEach(type, col) {
		var each = $('.each-' + type), clone, model;

		if(each.length > 1)
			each = each.get(0);

		

		for(var i = 0; i < col.length; i++){
			model = col[i];


			clone = $(each).clone();
			for(var prop in model.model)
				clone.find('.' + prop).text(model.model[prop]);

			clone.find('.delete').on('click', model.destroy.bind(model));
		}
		
		$(each).before(clone);

	}
	function destroy () {
		$(this).remove();
	}

	this.updateHTML = function (type, col) {
		updateEach(type, col)
	}

}


var page = new Page();