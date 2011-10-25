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
	className: "mn-view-notifications-ctrl",
	id: "mn-view-notifications-ctrl-container",
	
	initialize: function() {
		this.template = _.template($('#mn-tpl-notifications-ctrl').html())
		this.model.bind('change', this.render, this);
	},
	  	  
	events: {
		'click #mn-tpl-notifications-ctrl-off': 'deactivate',
		'click #mn-tpl-notifications-ctrl-on': 'activate'		
	},

	render: function() {
		var $el = $(this.el);
		$el.html(this.template(this.model.toJSON()));
		$el.find('.mn-tpl-notifications-ctrl-radio').buttonset();		
		$el.find('.mn-tpl-notifications-ctrl-help').hover(
			function() { $(this).addClass('mn-tpl-notifications-ctrl-help-hover'); },
			function() { $(this).removeClass('mn-tpl-notifications-ctrl-help-hover'); }
		).click(function() {
			$el.find('.mn-tpl-notification-ctrl-help-topic').toggle();
			$el.find('.mn-tpl-notifications-ctrl-help').toggleClass('mn-tpl-notifications-ctrl-help-active');
		});
		$topic = $el.find('.mn-tpl-notification-ctrl-help-topic');
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
	}
});