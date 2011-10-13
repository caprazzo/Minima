function MinimaView(options) {
	this.els = {
		content: {
			matcher: options.content_matcher,
			el: null
		},
		lists: {
			
		}
	};
	
	this.listViews = {};
	
	this.onCreateStoryHandler = null;
	this.onUpdateStoryPositionHandler = null;	
}

MinimaView.prototype.init = function() {
	this.els.content.el = $(this.els.content.matcher);
	console.log("[View] initialized", this.els);
}

MinimaView.prototype.setBoardVm = function(boardVm) {
	this.boardVm = boardVm;
	this.boardVm.onUpdate(function(boardVm) {
		console.log('[View] bardVm.on.update');
		this.refreshView();
	}, this);
}

MinimaView.prototype.refreshView = function() {
	console.log('[View] refreshView', this.boardVm.getLists());
	if (this.boardUi == null) {
		this.createBoardUi();
	}
	this.els.boardTitle.el.html(this.boardVm.getName());
	
	var view = this;
	// create or refresh all
	var listVms = this.boardVm.getLists();
	$.each(listVms, function(idx, listVm) {
		var listView = view.listViews[listVm.getId()];
		if (!listView) {
			listView = new ViewList(view, listVm);
			view.listViews[listVm.getId()] = listView;
		}
		listView.refresh();
	});
}

MinimaView.prototype.createBoardUi = function() {
	console.log('[View] createBoardUi');
	var boardEl = $('<div id="board"></div>').appendTo(this.els.content.el);
	this.els.boardTitle = {el: $('<h1></h1>').appendTo(boardEl) };
	this.boardUi = boardEl;
}

MinimaView.prototype.renderBoard = function(board) {
	console.log('[View] renderBoard', board);
	this.renderLists(board.lists);
	
	var view = this;
	$.each(board.lists_stories, function(key, stories) {
		view.renderStories(stories);	
	});
	
}

MinimaView.prototype.renderLists = function(lists) {
	console.log('[View] renderLists', lists);
	
	var that = this;
	// create ui for each list
	$.each(lists, function(idx, list) {
		that._createListView(list);
	});
}

MinimaView.prototype.createChildView = function(childView) {
	console.log('[View] updateChildView', childView);
	this.boardUi.append(childView.getRoot());
}

MinimaView.prototype._createListUi = function(list) {
	console.log('[View] create list view', list);
	var view = this;
	var wrapper = $('<div class="list-wrapper"></div>');
	var header = $('<div class="list-header"></div>').html(list.name);
	
	
	this.els.content.el.append(wrapper);
	
	this.els.lists[list.id] = {
		wrapper: { el: wrapper },
		ul: { el: ul },
		addBtn: { el: addBtn },
		textarea: { el: textarea }
	};
} 


MinimaView.prototype.onCreateStory = function(handler, ctx) {
	this.onCreateStoryHandler = {fn:handler, ctx:ctx};
}

MinimaView.prototype.fireCreateStory = function(list_id, text, successFn) {
	var handler = this.onCreateStoryHandler;
	handler.fn.call(handler.ctx, list_id, text, successFn);
}

MinimaView.prototype.onUpdateStoryPosition = function(handler, ctx) {
	this.onUpdateStoryPositionHandler = {fn: handler, ctx:ctx};
}

MinimaView.prototype.fireUpdateStoryPosition = function(list_id, story_id, new_pos) {
	var handler = this.onUpdateStoryPositionHandler;
	handler.fn.call(handler.ctx, list_id, story_id, new_pos, function() {
		console.log('[View] fireUpdateStoryPosition.success');
	});
}

MinimaView.prototype.addStory = function(story) {
	console.log('[View] add story', story);
	this._createStoryView(story);
}

MinimaView.prototype._createStoryView = function(story) {
	console.log('[View] create story view', story);
	var listUi = this.els.lists[story.list];
	var storyUi = $('<li></li>').html(story.desc).attr('id', 'story-' + story.id);
	listUi.ul.el.append(storyUi);
	storyUi.data('story_id', story.id);
}

MinimaView.prototype.renderStories = function(stories) {
	console.log('[View] renderStories', stories);
	// stories are already sorted
	var view = this;
	$.each(stories, function(idx, story) {
		view._createStoryView(story);
	});
} 
