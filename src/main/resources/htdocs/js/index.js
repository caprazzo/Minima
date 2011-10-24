if (!window.WebSocket)
	alert("WebSocket not supported by this browser");

$(function() {
	console.log('[Index] ready');
			
	var ws_location = document.location.toString()
		.replace('http://', 'ws://')
		.replace('/index','/socket');
	var client = new MinimaClient({web_socket_location: ws_location});
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