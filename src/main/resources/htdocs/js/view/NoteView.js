NoteView = Backbone.View.extend({
	tagName: 'div',
	model: Note,
	className: 'note-container',
	
	initialize: function(args) {
		this.template = _.template($('#note-template').html());				
	},
	
	render: function() {
		var $el = $(this.el);	
		$el.html(this.template(this.model.toJSON()));
		return this;
	}
});