AlertArchivedView = Backbone.View.extend({
	tagName: 'div',
	className: 'alert-container',
	model: Note,
	
	initialize: function(args) {
		this.template = Templates['alert-archived-template'];
	},
	
	events: {
		'click .close': 'dismiss',
		'click .undo': 'undo'
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template(this.vars));
		return this;
	},
	
	dismiss: function() {
		$(this.el).remove();
	},
	
	undo: function() {
		var view = this;
		this.model.save({archived: false}, {
			success: function() {
				$(view.el).remove();
			}
		});
	}	
	
});