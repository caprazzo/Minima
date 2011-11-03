List = Backbone.Model.extend({
	defaults: function() {
		return {
			
		};
	},
	
	url: function() {
		return this.collection.url + this.id + '/' + this.get('revision');
	}
	
});