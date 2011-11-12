Note = Backbone.Model.extend({
	
	url: function() {
		return this.collection.url + this.id + '/' + this.get('revision');
	},
	
	defaults: function() {
		return {
			
		};
	}
});