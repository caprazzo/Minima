function ViewStory(parentView, storyVm) {
	this.viewId = ViewStory.viewId(storyVm.getId());
	this.tag = '['+this.viewId+']';
	this.parentView = parentView;
	console.log(this.tag, 'new ViewStory', storyVm, this.parentView);
	
	this.storyVm = storyVm;
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
	}
	this.ui.root.html(this.storyVm.getDesc());
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
	this.ui.root = $('<div></div>')
		.attr('id', this.getViewId())
		.appendTo(this.ui.parent);
}

ViewStory.prototype.getRoot = function() {
	return this.ui.root;
}

ViewStory.prototype.updateDesc = function(desc) {
	this.ui.root.html(desc);
}

ViewStory.prototype.updatePosition = function(pos) {
	this.parentView.updateChildPosition(this, pos);
}