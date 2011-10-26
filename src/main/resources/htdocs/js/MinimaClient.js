function MinimaClient(options) {
	this.onBoardHandler = null;
	this.onReceiveStoryHandler = null;
	this.mode = options.mode;
	this.web_socket_location = options.web_socket_location;
	this.comet_location = options.comet_location;
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
	var store = this;
	$.getJSON('/data/stories', function(board) {
		console.log('[Client] loadBoard.success', board);
		// add static lists because server does not support lists yet)
		board.name = 'A Board';
		store.fireOnBoard(board);
	});
};

MinimaClient.prototype.connect = function() {
	if (this.mode == 'websocket')
		this.connectWebsocket();
	
	if (this.mode == 'comet')
		this.connectComet();
}

MinimaClient.prototype.connectComet = function() {
	console.log('connect comet');
	$.stream(this.comet_location, {
		//dataType: 'json',
		open: function(event, stream) {
			console.log('comet open', event, stream);
		},
		message: function(event) {
			console.log('comet message', event)
		},
		error: function() {
			console.log('comet error');
		},
		close: function() {
			console.log('comet close');
		}
	});
}

MinimaClient.prototype.connectWebsocket = function() {
	var client = this;
	if (!window.WebSocket) {
		alert("WebSocket not supported by this browser");
		console.warn("WebSocket not supported by this browser");
		return;
	}
	
	var ws = new WebSocket(this.web_socket_location);
	
	ws.onopen = function() {
		console.log('WebSocket.onopen');
		// TODO: we should sync the board after a disconnection
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
		if (obj.name == "story")
			client.fireReceiveStory(ModelStory.fromObject(obj.obj));
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