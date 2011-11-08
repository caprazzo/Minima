if (!window.console)
	window.console = { log: function() {} };
	
$(function() {
	Templates.load();
	
	// read variables from document
	
	var app = new AppModel();
	app.readPageConfig();
	
	/*
	var readonly = ($('#minima-read-only').val() == "true");
	
	var mode = (window.WebSocket) ? 'websocket' : 'comet';	
	var ws_location = $('#minima-websocket-location').val();
	var comet_location = $('#minima-comet-location').val();	
	var data_location = $('#minima-data-location').val();
	*/
	
	var notes = new NoteCollection();
	notes.url = app.get('data_location') + '/stories/';
	notes.bind('change', function(note) {
		// WARN: according to documentation this should not necessary
		notes.sort();			
	}, this);			
	
	var lists = new ListCollection();
	lists.url = app.get('data_location') + '/lists/';
	
	var client = new MinimaClient({ appModel: app });
		
	client.bind('board', function(board) {
		lists.add(board.lists);
		notes.add(board.stories);		
	});
	
	client.bind('note', function(note) {
		
	});
	
	client.bind('list', function(list) {
		
	});
	
	
	/*
	var controller = new MinimaController({
		client: client,
		data_location: data_location,
		readonly: readonly
	});
	*/
	
	var view = new AppView({
		lists: lists,
		notes: notes,
		appModel: app
	});
	view.render();	
	
	client.connect();
	client.loadBoard();
});