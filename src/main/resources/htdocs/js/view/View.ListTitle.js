window.List = Backbone.Model.extend({
	
	defaults: function() {
		return {
			name: 'foo'
		};
	}
	
});

ListNameView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-name-container',
	
	initialize: function() {
		this.template = _.template($('#list-name-template').html());
		this.model.bind('change', this.render, this);
		this.ui = {
			edit: null,
			view: null
		}
	},
	
	events: {
		'dblclick .list-name-view': 'activateEdit',
		'keypress .list-name-edit': 'onEditEnter',
		'keyup .list-name-edit': 'onEditEsc'
	},
	
	render: function() {
		var $el = $(this.el);
		$el.html(this.template(this.model.toJSON()));
		this.ui.edit = $el.find('.list-name-edit');
		this.ui.view = $el.find('.list-name-view');
	},
	
	activateEdit: function() {
		this.ui.view.hide();
		this.ui.edit.show().focus();
	},
	
	onEditEnter: function(e) {
		if (e.keyCode == 13) this.save();
	},
	
	onEditEsc: function(e) {
		if (e.keyCode == 27) this.render();
	},
	
	save: function() {
		this.model.set({ name: $(this.el).find('.list-name-edit').val()});
	}
});