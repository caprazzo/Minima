function MinimaClient(options) {
	this.onBoardHandler = null;
	this.onReceiveStoryHandler = null;
	this.onReceiveListHandler = null;
	this.mode = options.mode;
	this.web_socket_location = options.web_socket_location;
	this.comet_location = options.comet_location;
	this.data_location = options.data_location;
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

MinimaClient.prototype.onReceiveList = function(fn, ctx) {
	this.onReceiveListHandler = Minima.bindEvent(this.onReceiveListHandler, fn, ctx);	
}

MinimaClient.prototype.fireReceiveList = function(list) {
	Minima.fireEvent(this.onReceiveListHandler, list);
}

MinimaClient.prototype.loadBoard = function() {
	var store = this;
	$.getJSON(this.data_location + '/stories?' + new Date().getTime(), function(board) {
		console.log('[Client] loadBoard.success', board);
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
	console.log(this.comet_location);
	var client = this;
	function listen() {
		$.ajax({
			url: client.comet_location + '?' + new Date().getTime(),
			processData: false,
			type: 'get',
			cache: 'false',
			success: function(data, textStatus, xhr) {
				client.receiveMessage(data);
				listen();
			},
			error: function(jqXhr, errorString) {
				// TODO: if error is 403, do not retry
				setTimeout(function() {
					client.connectComet();
				}, 1500);
			}
		});
	}
	
	listen();
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
	}
	
	ws.onclose = function() {
		console.log('WebSocket.onclose');
		setTimeout(function() {
			client.connectWebsocket();
		}, 1500);
	}
	
	ws.onmessage = function(msg) {
		console.log('WebSocket.onmsg', msg.data);
		client.receiveMessage(msg.data);
	}
	
	ws.onerror = function(err) {
		// TODO: if error is 403, do not retry
		console.log('WebSocket.onerr', err);
	}
	
};

MinimaClient.prototype.receiveMessage = function(msg) {
	var obj = $.parseJSON(msg);
	if (obj.name == "story")
		this.fireReceiveStory(obj.obj);
	else if (obj.name == "list")
		this.fireReceiveList(obj.obj);
}