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
	
	var notes = new NoteCollection();
	notes.url = options.data_location + '/stories/';
	var lists = new ListCollection();
	
	
	this.client.onBoard(function(board) {
		console.log('[Controller] client.on.board', board);
		
		board.lists.sort(function(objA, objB) {
			return objA.pos - objB.pos;
		});
		
		$.each(board.lists, function(idx, list_obj) {
			//view.setList(ModelList.fromObject(list_obj));
		});
		
		
		lists.add(board.lists);
		notes.add(board.stories);
		
		notes.bind('change', function(note, b, c) {
			// according to documentation, this should
			// not be necessary...
			console.log('change', note);
			notes.sort();			
			
		}, this);
			
		var listsView = new ListCollectionView({
			lists: lists,
			notes: notes,
			width: $(window).width()
		});
		
		
		$(window).resize(function() {
	    	listsView.resize($(this).width());
		});
		
		$('#board').append(listsView.render().el);
		
		listsView.resize($(window).width());
				
		$.each(board.stories, function(idx, story_obj) {
			//var storyModel = ModelStory.fromObject(story_obj);
			//view.setStory(storyModel);
		});
		
		
	}, this);
	
	this.client.onReceiveStory(function(storyModel) {		
		console.log('[Controller] client.on.receiveStory', storyModel);
		
		var found = notes.get(storyModel.id);
		if (found)
			notes.remove(storyModel, {silent: true});
		notes.add(storyModel);
		
		var model = notes.get(storyModel.id);
				
		if (found && found.get('list') != model.get('list')) {
			var from = lists.get(found.get('list'));
			var to = lists.get(model.get('list'));
			Minima.notify('Note moved from "' + from.get('name') + '" to "' + to.get('name') + '"', model.get('desc'));
		}
		
		if (!found && !model.get('archived')) {
			Minima.notify('New note', model.get('desc'));
			return;
		}
		
		if (found && !found.get('archived') && model.get('archived')) {
			Minima.notify('Note archived', model.get('desc'));
			return;
		}		
		
	}, this);
	
	//console.log();		
	
	var nView = new NotificationsCtrlView({model: nModel});			
	
	$('#notifications_ctrl').append(nView.el);
	nView.render();	
	
}

MinimaController.prototype.start = function() {
	console.log('[Contoller] start');
	
	this.client.connect();
	this.client.loadBoard();
}