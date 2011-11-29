function MinimaClient(options) {
	this.mode = options.appModel.get('mode');
	this.web_socket_location = options.appModel.get('ws_location');
	this.comet_location = options.appModel.get('comet_location');
	this.data_location = options.appModel.get('data_location');
	this.client_tag = options.appModel.get('CLIENT_TAG');
}

_.extend(MinimaClient.prototype, Backbone.Events, {
	
	connect: function() {
		if (this.mode == 'websocket')
			this._connectWebsocket();
		
		if (this.mode == 'comet')
			this._connectComet();
	},
	
	loadBoard: function() {
		var store = this;
		$.getJSON(this.data_location + '/stories?' + new Date().getTime(), function(board) {
			board.name = 'A Board';
			store.trigger('board', board);
		});
	},
	
	_receiveMessage: function(msg) {
		var obj = $.parseJSON(msg);
		if (obj.sender == this.client_tag) {
			console.log("CLIENT: ignoring message from self");
			return;
		}
		if (obj.name == "story")
			this.trigger('note', obj.obj);
		else if (obj.name == "list")
			this.trigger('list', obj.obj);
	},
	
	_connectWebsocket: function() {
		var client = this;
		if (!window.WebSocket) {
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
				client._connectWebsocket();
			}, 1500);
		}
		ws.onmessage = function(msg) {
			console.log('WebSocket.onmsg', msg.data);
			client._receiveMessage(msg.data);
		}
		ws.onerror = function(err) {
			// TODO: if error is 403, do not retry
			console.log('WebSocket.onerr', err);
		}
	},
	
	_connectComet: function() {
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
					client._receiveMessage(data);
					listen();
				},
				error: function(jqXhr, errorString) {
					// TODO: if error is 403, do not retry
					setTimeout(function() {
						client._connectComet();
					}, 1500);
				}
			});
		}
		listen();
	}
});