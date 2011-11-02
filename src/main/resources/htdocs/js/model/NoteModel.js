Note = Backbone.Model.extend({
	defaults: function() {
		return {
			desc: 'foo',
			id: 'listId',
			rev: 'listRev'
		};
	}	
});