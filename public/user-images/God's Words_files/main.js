function Data() {
	
	// Collections
	var Collections = {
		all : [],
		categories : [],
		globals : [],
		tags : [],
		groups : []
	};
	var modelId = 0;

	// Global Dictionary
	this.Reference = {
		category : 'categories',
		global : 'globals',
		tag : 'tags',
		group : 'groups'
	}


	// Global Functions
	this.create = function(type, obj) {
		var model = new Models(type, modelId, this.Reference),
			t = this.Reference[ type ];
			model.create(obj);
			
		
		Collections[ t ].push(model);
		Collections[ 'all' ].push(model);

		page.updateHTML(t, Collections[ t ] );
	}
}

var data = new Data();

