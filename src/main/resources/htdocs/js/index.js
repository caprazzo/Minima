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
	
	var filteredLists = new FilteredCollection([], {
		parent: lists, 
		filter: function(list) {
			return !list.get('archived'); 
		},
		comparator: function(list) {
			return list.get('pos');
		}
	});
	
	var client = new MinimaClient({ appModel: app });
		
	client.bind('board', function(board) {
		lists.add(board.lists);
		notes.add(board.stories);		
	});
	
	client.bind('note', function(note) {
		var found = notes.get(note.id);		
		var model = new Note(note);
				
		if (found && found.get('list') != model.get('list')) {
			var from = lists.get(found.get('list'));
			var to = lists.get(model.get('list'));
			Minima.notify('Note moved from "' + from.get('name') + '" to "' + to.get('name') + '"', model.get('desc'));
		}
		
		else if (!found && !model.get('archived')) {
			Minima.notify('New note', model.get('desc'));
		}
		
		else if (found && !found.get('archived') && model.get('archived')) {
			Minima.notify('Note archived', model.get('desc'));
		}		
		
		if (found) {
			found.set(note);
		}
		else {
			notes.add(note);
		}
	});
	
	client.bind('list', function(list) {
		var found = lists.get(list.id);
		if (found) {
			found.set(list);
		} else {
			lists.add(list);
		}
	});
	
	var view = new AppView({
		lists: filteredLists,
		notes: notes,
		appModel: app
	});
	view.render();	
	
	client.connect();
	client.loadBoard();
});