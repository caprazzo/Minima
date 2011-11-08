NoteView = Backbone.View.extend({
	tagName: 'li',
	model: Note,
	className: 'note-container',
	_isDragging: false,
	
	initialize: function(args) {
		this.template = Templates['note-template'];	
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
		json.obj.desc = this._filter(json.obj.desc);
		el.html(this.template(json));
		this.ui = {
			el: el,
			archive: el.find('.note-archive-btn').hide(),
			view: el.find('.note-view'),
			edit: el.find('.note-edit'),
			textarea: el.find('.note-textarea')
		}		
		if (this.readonly)
			this.ui.el.addClass('note-container-readonly');
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
	
	_filter: function(text) {
		var parts = text.split(/\s+/);
		var filters = [this._mailFilter, this._atFilter, this._hashFilter, this._linkFilter];
		return _.map(parts, function(part, idx) {
			var rt = null;
			var found = _.any(filters, function(filter) {
				var filtered = filter(part);
				if (filtered != null) {
					rt = filtered;
					return true;
				}				
			});
			return found ? rt : part;
		}).join(' ');
	},
	
	_mailFilter: function(text) {
		if (text.indexOf('mailto:') == 0)
			return '<a href="' + text + '">'+text+'</a>';
		if (text.match(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/))
			return '<a href="mailto:' + text + '">'+text+'</a>';
		return null;
	},
	
	_linkFilter: function(text) {
		var p1 = /^\s*(http[s]?:\/\/(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1})\s*$/gi;
		var text = text.replace(p1, '<a href="$1">$1</a>');
		
		var p2 = /^\s*((www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1})\s*$/gi;
		return text.replace(p2, '<a href="http://$1">$1</a>');
	},
	
	_atFilter: function(text) {
		var pattern = /(@\b[^\s]*)/gi;
		var repl = text.replace(pattern, '<span class="ui-tag ui-tag-at">$1</span>');
		return (repl != text) ? repl : null;
	},

	_hashFilter: function(text) {
		var pattern = /(#\b[^\s]*)/gi;
		var repl = text.replace(pattern, '<span class="ui-tag ui-tag-hash">$1</span>');
		return (repl != text) ? repl : null;
	}
});