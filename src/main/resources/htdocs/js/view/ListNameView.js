ListNameView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-name-container',
	
	initialize: function(args) {
		this.template = _.template($('#list-name-template').html());
		this.model.bind('change:name', this.render, this);
		this.readonly = args.readonly;
	},
	
	events: {
		'dblclick .list-name-view': 'activateEdit',
		'keypress .list-name-edit': 'onEditEnter',
		'keyup .list-name-edit': 'onEditEsc'
	},
	
	render: function() {
		var $el = $(this.el);
		$el.html(this.template(this.model.toJSON()));
		this.ui = {
			edit: $el.find('.list-name-edit'),
			view: $el.find('.list-name-view')
		}
		return this;
	},
	
	activateEdit: function() {
		if (this.readonly)
			return;
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
		this.model.set({ name: this.ui.edit.val() });
		this.render();
	}
});