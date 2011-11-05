ListView = Backbone.View.extend({
	tagName: 'li',
	model: List,
	className: 'list-container',
	
	initialize: function(args) {
		this.notes = args.notes;
		this.filteredNotes = args.filteredNotes;
		this.readonly = args.readonly;
		this.template = _.template($('#list-template').html());
		this.tag = '[ListView  ' + this.model.name +']';
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
			pos = nextView.model.get('pos') + 65536;
		}
		else if (!nextView) {
			pos = prevView.model.get('pos') / 2;
		}
		else {
			pos = prevView.model.get('pos') + ((nextView.model.get('pos') - prevView.model.get('pos')) / 2);
		}
		this.model.set({pos: pos});
		this.model.save();
	},
	
	render: function() {
		console.log(this.tag, 'render', this._rendered);
		var el = $(this.el);		
		el.html(this.template());		
		
		var notesView = new NoteCollectionView({ 
			notes: this.notes,
			filteredNotes: this.filteredNotes,
			listId: this.model.id,
			readonly: this.readonly
		});
		
		el.find('.list-notes').append(notesView.render().el);
		
		var nameView = new ListNameView({
			model: this.model,
			readonly: this.readonly
		});
		el.find('.list-header').append(nameView.render().el);
		
		
		if (!this.readonly) {
			var createView = new NoteCreateView({ model: this.model, notes: this.notes });
			createView.bind('create', function(note) {
				this.notes.create(note);
				notesView.addNote(note);				
			}, this);
			el.find('.list-footer').append(createView.render().el);
		}
		
		this._rendered = true;
		return this;
	}
});