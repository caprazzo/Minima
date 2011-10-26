window.NotificationsCtrlModel = Backbone.Model.extend({

    defaults: function() {
      return {
    	  	active: (this.getPermission() == 'allowed'),
			permission: this.getPermission()
      };
    },

    getPermission: function() {
		if (!window.webkitNotifications)
			return 'not_supported';
		
		switch(window.webkitNotifications.checkPermission()) {
			case 0: return 'allowed';
			case 1: return 'not_allowed';
			case 2: return 'denied';		
		}
	},
	
	activate: function() {		
		var that = this;
		if (this.getPermission() == 'not_allowed') {
			window.webkitNotifications.requestPermission(function() {
				that.set({permission: that.getPermission()});
				that.activate();
			});
			return;
		}
		
		if (this.getPermission() == 'denied' || this.getPermission() == 'not_supported') {
			this.set({active: false});
			return;
		}
		
		if (this.getPermission() == 'allowed') {
			this.set({active: true});
			return;
		}
	},
	
	deactivate: function() {
		this.set({active: false});
	},
	
	request: function() {
		
	}
});

NotificationsCtrlView = Backbone.View.extend({
	tagName: "div",
	model: NotificationsCtrlModel,
	className: "notify-container",
	id: "notify-container",
	
	initialize: function() {
		this.template = _.template($('#notify-template').html())
		this.model.bind('change', this.render, this);
	},
	  	  
	events: {
		'click .notify-off': 'deactivate',
		'click .notify-on': 'activate',
		'click .notify-help': 'toggleHelpTopic',
		'click .notify-help-topic': 'toggleHelpTopic'
	},

	render: function() {
		var $el = $(this.el);
		$el.html(this.template(this.model.toJSON()));
		
		$help = $el.find('.notify-help');
		$helpTopic = $el.find('.notify-help-topic');
		$help.hover(
			function() { $help.addClass('notify-help-highlight'); },
			function() { $help.removeClass('notify-help-highlight'); }
		);
		
		$topic = $el.find('.notify-help-topic');
		
		var out = $topic.outerWidth();
		var ins = $topic.width();
		$topic.width($el.width() - (out - ins));
	},
	
	activate: function() {
		console.log('Notification Ctrl enable');
		this.model.activate();
	},
	
	deactivate: function() {
		console.log('Notification Ctrl disable');
		this.model.deactivate()
	},
	
	toggleHelpTopic: function() {
		$(this.el).find('.notify-help-topic').toggle();
		$(this.el).find('.notify-help').toggleClass('notify-help-active');
	}
});