if (!window.WebSocket)
	alert("WebSocket not supported by this browser");

$(function() {
	console.log('[Index] ready');
	var ws_location = document.location.toString()
		.replace('http://', 'ws://')
		.replace('/index','/socket');
	var client = new MinimaClient({web_socket_location: ws_location});
	var view = new ViewBoard({ content_matcher: '#content'});
	var controller = new MinimaController({
		client: client,
		view: view
	});
	controller.start();
});