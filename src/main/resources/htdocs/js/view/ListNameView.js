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
		'dblclick .list-name-display': 'activateEdit',
		'keypress .list-name-edit': 'onEditEnter',
		'keyup .list-name-edit': 'onEditEsc'
	},
	
	render: function() {
		var $el = $(this.el);
		var json = this.model.toJSON();
		$el.html(this.template(json));
		this.ui = {
			edit: $el.find('.list-name-edit'),
			view: $el.find('.list-name-display')
		}
		return this;
	},
	
	activateEdit: function() {
		if (this.readonly)
			return;
		this.ui.edit.show().focus();
		this.ui.view.hide();		
	},
	
	onEditEnter: function(e) {
		if (e.keyCode == 13) this.save();
	},
	
	onEditEsc: function(e) {
		if (e.keyCode == 27) this.render();
	},
	
	save: function() {
		var text = $.trim(this.ui.edit.val());
		if (text.length == 0)
			return;
		this.model.set({ name: text });
		this.model.save();
		this.render();
	}
});