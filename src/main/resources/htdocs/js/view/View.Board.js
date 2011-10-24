function ViewBoard(options) {
	this.ui = { 
		parent: $(options.content_matcher),
		root: null,
		lists: {}
	};
	this.lists = {};
	this.refresh();
	this.listWidth = 250;
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
		listView.resize(this.listWidth);
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

ViewBoard.prototype.getChildRoot = function(childView) {
	var childModel = childView.getModel();
	var childRoot = this.ui.lists[childView.getViewId()];
	if (childRoot == null) {
		var childRoot = $('<div class="ui-board-list-root"></div>');
		this.ui.lists[childView.getViewId()] = childRoot;
		this.ui.root.append(childRoot);
	}
	return childRoot;
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

ViewBoard.prototype.resize = function(width) {
	var newWidth = width - 45;
	
	var maxListSize = 330;
	var minListSize = 210;
	var cutoffBoardSize = minListSize * 3;
	var varticalBoradSize = minListSize;
	if (newWidth < cutoffBoardSize) {
		newWidth = maxListSize;
		calcSize = maxListSize;
	}		
	else {
		var calcSize =  (newWidth)/3;
		if (calcSize > maxListSize)
			calcSize = maxListSize;
		if (calcSize < minListSize)
			calcSize = minListSize;
	}
	
	this.ui.root.width(newWidth);
	this.listWidth = calcSize;
	
	$.each(this.lists, function(list_id, listView) {		
		listView.resize(calcSize);
	});
	
}