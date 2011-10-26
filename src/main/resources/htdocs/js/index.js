$(function() {
	console.log('[Index] ready');
			
	var mode = (window.WebSocket) ? 'websocket' : 'comet';
	
	var ws_location = document.location.toString()
		.replace('http://', 'ws://')
		.replace('/index','/websocket');
	
	var comet_location = document.location.toString()
		.replace('/index', '/comet');
	
	var client = new MinimaClient({
		mode: mode,
		web_socket_location: ws_location,
		comet_location: comet_location
	});
	
	var view = new ViewBoard({ content_matcher: '#content'});
	view.resize($(window).width());
	var controller = new MinimaController({
		client: client,
		view: view
	});
	
	$(window).resize(function() {
    	view.resize($(this).width());
	});
	
	controller.start();
});