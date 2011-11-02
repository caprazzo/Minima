List = Backbone.Model.extend({
	defaults: function() {
		return {
			name: 'foo',
			id: 'listId',
			rev: 'listRev'
		};
	},
	
	url: function() {
		return '/lists/' + this.id + '/' + this.get('rev');
	}
	
});