function MinimaController(options) {
	console.log('[Controller] constructor', options);
	
	this.client = options.client;
	this.store = options.store;
	this.view = options.view;
	
	var view = this.view;
	var client = this.client;
	Minima.onCreateStory(function(storyModel) {
		console.log('[Controller] new story created');
		client.saveStory(storyModel, function(recv) {
			var listViewId = ViewList.viewId(recv.getListId());
			view.getList(listViewId).setStory(recv);
		});
	}, this);
	
	Minima.onUpdateStory(function(storyModel) {
		console.log('[Controller] story updated', storyModel);
		client.updateStory(storyModel, function(recv) {
			var listViewId = ViewList.viewId(recv.getListId());
			view.getList(listViewId).setStory(recv);
		});
	});
	
	this.client.onBoard(function(board) {
		console.log('[Controller] client.on.board', board);
		
		$.each(board.lists, function(idx, list_obj) {
			view.setList(ModelList.fromObject(list_obj));
		});
		
		$.each(board.stories, function(idx, story_obj) {
			var storyModel = ModelStory.fromObject(story_obj);
			view.setStory(storyModel);
		});
		
	}, this);
	
	this.client.onReceiveStory(function(storyModel) {
		console.log('[Controller] client.on.receiveStory');
		view.setStory(storyModel);
	}, this);
	
}

MinimaController.prototype.start = function() {
	console.log('[Contoller] start');
	this.client.connectWebSocket();
	this.client.loadBoard();
}