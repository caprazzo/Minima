AlertReadonlyView = Backbone.View.extend({
	tagName: 'div',
	className: 'alert-container',
	
	initialize: function(args) {
		this.template = Templates['alert-readonly'];
		this.args = args;
	},
	
	events: {
		'click .close': 'dismiss'
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template(this.args));		
		return this;
	},
	
	dismiss: function() {
		$(this.el).remove();
	}
});

AlertArchivedView = Backbone.View.extend({
	
	initialize: function(args) {
		this.template = Templates['alert-archived'];
		this.model = args.model;
		this.itemName = args.itemName;
	},
	
	events: {
		'click .close': 'dismiss',
		'click .undo': 'undo'
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template({ itemName: this.itemName	}));
		return this;
	},
	
	undo: function() {
		var view = this;
		this.model.save({archived: false}, {
			success: function() {
				$(view.el).remove();
			},
			error: function() {
				console.error("Could not undo archive note");
			}
		});
	},
	
	dismiss: function() {
		$(this.el).remove();
	}
	
});