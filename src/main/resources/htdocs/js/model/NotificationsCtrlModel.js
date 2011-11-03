NotificationsCtrlModel = Backbone.Model.extend({

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