Note = Backbone.Model.extend({
	
	url: function() {
		return this.collection.url + this.id + '/' + this.get('revision');
	},
	
	defaults: function() {
		return {
			
		};
	}
	
	/*,
	
	toJSON: function() {
		return {
			name: 'story',
			obj: {
				id: this.id,
				pos: this.get('pos'),
				desc: this.get('desc'),
				revision: this.get('rev'),
				list: this.get('list'),
				archived: this.get('archived')
			}
		}
	}
	*/
});