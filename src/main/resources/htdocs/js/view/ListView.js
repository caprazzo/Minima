ListView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-container',
	
	initialize: function(args) {
		this.notes = args.notes;
		this.filteredNotes = args.filteredNotes;
		this.readonly = args.readonly;
		this.template = _.template($('#list-template').html());
	},
	
	resize: function(width) {
		if (this._rendered) {
			var el = $(this.el);
			var diff = el.outerWidth(true) - el.width();
			el.width(width - diff);
		}
	},
	
	render: function() {
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
			var createView = new ListCreateView({ model: this.model, notes: this.notes });
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