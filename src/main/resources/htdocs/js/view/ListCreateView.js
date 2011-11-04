ListCreateView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-create-container',
	
	events: {
		'mouseenter .list-add-note-btn': 'toggleBtnHighlight',
		'mouseleave .list-add-note-btn': 'toggleBtnHighlight',
		'click .list-add-note-btn': 'activateTextarea',
		'keypress .list-add-note-textarea': 'onTextEnter',
		'keyup .list-add-note-textarea': 'onTextEsc',
	},
	
	initialize: function(args) {
		this.notes = args.notes;
		this.template = _.template($('#list-create-template').html());
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template(this.model.toJSON()));
		this.ui = {
			el: el,
			btn: el.find('.list-add-note-btn'),
			text: el.find('.list-add-note-textarea')
		}
		return this;
	},
	
	toggleBtnHighlight: function() {
		this.ui.btn.toggleClass('list-add-note-btn-hover');
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