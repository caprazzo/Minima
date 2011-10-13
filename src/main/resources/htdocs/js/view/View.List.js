function ViewList(parentView, listModel) {
	this.parentView = parentView;
	this.listVm = listModel;
	this.ui = {
		root: null,
		header: null,
		ul: null,
		textarea: null,
		addBtn: null,
		stories: {}
	};
	
	this.stories = {};
	
	this.refresh();
	
	// this.listVm.onUpdate(function() {
	//	console.log('[ViewList] listVm.update');
	//	this.refresh();
	// }, this);
}

ViewList.prototype.setStory = function(storyModel) {
	var storyView = this.stories[storyModel.getId()];
	if (!storyView) {
		storyView = new ViewStory(this, storyModel);
		this.stories[storyModel.getId()] = storyView;
	}
	else {
		storyView.updateModel(storyModel);
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
	this.ui.header.html(name);
}

ViewList.prototype.refresh = function() {
	console.log('[ViewList] refresh ', this.listVm.getId());
	if (this.ui.root == null) {
		this._createStructure();
		this._setupUi();
	}
	this.ui.header.html(this.listVm.getName());
	this._refreshStories();
}

ViewList.prototype._refreshStories = function() {
	console.log('[ViewList] refreshStories', this.listVm.getId(), this.listVm.getStories());
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

ViewList.prototype._setupUi = function() {
	var view = this;
	this.ui.ul.attr('id', 'list-' + this.listVm.getId())
		.data('list.id', this.listVm.getId())
		.sortable({
			placeholder: "ui-state-highlight", 
			connectWith:'.ui-list',
			update: function(event, ui) {
				var list_id = $(event.target).data('list.id');
				var story_id = $(event.srcElement).data('story_id');
				var new_abs_pos = ui.item.index();
				console.log('[View] updated story order', list_id, story_id, new_abs_pos);
				view.fireUpdateStoryPosition(list_id, story_id, new_abs_pos);
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
	console.log('[ViewList] createChildView', childView);
	var childModel = childView.getModel();
	var childRoot = this.ui.stories[childModel.getId()];
	if (childRoot == null) {
		var childRoot = $('<li></li>');
		var rel_pos = childModel.getPos();
		var ui = this.ui;
		var inserted = false;
		
		// if this model has lower relative position
		// than an existing story, create its root in
		// the correct position
		$.each(this.stories, function(key, val) {
			var other = val.getModel();
			if (childModel.isBefore(other)) {
				var otherRoot = ui.stories[other.getId()];
				childRoot.insertBefore(otherRoot);
				inserted = true;
			}
		});
		
		if (!inserted)
			this.ui.ul.append(childRoot);
		
		this.ui.stories[childModel.getId()] = childRoot;
	}
	return childRoot;
}

ViewList.prototype.updateChildPosition = function(childView, newPos) {
	throw 'not implemented';
}

ViewList.prototype._btnAddClick = function() {
	console.log('[ViewList] click add button', this.listVm.getId());
	this.ui.addBtn.button('disable').hide();
	this.ui.textarea.show().focus();
}

ViewList.prototype._resetEnterUi = function() {
	this.ui.addBtn.button('enable').show().focus();
	this.ui.textarea.hide();
	this.ui.textarea.val('');
}

ViewList.prototype._txtStoryEnter = function() {
	console.log('[ViewList] story text enter');
	var text = $.trim(this.ui.textarea.val());	
	if (text) {
		this.listVm.createStory(text);
	}
	this._resetEnterUi();
}

ViewList.prototype.getRoot = function() {
	return this.ui.root;
}