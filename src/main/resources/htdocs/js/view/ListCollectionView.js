ListCollectionView = Backbone.View.extend({
	tagName: 'div',
	className: 'lists-container',
	initialize: function(args) {
		// bind the functions 'add' and 'remove' to the view.
	    _(this).bindAll('addList');
	    this.readonly = args.readonly;
	    this.lists = args.lists;
	    this.notes = args.notes;
		this._listViews = [];
		this.lists.each(this.addList);				
						
		this.notes.bind('add', this.render, this);
		this.notes.bind('change', this.render, this);
	},
	
	resize: function(availableWidth) {
		var newWidth = availableWidth - 45;
		var maxListWidth = 330;
		var minListWidth = 210;
		var cutoffBoardSize = minListWidth * 3;
		var verticalBoradSize = minListWidth;
		
		var calcSize = 0;
		
		if (newWidth < cutoffBoardSize) {
			newWidth = maxListWidth;
			calcSize = maxListWidth;
		}		
		else {
			var calcSize =  (newWidth)/3;
			if (calcSize > maxListWidth) calcSize = maxListWidth;
			if (calcSize < minListWidth) calcSize = minListWidth;
		}
		
		this.width = newWidth;
		
		if (this._rendered)
			$(this.el).width(this.width);
		
		this.listWidth = calcSize;
		
		_(this._listViews).each(function(l) { l.resize(calcSize); });
	},
	
	render: function() {
		this._rendered = true;
		var that = this;
		$(this.el).empty();
		
		_(this._listViews).each(function(listView) {
			$(that.el).append(listView.render().el);
			listView.resize(that.listWidth);
		});
		
		$(this.el).width(this.width);
		return this;
	},
	
	addList: function(list) {
		var listView = new ListView({ 
			model: list,
			notes: this.notes,
			width: this.listWidth,
			readonly: this.readonly
		});		
		this._listViews.push(listView);
		
		if (this._rendered) {
			$(this.el).append(listView.render().el);
			listView.resize(this.listWidth);
		}
	}
	
});