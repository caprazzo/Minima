ListCollection = Backbone.Collection.extend({
	model: List,
	comparator: function(list) {
		return list.get('pos');
	}
});