NoteView = Backbone.View.extend({
	tagName: 'li',
	model: Note,
	className: 'note-container',
	_isDragging: false,
	
	initialize: function(args) {
		this.template = _.template($('#note-template').html());	
		this.readonly = args.readonly;
		this.model.bind('change', this.render, this);
	},
	
	events: {
		'mouseenter': 'showArchive',
		'mouseleave': 'hideArchive',
		'dblclick': 'activateEdit',
		'keypress .note-textarea': 'onEditEnter',
		'keyup .note-textarea': 'onEditEsc',
		'click .note-archive-btn': 'archiveNote'
	},
	
	render: function() {
		var el = $(this.el);	
		el.attr('id', 'note-'+ this.model.id);
		var json = this.model.toJSON();
		json.obj.desc = this._hashFilter(this._atFilter(json.obj.desc));
		el.html(this.template(json));
		this.ui = {
			el: el,
			archive: el.find('.note-archive-btn').hide(),
			view: el.find('.note-view'),
			edit: el.find('.note-edit'),
			textarea: el.find('.note-textarea')
		}		
		this._rendered = true;
		return this;
	},
	
	startDrag: function() {
		this._isDragging = true;
		this.ui.archive.hide();
	},
	
	remove: function() {
		$(this.el).remove();
	},
	
	stopDrag: function() {
		this._isDragging = false;
	},
	
	archiveNote: function() {
		this.model.set({archived: true});
		this.remove();
		this.model.save();
	},
	
	showArchive: function() {
		if (this._isDragging || this.readonly) return;		
		var pos = this.ui.el.offset();
		var width = this.ui.el.width();
		this.ui.archive.css({
			left: (pos.left - 25 + width) + 'px',
			top: pos.top + 'px'
		}).show();
	},
	
	activateEdit: function() {
		if (this.readonly)
			return;
		this.ui.view.hide();		
		this.ui.edit.show();
		this.ui.textarea.val(this.model.get('desc')).focus();
	},
	
	onEditEnter: function(e) {
		if (e.keyCode == 13) this.save();
	},
	
	onEditEsc: function(e) {
		if (e.keyCode == 27) this.render();
	},
	
	hideArchive: function() {
		this.ui.archive.hide();
	},
	
	save: function() {
		var text = $.trim(this.ui.textarea.val());
		if (text.length == 0)
			return;
		this.model.set({ desc: text });
		this.model.save();
		this.render();
	},
	
	_atFilter: function(text) {
		var pattern = /(@\b[\w]*)/gi;
		return text.replace(pattern, '<span class="ui-tag ui-tag-at">$1</span>');
	},

	_hashFilter: function(text) {
		var pattern = /(#\b[\w]*)/gi;
		return text.replace(pattern, '<span class="ui-tag ui-tag-hash">$1</span>');
	}
});