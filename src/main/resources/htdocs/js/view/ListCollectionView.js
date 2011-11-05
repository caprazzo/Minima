ListCollectionView = Backbone.View.extend({
	tagName: 'div',
	className: 'lists-container',
	initialize: function(args) {
		// bind the functions 'add' and 'remove' to the view.
	    _(this).bindAll('addList');
	    this.readonly = args.readonly;
	    this.lists = args.lists;
	    this.notes = args.notes;
		this._listViews = {};
		this.lists.each(this.addList);		
		this.lists.bind('change:pos', this.onChangePos, this);
		this.lists.bind('add', this.addList, this);
		this.tag = '[ListCollectionView]';
	},
	
	resize: function(availableWidth) {
		var newWidth = availableWidth - 45;
		var maxListWidth = 330;
		var minListWidth = 210;
		var cutoffBoardSize = minListWidth * this.lists.size();
		var verticalBoradSize = minListWidth;
		
		var calcSize = 0;
		
		if (newWidth < cutoffBoardSize) {
			newWidth = maxListWidth;
			calcSize = maxListWidth;
		}		
		else {
			var calcSize =  (newWidth)/this.lists.size();
			if (calcSize > maxListWidth) calcSize = maxListWidth;
			if (calcSize < minListWidth) calcSize = minListWidth;
		}
		
		this.width = newWidth;
		
		if (this._rendered)
			$(this.el).width(this.width);
		
		this.listWidth = calcSize;
		
		_(this._listViews).chain().values().each(function(l) { l.resize(calcSize); });
	},
	
	onChangePos: function(list) {
		var listView = this._listViews[list.id];
		if (!listView)
			return;
		
		this._sortViewCache();
		
		var target = _.indexOf(_.keys(this._listViews), list.id);
		var current = $(listView.el).index();
		
		console.log(_.keys(this._listViews), list.id, target, current);
		
		if (target != current) {
			$(listView.el).remove();
			var children = this.ui.ul.children();
			var tel = children.get(target);
			if (tel) {
				$(listView.el).insertBefore(tel);
			}
			else {	
				$(listView.el).appendTo(this.ui.ul);
			}
			listView.render();
		}
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
		_(this._listViews).chain().values().each(function(listView) {
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
		this._listViews[listView.model.id] = listView;
		
		this._sortViewCache();
		
		var target = _.indexOf(_.keys(this._listViews), list.id);
		
		// insert view in correct position
		var tel = $(this.el).children().get(target);
		if (tel) {
			if (tel != listView.el)
				$(listView.el).insertBefore(tel);
		}
		else {		
			$(this.el).append(listView.el);
		}
		listView.render();
		listView.resize(this.listWidth);
		this.resize($(window).width());
	},
	
	_sortViewCache: function() {
		var sorted = _.sortBy(this._listViews, function(val, key) {
			return val.model.get('pos');
		});
		
		var sortedObj = {};
		_.each(sorted, function(val) {
			sortedObj[val.model.id] = val;
		});
		this._listViews = sortedObj;
	},
	
});