function Minima() {
}

_.extend(Minima, Backbone.Events);

KeyCodes = {
	Enter: 13,
	Esc: 27
};

// global event handlers
(function() {
	var _onCreateStoryHandler = null;
	Minima.fireCreateStory = function(storyModel) {
		Minima.fireEvent(_onCreateStoryHandler, storyModel);
	}
	
	Minima.onCreateStory= function(fn, ctx) {
		_onCreateStoryHandler = Minima.bindEvent(_onCreateStoryHandler, fn, ctx);	
	}
	
	var _onUpdateStoryHandler = null;
	Minima.fireUpdateStory = function(storyModel) {
		Minima.fireEvent(_onUpdateStoryHandler, storyModel);
	}
	
	Minima.onUpdateStory= function(fn, ctx) {
		_onUpdateStoryHandler = Minima.bindEvent(_onUpdateStoryHandler, fn, ctx);	
	}

	var _notifications = [];
	Minima.notify = function(title, msg) {
		if (!window.webkitNotifications || window.webkitNotifications.checkPermission() != 0)
			return;
		
		var icon = document.location.toString().replace('/index','/favicon.ico');
		var notification = window.webkitNotifications.createNotification(icon,title, msg)
		notification.onclick = function(x) {
			window.focus();
			this.cancel();
		}
		notification.show();
		
		(function() {
		setTimeout(function() {
			if (notification)
				notification.cancel();
		}, 3000);
		})();
	}
})();


// static helper functions
Minima.args = function(arguments) {
	var arr = [];
	Array.prototype.push.apply(arr, arguments)
	return arr;
}


Minima.fireEvent = function(handlers) {
	if (!handlers) {
		console.warn('trying to fire event with no handler');
		return;
	} 
	var args = [];
	Array.prototype.push.apply(args, arguments)
	args.shift();
	
	$.each(handlers, function(idx, handler) {
		handler.fn.apply(handler.ctx, args);	
	});
}

Minima.bindEvent = function(handlers, fn, ctx) {
	if (!handlers)
		handlers = [];
	handlers.push({fn:fn, ctx:ctx});
	return handlers;
}

Minima.makeId = function() {
	return 'id' + new Date().getTime();
}