function ViewStory(parentView, storyVm, readonly) {
	this.viewId = ViewStory.viewId(storyVm.getId());
	this.tag = '['+this.viewId+']';
	this.parentView = parentView;
	console.log(this.tag, 'new ViewStory', storyVm, this.parentView);
	
	this.storyVm = storyVm;
	this.readonly = readonly;
	this.ui = {
		parent: null,
		root: null
	};
	this.refresh();
}

// static method to build a view id from a model id
ViewStory.viewId = function(model_id) {
	return 'ViewStory-' + model_id;
}

ViewStory.prototype.getViewId = function() {
	return this.viewId;
}

ViewStory.prototype.getParentView = function() {
	return this.parentView;
}

ViewStory.prototype.getModel = function() {
	return this.storyVm;
}

ViewStory.prototype.refresh = function() {
	console.log(this.tag, 'refresh', this.storyVm.getId());
	if (this.ui.parent == null) {
		this._createStructure();
		this._setupUi();
	}
	this.updateDesc(this.storyVm.getDesc());
}

ViewStory.prototype.updateModel = function(model) {
	var diff = this.storyVm.diff(model);
	if (diff['desc']) {
		this.updateDesc(model.getDesc());
	}
	if (diff['pos']) {
		this.updatePosition(model.getPos());
	}
	this.storyVm = model;
}

ViewStory.prototype._createStructure = function() {
	this.ui.parent = this.parentView.getChildRoot(this);
	this.ui.root = $('<div class="ui-story"></div>')
		.attr('id', this.getViewId())
		.appendTo(this.ui.parent);
	
	this.ui.descRoot = $('<div class="ui-story-view-root ui-story-display"></div>')
		.appendTo(this.ui.root);
	
	if (!this.readonly)
	this.ui.archiveBtn = $('<span class="ui-story-archive-btn ui-icon ui-icon-trash"></span>')
		.appendTo(this.ui.descRoot);
	
	this.ui.desc = $('<div class="ui-story-desc"></div>')
		.appendTo(this.ui.descRoot);

	if (!this.readonly) {
		this.ui.editRoot = $('<div class="ui-story-edit-root ui-story-display"></div>')	
			.hide()
			.appendTo(this.ui.root);
		
		this.ui.editArea = $('<textarea class="ui-story-textarea"></textarea>')
			.appendTo(this.ui.editRoot);
	}
	
}

ViewStory.prototype._setupUi = function() {
	var view = this;
	var timeout = null;
	this.ui.descRoot.hover(		
		function() {
			// don't show the delete button if item is being dragged
			if (view.isDragging) return;
			var el = this;
			timeout = null;
			var pos = $(el).offset();
			var width = $(el).width();
			view.ui.archiveBtn
				.css({
					left: (pos.left - 11 + width) + 'px',
					top: pos.top + 'px'
				})
				.show();
		}, function() {
			view.ui.archiveBtn.hide();
		});
	
	if (this.readonly)
		return;
	
	this.ui.archiveBtn		
		.click(function() {
			view._handleArchiveSory();
		})
		.hide();
	
	this.ui.descRoot.dblclick(function() {
		view.ui.descRoot.hide();
		view.ui.editRoot.show();
		view.ui.editArea.focus();
		view.ui.editArea.val(view.storyVm.getDesc());		
	});
	
	this.ui.editArea
		.keypress(function(e) {
			if (e.keyCode == 13) {
				view._txtStoryEdit();
			}
		}).keyup(function(e) {
			if (e.keyCode == 27) {
				view._resetEditUi();
			} 
		});
}

ViewStory.prototype.startDrag = function() {
	this.isDragging = true;
	this.ui.archiveBtn.hide();
}

ViewStory.prototype.stopDrag = function() {
	this.isDragging = false;
}

ViewStory.prototype._txtStoryEdit = function() {
	var text = $.trim(this.ui.editArea.val());	
	if (text) {
		this._editStoryDesc(text);
	}
	this._resetEditUi();
}

ViewStory.prototype._resetEditUi = function() {
	this.ui.descRoot.show();
	this.ui.editRoot.hide();
	this.ui.editArea.val('');
}

ViewStory.prototype._editStoryDesc = function(desc) {
	this.storyVm.setDesc(desc);
	this.updateDesc(desc);
	Minima.fireUpdateStory(this.storyVm);
	this._resetEditUi();
}

ViewStory.prototype._handleArchiveSory = function() {
	this.storyVm.setArchived(true);
	this.parentView.removeStoryView(this.getViewId());
	Minima.fireUpdateStory(this.storyVm);
}

ViewStory.prototype._atFilter = function(text) {
	var pattern = /(@\b[\w]*)/gi;
	return text.replace(pattern, '<span class="ui-tag ui-tag-at">$1</span>');
}

ViewStory.prototype._hashFilter = function(text) {
	var pattern = /(#\b[\w]*)/gi;
	return text.replace(pattern, '<span class="ui-tag ui-tag-hash">$1</span>');
}

ViewStory.prototype.getRoot = function() {
	return this.ui.root;
}

ViewStory.prototype.updateDesc = function(desc) {
	var filtered = this._hashFilter(this._atFilter(desc));
	this.ui.desc.html(filtered);
}

ViewStory.prototype.updatePosition = function(pos) {
	this.parentView.updateChildPosition(this, pos);
}