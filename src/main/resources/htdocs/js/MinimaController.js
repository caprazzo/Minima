function MinimaController(options) {
	console.log('[Controller] constructor', options);
	
	this.boardVm = new BoardViewModel();
	
	this.client = options.client;
	this.store = options.store;
	this.view = options.view;
	
	var list = {
		id: 'todo',
		name: 'TODO'
	}
	
	var listModel = ModelList.fromJson(list);
	
	this.view.setList(listModel);
	this.view.setList(listModel);
	
	var newList = ModelList.fromJson({id: 'todo', name: 'to-do'});
	this.view.setList(newList);
	
	var story = ModelStory.fromJson({ id:'story_1', list:'todo', desc:'story-1', pos: 65536 });
	this.view
		.getList(story.getListId())
		.setStory(story);
	
	var story = ModelStory.fromJson({ id:'story_1', list:'todo', desc:'story-1 new desc', pos: 65536 });
	this.view
		.getList(story.getListId())
		.setStory(story);
	
	var story = ModelStory.fromJson({ id:'story_2', list:'todo', desc:'story-2', pos: 30000 });
	this.view
		.getList(story.getListId())
		.setStory(story);
	
	var story = ModelStory.fromJson({ id:'story_3', list:'todo', desc:'story-3', pos: 40000 });
	this.view
		.getList(story.getListId())
		.setStory(story);
	
	var story = ModelStory.fromJson({ id:'story_4', list:'todo', desc:'story-4', pos: 100000 });
	this.view
		.getList(story.getListId())
		.setStory(story);
	
	var story = ModelStory.fromJson({ id:'story_3', list:'todo', desc:'story-3 updated', pos: '940000' });
	this.view
		.getList(story.getListId())
		.setStory(story);
	
	//this.view.setBoardVm(this.boardVm);
	
	//this._initStore();
	//this._initClient();
	//this._initView();
	
	//Minima.onCreateStory(function(storyModel) {
	//	console.log('[Controller] new story created');
	//	this.store.addNewStory(storyModel);
	//}, this);
}

MinimaController.prototype._initClient = function() {
	this.client.onBoard(function(board) {
		console.log('[Controller] client.on.board', board);
		this.store.receiveBoard(board);
	}, this);
	
	var store = this.store;
	this.client.onReceiveStory(function(story) {
		console.log('[Controller] client.on.receiveStory', story);
		store.receiveStory(story);
	});
}

MinimaController.prototype._initStore = function() {
	this.store.onBoard(function(board) {
		console.log('[Controller] store.on.board', board);
		this.boardVm.setModel(board);
		this.boardVm.setName('new name');
	}, this);
	
	this.store.onCreateStory(function(story) {
		console.log('[Controller] store.on.createStory', story);
		
		// add story to view immediately
		this.view.addStory(story);

		var store = this.store;
		// send story to server
		this.client.createStory(story, function(recv) {
			console.log('[Controller] client.on.createStory.success', story, recv);
			// TODO: this should only update the store
			// and a store event should update the view
			store.receiveStory(story);
		});
		
	}, this);
	
	this.store.onSyncStory(function(story) {
		console.log('[Controller] store.on.updateStory');
		var store = this.store;
		this.client.updateStory(story, function(recv) {
			console.log('[Controller] client.on.updateStory.success', story, recv);
		});
	}, this);
}

MinimaController.prototype._initView = function() {
	this.view.onCreateStory(function(list_id, text, successFn) {
		console.log('[Controller] view.on.createStory', list_id, text);
		
		// push story to store
		this.store.createStory(list_id, text, function() {
			console.log('[Controller] store.createStory.success');
			successFn();	
		});
		
		
	}, this);
	
	this.view.onUpdateStoryPosition(function(list_id, story_id, new_pos, successFn) {
		console.log('[Controller] view.on.updateStoryPosition', list_id, story_id, new_pos);
		
		this.store.updateStoryPosition(list_id, story_id, new_pos, function() {
			console.log('[Controller] store.updateStoryPosition');
			successFn();
		});
		
	}, this);
	
	this.view.init();
}

MinimaController.prototype.start = function() {
	console.log('[Contoller] start');
	//this.client.loadBoard();
	
	this.view
	
}