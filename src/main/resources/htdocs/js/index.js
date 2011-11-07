if (!window.console)
	window.console = { log: function() {} };
	
$(function() {
	var mode = (window.WebSocket) ? 'websocket' : 'comet';
	
	var readonly = ($('#minima-read-only').val() == "true");
	if (readonly) 
		$('#readonly-notice').show();
	
	var ws_location = $('#minima-websocket-location').val();
	var comet_location = $('#minima-comet-location').val();	
	var data_location = $('#minima-data-location').val();
	
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