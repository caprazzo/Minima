ListCollectionView = Backbone.View.extend({
	tagName: 'div',
	className: 'lists-container',
	_rendered: false,
	
	initialize: function(args) {
	    _(this).bindAll('addList');
	    this.readonly = args.readonly;
	    this.lists = args.lists;
	    this.notes = args.notes;
		this._listViews = {};
		this.lists.each(this.addList);		
		this.lists.bind('sort', this.onChangePos, this);
		this.lists.bind('add', this.addList, this);
		this.lists.bind('remove', this.removeList, this);
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
	
	removeList: function(list) {
		var view = this._listViews[list.id];
		if (view) {
			delete this._listViews[list.id];
			view.remove();
			this.resize($(window).width());
		}	
	},
	
	onChangePos: function(list) {
		var listView = this._listViews[list.id];
		if (!listView)
			return;
		
		console.log(_.map(this._listViews, function(list) { return list.model.get('name'); }));
		
		this._sortViewCache();
		
		var target = _.indexOf(_.keys(this._listViews), list.id);
		var current = $(listView.el).index();
		
		console.log(_.map(this._listViews, function(list) { return list.model.get('name'); }), 'moving', list.get('name'), 'from', current, 'to', target);
		
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
		if (this._rendered) {
			console.warn(this.tag, 'RE-RENDER');	
			//return this;
		}
		this._rendered = true;
		
		var that = this;
		
		// when draggin an item that is below the fold
		// the container is momentarily resized
		// and the scroll position is lost.
		// I keep track of the current scroll and reapply
		// it on drag start.
		var scroll = document.body.scrollTop;
		$(window).scroll(function() {
			scroll = document.body.scrollTop;
		});
		
		var el = $(this.el);
		var ul = $('<ul class="lists-ul-container"></ul>').appendTo(el).sortable({
			tolerance: 'pointer',
			start: function(e, ui) {
				var thisView = _.find(that._listViews, function(view) {
					return view.el == ui.item.get(0);
				});
				thisView.startDrag();
				
				ui.placeholder.css({backgroundColor: '#8C8C8C', visibility: 'visible'});
				ui.placeholder.height(ui.item.height());
				ui.placeholder.width(ui.item.width());
				$(window).scrollTop(scroll);
			},
			stop: function(el, ui) {
				var thisView = _.find(that._listViews, function(view) {
					return view.el == ui.item.get(0);
				});
				thisView.stopDrag();
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
			},			
			disabled: this.readonly
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
		
		if (this._listViews[list.id]) {
			console.warn("ListCollectionView.addList called for a list that was already added", this, list);
			return;
		}
		
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
		if (this._rendered)
			this.render();
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