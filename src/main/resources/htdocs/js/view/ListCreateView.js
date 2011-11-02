ListCreateView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-name-container',
	
	initialize: function() {
		this.template = _.template($('#list-create-template').html());
	},
	
	render: function() {
		var $el = $(this.el);
		$el.html(this.template(this.model.toJSON()));
		return this;
	}
	
});