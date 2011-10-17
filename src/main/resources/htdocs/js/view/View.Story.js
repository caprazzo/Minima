function ViewStory(parentView, storyVm, doEffect) {
	this.viewId = ViewStory.viewId(storyVm.getId());
	this.tag = '['+this.viewId+']';
	this.parentView = parentView;
	console.log(this.tag, 'new ViewStory', storyVm, this.parentView);
	
	this.storyVm = storyVm;
	this.ui = {
		parent: null,
		root: null
	};
	this.refresh(doEffect);
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
	
	this.ui.descRoot = $('<div class="ui-story-desc-root  ui-story-normal"></div>')
		.appendTo(this.ui.root);
	
	this.ui.archiveBtn = $('<span class="ui-story-archive-btn">x</span>')
		.appendTo(this.ui.descRoot);
	
	this.ui.desc = $('<div class="ui-story-desc"></div>')
		.appendTo(this.ui.descRoot);
	
	this.ui.editRoot = $('<div class="ui-story-edit-root"></div>')	
		.hide()
		.appendTo(this.ui.root);
	
	this.ui.editArea = $('<textarea class="ui-story-textarea"></textarea>')
		.appendTo(this.ui.editRoot);
	
	$('<br clear="both"/>').appendTo(this.ui.root);
}

ViewStory.prototype._setupUi = function() {
	var view = this;
	this.ui.archiveBtn
		.click(function() {
			console.log('archive btn handle');
			view._handleArchiveSory();
		});
	
	this.ui.descRoot.dblclick(function() {
		view.ui.descRoot.hide();
		view.ui.editArea.val(view.storyVm.getDesc());
		view.ui.editRoot.show();
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

ViewStory.prototype.getRoot = function() {
	return this.ui.root;
}

ViewStory.prototype.updateDesc = function(desc) {
	this.ui.desc.html(desc);
}

ViewStory.prototype.updatePosition = function(pos) {
	this.parentView.updateChildPosition(this, pos);
}