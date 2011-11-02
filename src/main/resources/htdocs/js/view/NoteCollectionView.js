NoteCollectionView = Backbone.View.extend({
	tagName: 'ul',
	className: 'notes-container',
	initialize: function(args) {
		_(this).bindAll('addNote');
		this.notes = args.notes;
		this._filter = args.filter;
		this._noteViews = [];
		_(this.notes.filter(this._filter)).each(this.addNote);
		this.notes.bind('add', this.addNote);
	},
	
	render: function() {
		this._rendered = true;
		$(this.el).empty();
		
		var that = this;
		_(this._noteViews).each(function(noteView) {
			$(that.el).append(noteView.render().el)
		});
		return this;
	},
	
	addNote: function(note) {
		var noteView = new NoteView({
			model: note
		});
		
		this._noteViews.push(noteView);
		
		if (this._rendered)
			$(this.el).append(noteView.render().el);
	}
});