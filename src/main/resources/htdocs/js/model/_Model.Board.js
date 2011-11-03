function ModelBoard() {
	this.lists = {};
	this.name = 'no name';
}

/**
 * Initialize a board from a board object,
 * usually received from the server
 */
ModelBoard.fromJson = function(board_json) {
	
	var board = new ModelBoard();
	
	board.setName(board_json.name);
	
	// create all lists
	$.each(board_json.lists, function(idx, json_list) {
		var list = ModelList.fromJson(json_list);
		board.addList(list);
	});
	
	// add all stories to the lists
	$.each(board_json.stories, function(idx, json_story) {
		var story = ModelStory.fromJson(json_story);
		var list = board.getList(story.getListId());
		list.addStory(story);
	});
	
	return board;
}

ModelBoard.prototype.addList = function(list) {
	this.lists[list.getId()] = list;
}

ModelBoard.prototype.getList = function(list_id) {
	return this.lists[list_id];
}

ModelBoard.prototype.getLists = function() {
	return this.lists;
}

ModelBoard.prototype.getName = function() {
	return this.name;
}

ModelBoard.prototype.setName = function(name) {
	this.name = name;
}