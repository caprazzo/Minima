ListView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-container',
	
	initialize: function(args) {
		this.notes = args.notes;
		this.template = _.template($('#list-template').html());
		console.log(this.model.get('name'));
	},
	
	resize: function(width) {
		if (this._rendered)
			$(this.el).width(width);
	},
	
	render: function() {
		var el = $(this.el);		
		el.html(this.template());		
		
		var notesView = new NoteCollectionView({ 
			notes: this.notes,
			listId: this.model.id
		});
		
		var nameView = new ListNameView({ model: this.model });
		var createView = new ListCreateView({ model: this.model, notes: this.notes });
		createView.bind('create', notesView.addNote, notesView);
		el.find('.list-notes').append(notesView.render().el);
		el.find('.list-header').append(nameView.render().el);
		el.find('.list-footer').append(createView.render().el);
		
		this._rendered = true;
		return this;
	}
});