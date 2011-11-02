ListCollectionView = Backbone.View.extend({
	tagName: 'div',
	className: 'lists-container',
	initialize: function(args) {
		// bind the functions 'add' and 'remove' to the view.
	    _(this).bindAll('addList');
	    this.lists = args.lists;
	    this.notes = args.notes;
	    
		var that = this;
		this._listViews = [];
		this.lists.each(this.addList);				
						
		this.lists.bind('add', this.addList);
	},
	
	render: function() {
		this._rendered = true;
		var that = this;
		$(this.el).empty();
		
		_(this._listViews).each(function(listView) {
			$(that.el).append(listView.render().el);
		});
		return this;
	},
	
	addList: function(list) {
		var listView = new ListView({ 
			model: list,
			notes: this.notes
		});		
		this._listViews.push(listView);
		
		if (this._rendered)
			$(this.el).append(listView.render().el);
	}
	
});