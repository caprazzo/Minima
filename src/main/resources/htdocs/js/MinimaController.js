function MinimaController(options) {
	console.log('[Controller] constructor', options);
	
	this.client = options.client;
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
		
		board.lists.sort(function(objA, objB) {
			return objA.pos - objB.pos;
		});
		
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
		var found = view.findStoryView(ViewStory.viewId(storyModel.getId()));
		if (!found)
			Minima.notify("new story");
		view.setStory(storyModel);
	}, this);
	
}

MinimaController.prototype.enableNotifications = function() {
	if (!window.webkitNotifications) {
		console.log('[Controller] notifications not supported');
		$('#enableNotifications').hide();
		return;
	}
	if (window.webkitNotifications.checkPermission() == 2) {
		$('#enableNotifications').html('notifications denied');
		return;
	}
	if (window.webkitNotifications.checkPermission() == 1) { // PERMISSION_NOT_ALLOWED (user has not said yes or no yet				
		$('#enableNotifications').click(function() {
			console.log('[Controller] request notification permission');
			window.webkitNotifications.requestPermission();
		}).show();
		
		return;
	}
	if (window.webkitNotifications.checkPermission() == 0) {
		$('#enableNotifications').html('notifications enabled');
		return;
	} 
}

MinimaController.prototype.start = function() {
	console.log('[Contoller] start');
	
	this.client.connectWebSocket();
	this.client.loadBoard();
	this.enableNotifications();
}