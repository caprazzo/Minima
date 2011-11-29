ListNameView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-name-container',
	_rendered: false,
	
	initialize: function(args) {
		this.template = Templates['list-name'];
		this.model.bind('change:name', this.render, this);
		this.readonly = args.readonly;
		this.tag = '[ListNameView ' + this.model.id + ']';
	},
	
	events: {
		'dblclick .list-name-display': 'activateEdit',
		'keypress .list-name-edit': 'onEditEnter',
		'keyup .list-name-edit': 'onEditEsc'
	},
	
	render: function() {
		if (this._rendered) {
			console.warn(this.tag, 'RE-RENDER');	
			return this;
		}
		this._rendered = true;
		
		var $el = $(this.el);
		var json = this.model.toJSON();
		$el.html(this.template(json));
		this.ui = {
			edit: $el.find('.list-name-edit'),
			view: $el.find('.list-name-display')
		}
		
		return this;
	},
	
	refresh: function() {
		this.ui.view.html(this.model.get('name'));
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
		this.refresh();
		this.ui.edit.hide();
		this.ui.view.show();		
	}
});