ListView = Backbone.View.extend({
	tagName: 'li',
	model: List,
	className: 'list-container',
	_rendered: false,
	
	initialize: function(args) {
		this.notes = args.notes;
		this.filteredNotes = args.filteredNotes;
		this.readonly = args.readonly;
		this.template = Templates['list'];
		this.tag = '[ListView  ' + this.model.id +']';
	},
	
	events: {		
		'click .list-archive-btn': 'archiveList',
		'click .note-create-btn': 'showCreateView'
	},
	
	resize: function(width) {
		if (this._rendered) {
			var el = $(this.el);
			var diff = el.outerWidth(true) - el.width();
			el.width(width - diff);
		}
	},
	
	reposition: function(prevView, nextView) {
		var pos = null;
		if (!prevView) {
			pos = nextView.model.get('pos') / 2;
			
		}
		else if (!nextView) {
			pos = prevView.model.get('pos') + 65536;
		}
		else {
			pos = prevView.model.get('pos') + ((nextView.model.get('pos') - prevView.model.get('pos')) / 2);
		}
		this.model.set({pos: pos});
		this.model.save();
	},
	
	render: function() {
		if (this._rendered) {
			console.warn(this.tag, 'RE-RENDER');
			return this;
		}
		this._rendered = true;
		var el = $(this.el);		
		el.html(this.template());
		
		this.ui = {
			notes: el.find('.list-notes'),
			archive: el.find('.list-archive-btn'),
			header: el.find('.list-header'),
			name: el.find('.list-name'),
			footer: el.find('.list-footer'),
			createBtn: el.find('.note-create-btn')
		}
		
		this.notesView = new NoteCollectionView({ 
			notes: this.notes,
			filteredNotes: this.filteredNotes,
			listId: this.model.id,
			readonly: this.readonly
		});
		
		this.nameView = new ListNameView({
			model: this.model,
			readonly: this.readonly
		});
		
		this.ui.notes.append(this.notesView.render().el);
		this.ui.name.append(this.nameView.render().el);
		
		if (!this.readonly)
			this._setupEditUi();
		
		return this;
	},
	
	showCreateView: function() {
		if (this.readonly)
			return;
		this.noteEditView.edit();
		this.ui.createBtn.hide();
	},
	
	createNote: function(note) {
		// find position
		var that = this;		
		
		var lastNote = _(this.notes.filter(function(note) {
			return !note.get('archived') && note.get('list') == that.model.id;
		})).last();		
		var pos = (lastNote) ? lastNote.get('pos') : 0;
		
		note.set({
			id: Minima.makeId(),
			revision: 0,
			list: this.model.id,
			pos: pos + 65536
		}, {silent:true});
		
		this.notes.create(note);
		this.notesView.addNote(note);
	},
	
	startDrag: function() {
		this._isDragging = true;
		this.ui.archive.hide();
	},
	
	stopDrag: function() {
		this._isDragging = false;
	},
	
	showArchive: function() {
		if (this._isDragging || this.readonly) return;
		this.ui.archive.show();
	},
	
	hideArchive: function() {
		this.ui.archive.hide();
	},
	
	archiveList: function() {
		$(this.el).remove();
		this.model.set({archived: true});
		this.model.save();
	},
	
	_setupEditUi: function() {
		var view = this;
		
		this.ui.header.hover(
			function() { view.showArchive() },
			function() { view.hideArchive() }
		);

		this.ui.createBtn.show().hover(
			function() { view.ui.createBtn.addClass('note-create-btn-hover'); },
			function() { view.ui.createBtn.removeClass('note-create-btn-hover'); }
		);
		
		var newNote = new Note({});
		newNote.bind('change', function(note) {
			var clone = note.clone();
			note.clear({silent: true});
			this.createNote(clone);
		}, this);
		
		this.noteEditView = new NoteEditView({model: newNote});
		this.noteEditView.bind('reset', function() {
			this.ui.createBtn.show();
		}, this);
		
		this.ui.footer.append(this.noteEditView.render().el);
	}
});