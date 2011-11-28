NoteView = Backbone.View.extend({
	tagName: 'div',
	className: 'alerts-container',
	
	initialize: function(args) {
		this.template = Templates['alerts-template'];
		this.alerts = args.alerts;
		this.alerts.bind('add', this.addAlert, this);
	},
	
	events: {
		// expand & collapse
		// dismiss all
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template({}));
		this.ui = {
			el: el
		}
		
		var that = this;
		this.alerts.each(function(alert) {
			var alertView = new AlertView(alert);
			that.el.append(alertView.render().el);
		});
		
		return this;
	},
	
	addAlert: function(alert) {
		var alertView = new AlertView(alert);
		that.el.append(alertView.render().el);
	}
	
});