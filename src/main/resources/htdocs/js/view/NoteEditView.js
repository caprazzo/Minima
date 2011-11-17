NoteEditView = Backbone.View.extend({
	tagName : 'textarea',
	model : Note,
	className : 'note-editor',
	editing : false,

	initialize : function(args) {
		this.model = args.model;
	},

	events : {
		'dblclick' : 'edit',
		'keyup' : 'keyup',
		'keydown' : 'keydown'
	},

	keydown : function(e) {
		if ((e.ctrlKey || e.altKey) && e.keyCode == KeyCodes.Enter) {
			this._insertNewline();
		} else if (e.keyCode == KeyCodes.Enter)
			this.save();
	},

	keyup : function(e) {
		if (e.keyCode == KeyCodes.Esc)
			this.reset();
	},

	render : function() {
		this.ui = $(this.el);
		return this;
	},

	edit : function() {
		if (this.editing)
			return;

		this.editing = true;
		var desc = this.model.get('desc')
		this.ui.val(desc ? desc + ' ' : '');
		this.trigger('edit');
		this.ui.show().focus();
		var text = this.ui.val();

		this.ui.val(text + '\n\n');
		this.ui.expandingTextarea();
		this.ui.trigger('input');
		this._setCaretToPos(text.length);
		this.ui.focus();
	},

	_setCaretToPos : function(pos) {
		if (this.el.setSelectionRange) {
			this.el.setSelectionRange(pos, pos);
			this.el.focus();
		} else if (this.el.createTextRange) {
			var range = this.el.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	},

	_getCaretPosition : function() {
		var pos = 0;

		// IE Support
		if (document.selection) {
			this.el.focus();

			// To get cursor position, get empty selection range
			var sel = document.selection.createRange();

			// Move selection start to 0 position
			sel.moveStart('character', this.el.val().length);

			// The caret position is selection length
			pos = sel.text.length;
		}

		// Firefox support
		else if (this.el.selectionStart || this.el.selectionStart == '0')
			pos = this.el.selectionStart;

		return pos;
	},
	
	_insertNewLine: function() {
		var text = this.ui.val();
		var pos = this._getCaretPosition();
		var left = text.substring(0, pos);
		var right = text.substring(pos);
		this.ui.val(left + '\n' + right);
		this._setCaretToPos(pos + 1);
		this.ui.trigger('input');
	},

	save : function() {
		var view = this;
		var text = $.trim(this.ui.val());
		if (text) {
			this.model.set({
				desc : text
			});
			if (!this.model.isNew())
				this.model.save({}, {
					success : function(model, response) {
						view.trigger("save_success");
					},
					error : function(model, response) {
						console.warn("Save of model failed", model, response);
						view.trigger("save_error");
					}
				});
		}
		this.reset();
	},

	reset : function() {
		this.editing = false;
		this.ui.val('');
		this.ui.expandingTextarea('destroy').hide();
		this.trigger('reset');
	}
});