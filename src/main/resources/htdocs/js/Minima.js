function Minima() {}

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
	
})();

Minima.args = function(arguments) {
	var arr = [];
	Array.prototype.push.apply(arr, arguments)
	return arr;
}

Minima.log = function(tag, args) {
	var ar = Minima.args(args);
	ar.unshift(tag);
	console.log.apply(console, ar);
}

Minima.getViewId = function($htmlItem) {
	return $htmlItem.children(':first').attr('id')
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