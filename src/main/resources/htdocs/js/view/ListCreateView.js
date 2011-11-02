ListCreateView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-name-container',
	
	events: {
		'mouseenter .list-add-note-btn': 'toggleBtnHighlight',
		'mouseleave .list-add-note-btn': 'toggleBtnHighlight',
		'click .list-add-note-btn': 'activateTextarea'
	},
	
	initialize: function() {
		this.template = _.template($('#list-create-template').html());
	},
	
	render: function() {
		var $el = $(this.el);
		$el.html(this.template(this.model.toJSON()));
		return this;
	},
	
	toggleBtnHighlight: function() {
		
	},
	
	activateTextarea: function() {
		
	}
	
});