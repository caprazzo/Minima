function ViewBoard(options) {
	this.ui = { 
		parent: $(options.content_matcher),
		root: null
	};
	this.lists = {};
	this.refresh();
}

ViewBoard.prototype.refresh = function() {
	if (this.ui.root == null) {
		this._createStructure();
	}
}

ViewBoard.prototype.setList = function(listModel) {
	var viewId = ViewList.viewId(listModel.getId());
	var listView = this.lists[viewId];
	
	if (!listView) {
		listView = new ViewList(this, listModel);
		this.lists[listView.getViewId()] = listView;
	}
	else {
		listView.updateModel(listModel);
	}
}

ViewBoard.prototype.setStory = function(storyModel) {
	var storyViewId = ViewStory.viewId(storyModel.getId());
	var listViewId = ViewList.viewId(storyModel.getListId());
	var targetList = this.getList(listViewId);
	
	var existingStoryView = this.findStoryView(storyViewId);
	if (existingStoryView && existingStoryView.getParentView().getViewId() != targetList.getViewId()) {
		existingStoryView
			.getParentView()
			.removeStoryView(storyViewId);
	}
	targetList.setStory(storyModel);
}

ViewBoard.prototype.getList = function(list_id) {
	return this.lists[list_id];
}

ViewBoard.prototype.findStoryView = function(story_view_id) {
	var found = null;
	$.each(this.lists, function(list_id, listView) {
		var storyView = listView.getStoryView(story_view_id);
		if (storyView) {
			found = storyView;
			return false;
		}
	});
	return found;
}

ViewBoard.prototype._createStructure = function() {
	this.ui.root = $('<div id="board"></div>')
		.appendTo(this.ui.parent);
}

ViewBoard.prototype.addChildView = function(viewObject) {
	this.ui.root.append(viewObject.getRoot());
}