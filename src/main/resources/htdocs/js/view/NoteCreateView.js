NoteCreateView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'note-create-container',
	
	events: {
		'mouseenter .note-create-btn': 'toggleBtnHighlight',
		'mouseleave .note-create-btn': 'toggleBtnHighlight',
		'click .note-create-btn': 'activateTextarea',
		'keypress .note-create-btn': 'activateTextarea',
		'keypress .note-create-textarea': 'onTextEnter',
		'keyup .note-create-textarea': 'onTextEsc',
	},
	
	initialize: function(args) {
		this.notes = args.notes;
		this.template = Templates['note-create-template'];
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template(this.model.toJSON()));
		this.ui = {
			el: el,
			btn: el.find('.note-create-btn'),
			text: el.find('.note-create-textarea')
		}
		return this;
	},
	
	toggleBtnHighlight: function() {
		this.ui.btn.toggleClass('note-create-btn-hover');
	},
	
	activateTextarea: function() {
		this.ui.text.show().focus();
		this.ui.btn.hide();
	},
	
	onTextEnter: function(e) {
		if (e.keyCode == 13) this.create();
	},
	
	onTextEsc: function(e) {
		if (e.keyCode == 27) this.render();
	},
	
	create: function() {
		var text = $.trim(this.ui.text.val());
		if (!text) {
			this.render();
			return;	
		}
		var that = this;
		var lastNote = _(this.notes.filter(function(note) {
			return !note.get('archived') && note.get('list') == that.model.id;
		})).last();
		
		var pos = (lastNote) ? lastNote.get('pos') : 0;
		
		this.render();
		
		var note = new Note({
			id: Minima.makeId(),
			revision: 0,
			desc: text,
			list: this.model.id,
			pos: pos + 65536
		});
		
		this.trigger('create', note);
	}
	
});