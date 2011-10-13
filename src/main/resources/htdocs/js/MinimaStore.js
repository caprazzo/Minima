function MinimaStore() {
	this.onBoardHandler = null;
	this.onCreateStoryHandler = null;
	this.onSyncStoryHandler = null;
	this.board = new ModelBoard();
}	

MinimaStore.prototype.receiveBoard = function(board_json) {
	console.log('[Store] receiveBoard', board_json);
	this.board = ModelBoard.fromJson(board_json);
	this.fireOnBoard(this.board);
}

MinimaStore.prototype.updateStory = function(story) {
	console.log('[Store] updateStory', story);
	this.board.stories[story.id] = story;
}

MinimaStore.prototype.addNewStory = function(story) {
	console.log('[Store] add new story', story);
	
}

MinimaStore.prototype.receiveStory = function(story) {
	console.log('[Store] receiveStory', story);
		
	// is story already in store?
	var found = this.board.stories[story.id];
	if (found) {
		this.updateStory(story);
	}
	else {
		// new story received
	}
	
	// is this a story I've just created?
}

// poor man's unique id
MinimaStore.prototype.makeId = function() {
	return 'story' + new Date().getTime();
}

MinimaStore.prototype.createStory = function(list_id, text, callback) {
	console.log('[Store] createStory', list_id, text);
	
	// find last story in this list
	var stories = this.board.lists_stories[list_id];
	
	// calc relative position of new story
	var last_pos = (stories.length == 0) ? 0 : stories[stories.length-1].pos; 
	var pos = last_pos + 65536
	
	// create a temp story (autoritative object will come back from server)
	var story = {
		desc: text,
		pos: pos,
		list: list_id,
		id: this.makeId()
	};
	
	// add story to the store
	this.board.stories[story.id] = story;
	this.board.lists_stories[story.list].push(story);
	this.fireOnCreateStory(story);
	
	callback();
}

MinimaStore.prototype.updateStoryPosition = function(list_id, story_id, new_pos, successFn) {
	console.log('[Store] updateStoryPosition', list_id, story_id, new_pos);
	
	var stories = this.board.lists_stories[list_id];
	console.log('[Store] current stories for list', stories);
	var story = this.board.stories[story_id];
	
	// moved to top
	if (new_pos == 0) {
		var current_at_pos = stories[new_pos];
		console.log('[Store] moving story to top', story.id, 'next: ', current_at_pos.desc);
		
		// calc new story position and send out the update
		var new_rel_pos = current_at_pos.pos / 2;
		story.pos = new_rel_pos;		
		var clone = $.extend({}, story);
		clone.pos = new_rel_pos;
		this.fireOnSyncStory(clone);
	}
	
	// moved to bottom
	else if (new_pos == stories.length - 1) {
		var current_at_pos = stories[new_pos];
		console.log('[Store] moving story to bottom', story.id, 'prev: ', current_at_pos.desc);
	}
	
	// moved somewhere in the middle
	else {
		var current_at_pos = stories[new_pos];
		var next_at_pos = stories[new_pos + 1]
		console.log('[Store] moving story to middle position', story.desc, current_at_pos.desc, next_at_pos.desc);
	}
	
	successFn();
}

/** EVENTS **/

MinimaStore.prototype.onBoard = function(handler, ctx) {
	this.onBoardHandler = {fn:handler, ctx:ctx};
}

MinimaStore.prototype.fireOnBoard = function(board) {
	var handler = this.onBoardHandler;
	handler.fn.call(handler.ctx, board);
}

MinimaStore.prototype.onCreateStory = function(handler, ctx) {
	this.onCreateStoryHandler = {fn:handler, ctx:ctx};
}

MinimaStore.prototype.fireOnCreateStory = function(story) {
	var handler = this.onCreateStoryHandler;
	handler.fn.call(handler.ctx, story);
}

MinimaStore.prototype.onSyncStory = function(handler, ctx) {
	this.onSyncStoryHandler = {fn:handler, ctx:ctx};
}

MinimaStore.prototype.fireOnSyncStory = function(story) {
	var handler = this.onSyncStoryHandler;
	handler.fn.call(handler.ctx, story);
}
