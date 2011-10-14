function MinimaClient(options) {
	this.onBoardHandler = null;
	this.onReceiveStoryHandler = null;
	this.web_socket_location = options.web_socket_location;
}

MinimaClient.prototype.onBoard = function(handler, ctx) {
	this.onBoardHandler = {fn:handler, ctx:ctx};
}

MinimaClient.prototype.fireOnBoard = function(board) {
	var handler = this.onBoardHandler;
	handler.fn.call(handler.ctx, board);
}

MinimaClient.prototype.onReceiveStory = function(fn, ctx) {
	this.onReceiveStoryHandler = Minima.bindEvent(this.onReceiveStoryHandler, fn, ctx);	
}

MinimaClient.prototype.fireReceiveStory = function(storyModel) {
	Minima.fireEvent(this.onReceiveStoryHandler, storyModel);
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
};

MinimaClient.prototype.connectWebSocket = function() {
	var client = this;
	if (!window.WebSocket) {
		alert("WebSocket not supported by this browser");
		console.warn("WebSocket not supported by this browser");
		return;
	}
	
	var ws = new WebSocket(this.web_socket_location);
	
	ws.onopen = function() {
		console.log('WebSocket.onopen');
	}
	
	ws.onclose = function() {
		console.log('WebSocket.onclose');
		setTimeout(function() {
			client.connectWebSocket();
		}, 1500);
	}
	
	ws.onmessage = function(msg) {
		console.log('WebSocket.onmsg', msg.data);
		var obj = $.parseJSON(msg.data);
		client.fireReceiveStory(ModelStory.fromObject(obj));
	}
	
	ws.onerror = function(err) {
		console.log('WebSocket.onerr', err);
	}
	
};

MinimaClient.prototype.saveStory = function(story, successFn) {
	console.log('[Client] creating story', story);
	$.ajax({
		type: 'POST',
		url: '/data/stories/' + story.getId(),
		contentType: 'application/json',
		data: JSON.stringify(story.asObject()),
		dataType: 'json',
		processData: false,
		success: function(data) {
			console.log('[Client] createStory.success', data);
			successFn(ModelStory.fromObject(data));
		}
	});	
}

MinimaClient.prototype.updateStory = function(story, successFn) {
	console.log('[Client] sending story update', story);
	$.ajax({
		type: 'PUT',
		url: '/data/stories/' + story.getId() + '/' + story.getRevision(),
		contentType: 'application/json',
		data: JSON.stringify(story.asObject()),
		dataType: 'json',
		processData: false,
		success: function(data) {
			console.log('[Client] updateStory.success', data);	
			successFn(ModelStory.fromObject(data));
		}
	})
}