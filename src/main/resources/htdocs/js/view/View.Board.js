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
	var listView = this.lists[listModel.getId()];
	if (!listView) {
		listView = new ViewList(this, listModel);
		this.lists[listModel.getId()] = listView;
	}
	else {
		listView.updateModel(listModel);
	}
}

ViewBoard.prototype.getList = function(list_id) {
	return this.lists[list_id];
}

ViewBoard.prototype.findStoryView = function(story_id) {
	var found = null;
	$.each(this.lists, function(list_id, listView) {
		var storyView = listView.getStoryView(story_id);
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