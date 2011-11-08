AppModel = Backbone.Model.extend({
	
	defaults: function() {
		return {
			
		}
	},
	
	readPageConfig: function() {
		this.set({
			readonly : ($('#minima-read-only').val() == "true"),	
			mode: (window.WebSocket) ? 'websocket' : 'comet',					
			ws_location: $('#minima-websocket-location').val(),
			comet_location: $('#minima-comet-location').val(),	
			data_location: $('#minima-data-location').val(),
			board_title: $('#minima-board-title').val()
		});
	}

});