function ViewList(parentView, listModel) {
	this.parentView = parentView;
	this.listVm = listModel;
	this.viewId = ViewList.viewId(listModel.getId());
	this.tag = '[ViewList:' + this.viewId +']';
	this.ui = {
		root: null,
		header: null,
		title: null,
		ul: null,
		textarea: null,
		addBtn: null,
		stories: {}
	};
	
	this.stories = {};
	this.refresh();
}

ViewList.viewId = function(model_id) {
	return 'ViewList-' + model_id;
}

ViewList.prototype.log = function() {
	Minima.log(this.tag, arguments);
}

ViewList.prototype.getViewId = function() {
	return this.viewId;
}

ViewList.prototype.setStory = function(storyModel) {
	this.log('setStory', storyModel);
	var viewId = ViewStory.viewId(storyModel.getId());
	var storyView = this.stories[viewId];
	if (!storyView) {
		storyView = new ViewStory(this, storyModel);
		this.stories[storyView.getViewId()] = storyView;
	}
	else {		
		storyView.updateModel(storyModel);
	}
}

ViewList.prototype.removeStoryView = function(story_view_id) {
	var view = this.stories[story_view_id]; 
	if (view)
		delete this.stories[story_view_id];
	
	var htmlRoot = this.ui.stories[story_view_id];
	if (htmlRoot) {
		delete this.ui.stories[story_view_id];
		htmlRoot.remove();
	}
}

ViewList.prototype.updateModel = function(model) {
	var diff = this.listVm.diff(model);
	if (diff['name']) {
		this.updateName(model.getName());
	}
	this.model = model;
}

ViewList.prototype.updateName = function(name) {
	this.ui.title.html(name);
}

ViewList.prototype.refresh = function() {
	this.log('refresh');
	if (this.ui.root == null) {
		this._createStructure();
		this._setupUi();
	}
	this.ui.title.html(this.listVm.getName());
	this._refreshStories();
}

ViewList.prototype._refreshStories = function() {
	this.log('refreshStories', this.listVm.getStories());
	var view = this;
	$.each(this.listVm.getStories(), function(idx, storyVm) {
		var storyView = view.ui.stories[storyVm.getId()];
		if (!storyView) {
			storyView = new ViewStory(view, storyVm);
			view.ui.stories[storyVm.getId()] = storyView;
		}
		storyView.refresh();
	});
}

ViewList.prototype._createStructure = function() {
	this.ui.root = $('<div class="list-wrapper"></div>');
	
	this.ui.header = $('<div class="list-header"></div>')
		.appendTo(this.ui.root);
	
	this.ui.title = $('<h2></h2>')
		.appendTo(this.ui.header);
	
	this.ui.ul = $('<ul class="ui-list"></ul>')
		.appendTo(this.ui.root);
	
	this.ui.footer = $('<div class="list-footer"></div>')
		.appendTo(this.ui.root);
	
	this.ui.textarea = $('<textarea></textarea>')
		.appendTo(this.ui.footer);
	
	this.ui.addBtn = $('<button>add card</button>')
		.appendTo(this.ui.footer);
	
	this.parentView.addChildView(this);
}

ViewList.prototype.getStoryView = function(story_view_id) {
	return this.stories[story_view_id];
}

// process item dragged into this list from other list
ViewList.prototype._handleReceiveItem = function(htmlItem) {
	this.log('receive item', htmlItem);
	// destroy the item, it will be recreated anew
	
	var viewId = Minima.getViewId(htmlItem);
	var storyView = this.parentView.findStoryView(viewId);
	var storyModel = storyView.getModel();
	var listView = storyView.getParentView();
	
	this.log('moving story', storyModel, 'from', listView.getViewId(), 'to', this.getViewId());
	
	// find previous model in ui, if any
	var prev = htmlItem.prev();
	prevView = (prev.length) 
			? this.getStoryView(Minima.getViewId(prev)) 
			: null;
	prevModel = (prevView) ? prevView.getModel() : null;
	
	// find next model in ui, if any
	var next = htmlItem.next();
	nextView = (next.length) 
		? this.getStoryView(Minima.getViewId(next)) 
		: null;
	nextModel = (nextView) ? nextView.getModel() : null;
		
	storyModel.reposition(prevModel, nextModel);
	
	// update the model and set it to this list	
	storyView.getParentView().removeStoryView(storyView.getViewId());
	
	storyModel.setListId(this.listVm.getId());
	Minima.fireUpdateStory(storyModel);
	this.setStory(storyModel);
}

