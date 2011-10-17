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
	
	this.ui.archiveBtn = $('<span class="ui-story-archive-btn">x</span>')
		.appendTo(this.ui.root);
	
	this.ui.desc = $('<div class="ui-story-desc"></div>')
		.appendTo(this.ui.root);
	
	$('<br clear="both"/>').appendTo(this.ui.root);
}

ViewStory.prototype._handleArchiveSory = function() {
	this.storyVm.setArchived(true);
	this.parentView.removeStoryView(this.getViewId());
	Minima.fireUpdateStory(this.storyVm);
}

ViewStory.prototype._setupUi = function() {
	var view = this;
	this.ui.archiveBtn
		.click(function() {
			console.log('archive btn handle');
			view._handleArchiveSory();
		});
	
	this.ui.desc.editable(function(value, settings) {
		console.log(value);
		if (view.storyVm.getDesc() != value) {
			view.storyVm.setDesc(value);
			Minima.fireUpdateStory(view.storyVm);
		}
		return value;
	}, {
		type: 'textarea',
		submit: 'OK'
	});
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