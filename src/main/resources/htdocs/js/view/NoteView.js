NoteView = Backbone.View.extend({
	tagName: 'li',
	model: Note,
	className: 'note-container',
	_isDragging: false,
	
	initialize: function(args) {
		this.template = _.template($('#note-template').html());	
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
		el.html(this.template(this.model.toJSON()));
		this.ui = {
			el: el,
			archive: el.find('.note-archive-btn').hide(),
			view: el.find('.note-view'),
			edit: el.find('.note-edit'),
			textarea: el.find('.note-textarea')
		}		
		return this;
	},
	
	startDrag: function() {
		this._isDragging = true;
		this.ui.archive.hide();
	},
	
	stopDrag: function() {
		this._isDragging = false;
	},
	
	archiveNote: function() {
		this.model.set({archived: true});
		this.model.save();
	},
	
	showArchive: function() {
		if (this._isDragging) return;		
		var pos = this.ui.el.offset();
		var width = this.ui.el.width();
		this.ui.archive.css({
			left: (pos.left - 25 + width) + 'px',
			top: pos.top + 'px'
		}).show();
	},
	
	activateEdit: function() {
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
		this.model.set({ desc: this.ui.textarea.val() });
		this.model.save();
		this.render();
	}
});