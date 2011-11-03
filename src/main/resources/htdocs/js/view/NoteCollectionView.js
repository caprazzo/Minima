NoteCollectionView = Backbone.View.extend({
	tagName: 'ul',
	className: 'notes-container',
	initialize: function(args) {
		_(this).bindAll('addNote');
		this.notes = args.notes;
		this.readonly = args.readonly;
		this.listId = args.listId;
		var that = this;
		this._filter = function(note) { 
			return !note.get('archived') && note.get('list') == that.listId; 
		};
		this._noteViews = [];
		this.notes.bind('add', this.render, this);
		this.notes.bind('change', this.render, this);
	},
	
	render: function() {
		console.log('render ' + this.listId);
		var that = this;
		
		$(this.el).attr('id', 'lists-' + this.listId);
		
		if (!this._rendered) {
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
					console.log(ui.item.parent(), that.el);
					
					if (ui.item.parent().attr('id') != that.el.id)
						return;
					console.log('update', that.listId);
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
					console.log(that.listId);
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
		
		var that = this;
		
		$(this.el).empty();
		this._noteViews = [];
		
		var filtered = this.notes.filter(this._filter);
		console.log('filtered stories for list', this.listId, filtered);
		_(filtered).each(this.addNote);
		
		if (!this._rendered) {
			_(this._noteViews).each(function(noteView) {
				$(that.el).append(noteView.render().el)
			});
		}
		
		this._rendered = true;
		return this;
	},
	
	addNote: function(note) {
		console.log('add note with list', note.get('list'), 'to collectionvew', this.listId);
		var noteView = new NoteView({
			model: note,
			readonly: this.readonly
		});
		
		this._noteViews.push(noteView);
		
		if (this._rendered)
			$(this.el).append(noteView.render().el);
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
	}
});