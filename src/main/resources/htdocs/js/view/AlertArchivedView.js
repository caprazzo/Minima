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
	},
	
	events: {
		'click .close': 'dismiss',
		'click .undo': 'undo'
	},
	
	render: function() {
		var el = $(this.el);
		var full = this.model.get('desc');
		var short = full.substring(0, 10);
		if (short != full) short += '...';
		el.html(this.template({ desc: short	}));
		
		var that = this;
		
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