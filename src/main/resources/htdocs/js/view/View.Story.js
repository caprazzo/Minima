function ViewStory(parentView, storyVm) {
	console.log('[ViewStory] new ViewStory', storyVm);
	this.parentView = parentView;
	this.storyVm = storyVm;
	this.ui = {
		parent: null,
		root: null
	};
	this.refresh();
}

ViewStory.prototype.getModel = function() {
	return this.storyVm;
}

ViewStory.prototype.refresh = function() {
	console.log('[ViewStory] refresh', this.storyVm.getId());
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
	this.model = model;
}

ViewStory.prototype._createStructure = function() {
	this.ui.parent = this.parentView.getChildRoot(this);
	this.ui.root = $('<div></div>')
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