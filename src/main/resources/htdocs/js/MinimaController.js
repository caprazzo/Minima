function MinimaController(options) {
	console.log('[Controller] constructor', options);
	
	this.client = options.client;
	this.view = options.view;
	
	var view = this.view;
	var client = this.client;
	
	var nModel = new NotificationsCtrlModel();
	
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
		view.setStory(storyModel);
		
		if (!nModel.get('active'))
			return;
		
		// story moved to new list
		if (found && found.getModel().diff(storyModel) && found.getParentView().getViewId() != ViewList.viewId(storyModel.getListId())) {
			var sourceListName = found.getParentView().getModel().getName();
			var destListName = view.findListView(ViewList.viewId(storyModel.getListId())).getModel().getName();
			Minima.notify('Note moved from "' + sourceListName + '" to "' + destListName + '"', storyModel.getDesc());
			return;
		}
		
		if (!found && !storyModel.getArchived()) {
			Minima.notify('New new note', storyModel.getDesc());
			return;
		}
		
		if (found && storyModel.getArchived()) {
			Minima.notify('Note archived', storyModel.getDesc());
			return;
		}
		
	}, this);
	
	//console.log();		
	
	var nView = new NotificationsCtrlView({model: nModel});	
	console.log(nView.el);		
	
	$('#notifications_ctrl').append(nView.el);
	nView.render();	
	
}

MinimaController.prototype.start = function() {
	console.log('[Contoller] start');
	
	this.client.connectWebSocket();
	this.client.loadBoard();
}