FilteredCollection = Backbone.Collection.extend({
	initialize: function(models, args) {
		this.parent = args.parent;
		this.filter = args.filter;		
		var filtered = this.parent.filter(this.filter);
		this.add(filtered);	
		
		this.parent.bind('add', this.onParentAdd, this);
		this.parent.bind('remove', this.onParentRemove, this);
		this.parent.bind('change', this.onParentChange, this);
	},
	
	onParentAdd: function(model) {
		if (this.filter(model))
			this.add(model);
	},
	
	onParentRemove: function(model) {
		if (this.get(model.id))
			this.remove(model);
	},
	
	onParentChange: function(model) {
		var found = this.get(model.id);
		if (found) {
			if (this.filter(model)) {
				var before = this.pluck('id').join(';');
				found.set(model.attributes);
				this.sort({silent: true});
				var after = this.pluck('id').join(';');
				if (before != after) {
					this.trigger('sort', found);
				}
			}
			else {
				this.remove(found);
			}
		}
		
		if (!found) {
			if (this.filter(model)) {
				this.add(model);
			}
		}		
	}
});