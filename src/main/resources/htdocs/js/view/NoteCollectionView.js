NoteCollectionView = Backbone.View.extend({
	tagName: 'ul',
	className: 'notes-container',
	initialize: function(args) {
		_(this).bindAll('addNote');
		this.notes = args.notes;
		this.filteredNotes = args.filteredNotes;
		this.readonly = args.readonly;
		this.listId = args.listId;
		var that = this;
		this._filter = function(note) { 
			return !note.get('archived') && note.get('list') == that.listId; 
		};
		this._noteViews = [];
		
		this.filteredNotes.bind('remove', this.onRemove, this);
		this.filteredNotes.bind('add', this.addNote, this);
		this.filteredNotes.bind('sort', this.onSort, this);
		
		this.tag = '[NoteCollectionView ' + this.listId +']';
	},
	
	onRemove: function(note) {
		var noteView = this._noteViews[note.id];
		if (noteView) {
			delete this._noteViews[note.id];
			noteView.remove();
		}
	},
	
	onSort: function(note) {
		var noteView = this._noteViews[note.id];
		if (!noteView) return;
		this._sortViewCache();
		var target = _.indexOf(_.keys(this._noteViews), note.id);
		var current = $(noteView.el).index();
		
		if (target != current) {
			$(noteView.el).remove();			
			var tel = $(this.el).children().get(target);
			if (tel)
				$(noteView.el).insertBefore(tel);
			else		
				$(this.el).append(noteView.el);
			noteView.render();
		}
	},
	
	render: function() {
		console.log(this.tag, 'render', this._rendered);
		var that = this;
		if (this._rendered)
			return;
		this._rendered = true;
		
		$(this.el).attr('id', 'lists-' + this.listId);
		this._noteViews = {};
		this._setupContainer();		
		
		var that = this;
		this._noteViews = {};
		this.filteredNotes.each(this.addNote);
		return this;
	},
	
	_sortViewCache: function() {
		var sorted = _.sortBy(this._noteViews, function(val, key) {
			return val.model.get('pos');
		});
		
		var sortedObj = {};
		_.each(sorted, function(val) {
			sortedObj[val.model.id] = val;
		});
		this._noteViews = sortedObj;
	},
	
	addNote: function(note) {
		var noteView = this._noteViews[note.id];
		
		if (noteView)
			return;
		
		noteView = new NoteView({
			model: note,
			readonly: this.readonly
		});
		this._noteViews[note.id] = noteView;
		this._sortViewCache();
		
		// add note in correct position
		if (!this._rendered)
			return;
		
		// find position in view array		
		var target = _.indexOf(_.keys(this._noteViews), note.id);
		
		// insert view in correct position
		var tel = $(this.el).children().get(target);
		if (tel) {
			if (tel != noteView.el)
				$(noteView.el).insertBefore(tel);
		}
		else {		
			$(this.el).append(noteView.el);
		}
		noteView.render();
	},
	
	_findView: function(itemId) {
		return _(this._noteViews).find(function(v) {
			return v.el.id == itemId; 
		});	
	},
	
	_newPosition: function(prev, next) {
		if (!prev && !next)
			return 65536
		
		if (!prev)
			return next.get('pos') / 2;
		
		if (!next)
			return prev.get('pos') + 65536;
		
		var prevPos = prev.get('pos');
		var nextPos = next.get('pos');		
		return prevPos + (nextPos-prevPos)/2;
	},
	
	_setupContainer: function() {
		var that = this;
		$(this.el).sortable({
			connectWith: '.notes-container',
			placeholder: 'notes-placeholder',
			tolerance: 'intersect',
			start: function(e, ui) {
				ui.placeholder.height(ui.item.outerHeight());
				var view = that._findView(ui.item.attr('id'));
				if (!view) return;
				view.startDrag();
			},
			stop: function(e, ui) {				
				var view = that._findView(ui.item.attr('id'));
				if (!view) return;
				view.stopDrag();
			},
			update: function(e, ui) {
				if (ui.item.parent().attr('id') != that.el.id)
					return;
				var view = that._findView(ui.item.attr('id'));
				if (!view) return;
				
				var prevView = that._findView(ui.item.prev().attr('id'));
				var nextView = that._findView(ui.item.next().attr('id'));
				
				var prevModel = (prevView) ? prevView.model : null;
				var nextModel = (nextView) ? nextView.model : null;
				
				view.model.set({pos: that._newPosition(prevModel, nextModel) });
				view.model.save();
			},
			
			receive: function(e, ui) {
				var noteId = ui.item.attr('id').substring('note-'.length);
				var note = that.notes.get(noteId);
				var prevView = that._findView(ui.item.prev().attr('id'));
				var nextView = that._findView(ui.item.next().attr('id'));
				
				var prevModel = (prevView) ? prevView.model : null;
				var nextModel = (nextView) ? nextView.model : null;
														
				note.set({list: that.listId, pos: that._newPosition(prevModel, nextModel)});
				note.save();
			},
			
			disabled: this.readonly
		});
	}
});