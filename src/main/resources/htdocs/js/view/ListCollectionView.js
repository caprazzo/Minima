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
		this.tag = '[ListCollectionView]';
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
		console.log(this.tag, 'render', this._rendered);
		this._rendered = true;
		var that = this;
		
		var el = $(this.el);
		var ul = $('<ul class="lists-ul-container"></ul>').appendTo(el).sortable({
			tolerance: 'pointer',
			start: function(e, ui) {
				ui.placeholder.css({backgroundColor: '#8C8C8C', visibility: 'visible'});
				ui.placeholder.height(ui.item.height());
				ui.placeholder.width(ui.item.width());
			},
			update: function(e, ui) {
				var thisView = _.find(that._listViews, function(view) {
					return view.el == ui.item.get(0);
				});
				
				var prevView = _.find(that._listViews, function(view) {
					return view.el == ui.item.prev().get(0);
				});
				
				var nextView = _.find(that._listViews, function(view) {
					return view.el == ui.item.next().get(0);
				});
				
				thisView.reposition(prevView, nextView);
			}
		});
		this.ui = {
			el: el,
			ul: ul
		}		
		ul.empty();		
		_(this._listViews).each(function(listView) {
			ul.append(listView.render().el);
			listView.resize(that.listWidth);
		});
		
		$(this.el).width(this.width);
		return this;
	},
	
	addList: function(list) {
		
		var filteredNotes = new FilteredCollection([], {
			parent: this.notes, 
			filter: function(note) {
				return !note.get('archived') && note.get('list') == list.id; 
			},
			comparator: function(note) {
				return note.get('pos');
			}
		});
		
		var listView = new ListView({ 
			model: list,
			notes: this.notes,
			filteredNotes: filteredNotes,
			width: this.listWidth,
			readonly: this.readonly
		});		
		this._listViews.push(listView);
		
		if (this._rendered) {
			$(this.el).append(listView.el);
			listView.resize(this.listWidth);
		}
	}
	
});