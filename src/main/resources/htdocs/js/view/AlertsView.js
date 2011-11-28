AlertsView = Backbone.View.extend({
	tagName: 'div',
	className: 'alerts-container',
	
	initialize: function(args) {
		this.template = Templates['alerts'];
	},
	
	events: {
		// expand & collapse
		// dismiss all
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template({}));
		this.ui = {
			el: el,
			list: el.find('.alerts-list')
		}		
		
		return this;
	},
	
	addAlert: function(alertView, duration) {
		this.ui.list.empty();
		var el = alertView.render().el;
		this.ui.list.prepend(el);
		
		if (duration) {
			setTimeout(function() { 
				$(el).fadeOut();
			}, duration);
		}
	}
	
});