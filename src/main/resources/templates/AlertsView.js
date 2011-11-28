AlertsView = Backbone.View.extend({
	tagName: 'div'
	className: 'alerts-container',
	
	initialize: function(args) {
		this.template = Templates['alerts-template'];
		this.alerts = args.alerts;
	},
	
	render: function() {
		return this;
	}

});