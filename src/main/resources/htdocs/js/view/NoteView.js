NoteView = Backbone.View.extend({
	tagName: 'li',
	model: Note,
	className: 'note-container',
	_isDragging: false,
	
	initialize: function(args) {
		this.template = Templates['note'];	
		this.readonly = args.readonly;
		this.model.bind('change:desc', this.refresh, this);
	},
	
	events: {
		'dblclick': 'activateEdit',
		'click .note-archive-btn': 'archiveNote'
	},
	
	refresh: function() {
		var json = this.model.toJSON();
		var desc = this._filter(json.desc);
		this.ui.text.html('  ').html(desc);
		console.log(this.ui.text.html())
	},
	
	render: function() {
		this._rendered = true;
		
		var el = $(this.el);	
		el.attr('id', 'note-'+ this.model.id);
		var json = this.model.toJSON();
		json.desc = this._filter(json.desc);
		el.html(this.template(json));
		
		this.ui = {
			el: el,
			archive: el.find('.note-archive-btn').hide(),
			view: el.find('.note-view'),
			edit: el.find('.note-edit'),
			text: el.find('.note-text'),
			alert: el.find('.note-save-alert')
		}
		
		if (this.readonly)
			this.ui.el.addClass('note-container-readonly');
		
		var view = this;
		this.ui.el.hover(
			function() { view.showArchive() },
			function() { view.hideArchive() }
		);
		
		return this;
	},
	
	startDrag: function() {
		this._isDragging = true;
		this.ui.archive.hide();
	},
	
	stopDrag: function() {
		this._isDragging = false;
	},
	
	remove: function() {
		$(this.el).remove();
	},
	
	archiveNote: function() {
		this.model.set();
		this.remove();
		this.model.save({archived: true}, {
			success: function(note) {
				Minima.trigger('archive-note', note);
			}
		});		
	},
	
	activateEdit: function() {
		if (this.readonly)
			return;
		
		if (!this.noteEditView)
			this.createEditView();
		
		this.noteEditView.edit();
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
	
	createEditView: function() {
		this.noteEditView = new NoteEditView({model: this.model});
		
		this.noteEditView.bind('reset', function() {
			this.ui.view.show();		
		}, this);
		
		this.noteEditView.bind('edit', function() {
			this.ui.view.hide();
		}, this);
		
		this.noteEditView.bind("save_error", function() {
			this.showSaveFailed();
		}, this);	
		
		this.noteEditView.bind("save_success", function() {
			this.hideSaveFailed();
		}, this);
		
		this.ui.edit.append(this.noteEditView.render().el);
	},
	
	hideArchive: function() {
		this.ui.archive.hide();
	},
	
	showSaveFailed: function() {
		this.ui.alert.fadeIn();
	},
	
	hideSaveFailed: function() {
		this.ui.alert.fadeOut();
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
		var p1 = /([-a-zA-Z0-9@:%_\+.~#?&/\/\=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)/;
		var reg = new RegExp(p1);
		var match = reg.exec(text)
		if (match != null) {	
			var hasProtocol = match[0].indexOf('://') == -1;
			var repl =  hasProtocol ? 'http://' + match[0] : match[0];
			return '<a target="_blank" href="' + repl + '">' + text + '</a>';
		}
		return text;
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