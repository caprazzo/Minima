NoteEditView = Backbone.View.extend({
	tagName: 'textarea',
	model: Note,
	className: 'note-editor',
	editing: false,
	
	initialize: function(args) {
		this.model = args.model;
	},
	
	events: {
		'dblclick': 'edit',
		'keyup': 'keyup',
		'keydown': 'keydown'
	},
	
	keydown: function(e) {
		if ((e.ctrlKey || e.altKey) && e.keyCode == KeyCodes.Enter) { 
			this.ui.val(this.ui.val() + "\n");
			return;
		}
		else if (e.keyCode == KeyCodes.Enter) 
			this.save();
	},
	
	keyup: function(e) {
		if (e.keyCode == KeyCodes.Esc)
			this.reset();
	},
	
	render: function() {
		this.ui = $(this.el).hide();
		return this;
	},
	
	edit: function() {
		if (this.editing)
			return;
		this.editing = true;
		this.ui.val(this.model.get('desc') + ' ');
		this.trigger('edit');
		this.ui.show().focus();
		this._setCaretToEnd();
	},
	
	_setCaretToEnd: function() {
		var text = this.ui.val();
		if (this.el.setSelectionRange) {			
			this.el.setSelectionRange(text.length, text.length);
			this.el.focus();
		}
		else if (this.el.createTextRange) {
			var range = this.el.createTextRange();
			range.collapse(true);
			range.moveEnd('character', text.length);
			range.moveStart('character', text.length);
			range.select();
		}
	},
	
	save: function() {
		var view = this;
		var text = $.trim(this.ui.val());
		if (text) {
			this.model.set({desc: text});
			if (!this.model.isNew())
				this.model.save({}, {
					success: function(model, response) {
						view.trigger("save_success");
					},
					error: function(model, response) {
						console.warn("Save of model failed", model, response);
						view.trigger("save_error");
					}
				});
		}		
		this.reset();
	},
	
	reset: function() {
		this.editing = false;
		this.ui.val('');
		this.ui.hide();
		this.trigger('reset');
	}
});