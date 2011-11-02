ListView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-container',
	
	initialize: function(args) {
		this.notes = args.notes;
		this.template = _.template($('#list-template').html());
		console.log(this.model.get('name'));
		var that = this;
		this.notesView = new NoteCollectionView({ notes: this.notes, filter: function(note) { 
			return note.get('list') == that.model.id; 
		}});
		this.model.bind('change', this.render, this);
				
	},
	
	render: function() {
		var $el = $(this.el);
		console.log(this.model.get('name'));
		$el.html(this.template(this.model.toJSON()));
		var nameView = new ListNameView({ model: this.model});
		nameView.render();
		$el.find('.list-notes').append(this.notesView.render().el);
		$el.find('.list-header').append(nameView.el);
		return this;
	}
});