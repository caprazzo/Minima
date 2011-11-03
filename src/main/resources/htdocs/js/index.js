if (!window.console)
	window.console = { log: function() {} };
	
$(function() {
	console.log('[Index] ready');
			
	var mode = (window.WebSocket) ? 'websocket' : 'comet';
	
	var readonly = ($('#minima-read-only').val() == "true");
	if (readonly) 
		$('#readonly-notice').show();
	
	var ws_location = $('#minima-websocket-location').val()
	if (ws_location == 'auto')
		ws_location = 
			document.location.toString()
			.replace('http://', 'ws://')
			.replace('/index','/websocket');
	
	var comet_location = document.location.toString()
		.replace('/index', '/comet');
	
	var data_location = document.location.toString()
		.replace('/index','/data');
	
	var client = new MinimaClient({
		mode: mode,
		data_location: data_location,
		web_socket_location: ws_location,
		comet_location: comet_location
	});
	var controller = new MinimaController({
		client: client,
		data_location: data_location,
		readonly: readonly
	});
	
	controller.start();
});