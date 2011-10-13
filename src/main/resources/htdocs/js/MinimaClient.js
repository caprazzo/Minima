function MinimaClient(options) {
	this.onBoardHandler = null;
	this.onReceiveStoryHandler = null;
}

MinimaClient.prototype.onBoard = function(handler, ctx) {
	this.onBoardHandler = {fn:handler, ctx:ctx};
}

MinimaClient.prototype.fireOnBoard = function(board) {
	var handler = this.onBoardHandler;
	handler.fn.call(handler.ctx, board);
}

MinimaClient.prototype.onReceiveStory = function(handler, ctx) {
	this.onReceiveStoryHandler = {fn:handler, ctx:ctx};
}

MinimaClient.prototype.fireReceiveStory = function(story) {
	var handler = this.onReceiveStoryHandler;
	handler.fn.call(handler.ctx, story);
}

MinimaClient.prototype.loadBoard = function() {
	var staticLists = [ { name: 'todo', id: 'todo', pos:65536 }, { name: 'doing', id: 'doing', pos:131072 }, { name: 'done', id: 'done', pos:196608 }];
	var store = this;
	$.getJSON('/data/stories', function(board) {
		console.log('[Client] loadBoard.success', board);
		// add static lists because server does not support lists yet)
		board.lists = staticLists;
		board.name = 'A Board';
		store.fireOnBoard(board);
	});
}

MinimaClient.prototype.createStory = function(story, successFn) {
	var client = this;
	$.ajax({
		type: 'POST',
		url: '/data/stories/' + story.id,
		contentType: 'application/json',
		data: JSON.stringify(story),
		dataType: 'json',
		processData: false,
		success: function(data) {
			console.log('[Client] createStory.success', data);
			successFn(data);
			client.fireReceiveStory(data);
		}
	});	
}

MinimaClient.prototype.updateStory = function(story, successFn) {
	var store = this;
	$.ajax({
		type: 'PUT',
		url: '/data/stories/' + story.id + '/' + story.revision,
		contentType: 'application/json',
		data: JSON.stringify(story),
		dataType: 'json',
		processData: false,
		success: function(data) {
			console.log('[Client] updateStory.success', data);	
			successFn(data);
			store.fireReceiveStory(data);
		}
	})
}