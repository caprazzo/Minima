(function() {
	var _sync = Backbone.sync;
	var _buffer = {};
	Backbone.sync = function(method, model, options) {
		console.log('Backbone sync', method, model, options);
		
		switch (method) {
		case 'read':
			break;
		case 'create':
			break;
		case 'update':
			var _options = _.extend({}, options, {
				error: function(req, msg) {
					console.log('_sync error', req, msg);
					if ( req.status != 0) {
						options.error(req, msg);
						return;
					}
					// network or server problem?
					_buffer[model.id] = {
						method: method,
						model: model,
						options: options
					}
					// trigger success with buffer
					if (options.buffered)
						options.buffered(model);
				}
			});			
			_sync(method, model, _options);
			break;
		case 'delete':
			break;
			
		case 'sync':
			var p = _buffer;
			_buffer = {};
			_.each(p, function(req) {
				console.log('Flushing pending', req);
				Backbone.sync(req.method, req.model, req.options);
			});
			break;
		}
}
})();


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
		console.log('_receiveMessage', msg);
		var obj = $.parseJSON(msg);
		console.log(obj);
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
			Backbone.sync('sync');
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
	
	_cometError: function(doRetry) {
		console.log('Comet transport is offline');
		this.cometStatus = 'error';
		if (doRetry) {
			var client = this; 
			setTimeout(function() {
				client._connectComet();
			}, 1500);
		}
	},
	
	_cometOnline: function() {
		this.cometStatus = 'online';
		Backbone.sync('sync');
	},
	
	/* if the status of the connection has not turned to error
	 * within 750ms, we can say that connectivity to the server is
	 * good once again */
	_cometCheck: function() {
		var that = this;
		setTimeout(function() {
		if (that.cometStatus == 'connecting')
			that._cometOnline();
		}, 750);
	},
	
	_connectComet: function() {
		console.log('connect comet', this.comet_location);
		var client = this;
		this.cometStatus = 'connecting';
		function listen() {
			$.ajax({
				url: client.comet_location + '?' + new Date().getTime(),
				processData: false,
				type: 'get',
				cache: 'false',
				success: function(data, textStatus, xhr) {
					// when the connection is dropped (ie server down), 
					// the browser (ffx at least) still thinks it's a 200, but the
					// content is not a json object as expected
					if (typeof data != 'string') {
						client._cometError(true);
						return;						
					}
					listen();
					client._receiveMessage(data);					
				},
				error: function(jqXhr, errorString) {
					console.log('Comet ERROR', jqXhr.status);
					client._cometError((jqXhr.status != 403));
				}
			});
			client.cometCheck();
		}
		listen();
	}
});