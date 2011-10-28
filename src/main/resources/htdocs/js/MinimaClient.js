function MinimaClient(options) {
	this.onBoardHandler = null;
	this.onReceiveStoryHandler = null;
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

MinimaClient.prototype.loadBoard = function() {
	var store = this;
	$.getJSON(this.data_location + '/stories?' + new Date().getTime(), function(board) {
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
		// TODO: we should sync the board after a disconnection
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

MinimaClient.prototype.saveStory = function(story, successFn) {
	console.log('[Client] creating story', story);
	$.ajax({
		type: 'POST',
		url: this.data_location + '/stories/' + story.getId(),
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

MinimaClient.prototype.receiveMessage = function(msg) {
	console.log('received message', msg);
	var obj = $.parseJSON(msg);
	console.log('parsed message', obj);
	if (obj.name == "story")
		this.fireReceiveStory(ModelStory.fromObject(obj.obj));
}

MinimaClient.prototype.updateStory = function(story, successFn) {
	console.log('[Client] sending story update', story);
	$.ajax({
		type: 'PUT',
		url: this.data_location + '/stories/' + story.getId() + '/' + story.getRevision(),
		contentType: 'application/json',
		data: JSON.stringify({name:'story', obj:story.asObject()}),
		dataType: 'json',
		processData: false,
		success: function(data) {
			console.log('[Client] updateStory.success', data);	
			successFn(ModelStory.fromObject(data.obj));
		}
	})
}

MinimaClient.prototype.updateList = function(list, successFn) {
	console.log('[Client] sending list update', list);
	$.ajax({
		type: 'PUT',
		url: this.data_location + '/lists/' + list.getId() + '/' + list.getRevision(),
		contentType: 'application/json',
		data: JSON.stringify({name:'list', obj:list.asObject()}),
		dataType: 'json',
		processData: false,
		success: function(data) {
			console.log('[Client] updateStory.success', data);	
			successFn(ModelList.fromObject(data.obj));
		}
	});
}