ViewList.prototype._handleRemoveItem = function(htmlItem) {
	this.log('remove item', htmlItem);
	var viewId = Minima.getViewId(htmlItem);
	// var storyView = this.getStoryView(viewId);
	// this.removeStoryView(viewId);
}

ViewList.prototype._handleSortItem = function(htmlItem) {
	this.log('sort item', htmlItem);
}

ViewList.prototype._setupUi = function() {
	var view = this;
	this.ui.ul.attr('id', 'list-' + this.listVm.getId())
		.sortable({
			placeholder: "ui-state-highlight", 
			connectWith:'.ui-list',
			receive: function(event, ui) {
				view._handleReceiveItem(ui.item);
			},
			remove: function(event, ui) {
				view._handleRemoveItem(ui.item);
			},
			update: function(event, ui) {
				// note: this is triggered also after receive
				// in the receiving view
				view._handleSortItem(ui.item);
			}			
		});
	
	this.ui.textarea.hide().keypress(function(e) {
		if (e.keyCode == 13) {
			view._txtStoryEnter();
		}
	});
	
	this.ui.addBtn
		.button()
		.click(function() {
			view._btnAddClick();
		})
		.keypress(function() {
			view._btnAddClick();
		});
}

ViewList.prototype.getChildRoot = function(childView) {
	this.log('createChildView', childView);
	var childModel = childView.getModel();
	var childRoot = this.ui.stories[childView.getViewId()];
	if (childRoot == null) {
		var childRoot = $('<li></li>');
		var rel_pos = childModel.getPos();
		var ui = this.ui;
		var inserted = false;
		
		// if this model has lower relative position
		// than an existing story, create its root in
		// the correct position
		$.each(this.stories, function(key, otherView) {
			var otherModel = otherView.getModel();
			if (childModel.isBefore(otherModel)) {
				var otherRoot = ui.stories[otherView.getViewId()];
				childRoot.insertBefore(otherRoot);
				inserted = true;
				return false;
			}
		});
		
		if (!inserted)
			this.ui.ul.append(childRoot);
		
		this.ui.stories[childView.getViewId()] = childRoot;
	}
	return childRoot;
}

ViewList.prototype.updateChildPosition = function(childView, newPos) {
	var childModel = childView.getModel();
	var childRoot = this.ui.stories[childView.getViewId()];
	childRoot.remove();
	var ui = this.ui;
	var inserted = false;
	$.each(this.stories, function(key, otherView) {
		var other = otherView.getModel();
		
		if (childView.getViewId() == otherView.getViewId())
			return;
		
		if (newPos < other.getPos()) {
			var otherRoot = ui.stories[otherView.getViewId()];
			childRoot.insertBefore(otherRoot);
			inserted = true;
			return false;
		}
	});
	if (!inserted)
		this.ui.ul.append(childRoot);
}

ViewList.prototype._btnAddClick = function() {
	this.log('click add button');
	this.ui.addBtn.button('disable').hide();
	this.ui.textarea.show().focus();
}

ViewList.prototype._resetEnterUi = function() {
	this.ui.addBtn.button('enable').show().focus();
	this.ui.textarea.hide();
	this.ui.textarea.val('');
}

ViewList.prototype._txtStoryEnter = function() {
	this.log('story text enter');
	var text = $.trim(this.ui.textarea.val());	
	if (text) {
		this._createStory(text);
	}
	this._resetEnterUi();
}

ViewList.prototype._createStory = function(text) {
	this.log('add story', text);
	var max_pos = -1;
	$.each(this.stories, function(key, val) {
		var pos = val.getModel().getPos();
		if (pos > max_pos)
			max_pos = pos;
	});
	var pos = max_pos + 65536;
	var storyModel = ModelStory.newStory(this.listVm.getId(), text, pos);
	this.setStory(storyModel);
	Minima.fireCreateStory(storyModel);
}

ViewList.prototype.getRoot = function() {
	return this.ui.root;
}