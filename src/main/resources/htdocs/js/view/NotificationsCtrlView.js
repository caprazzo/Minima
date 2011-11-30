NotificationsCtrlView = Backbone.View.extend({
	tagName: "div",
	model: NotificationsCtrlModel,
	className: "notify-container",
	id: "notify-container",
	
	initialize: function() {
		this.template = Templates['notify'];
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
		return this;
	},
	
	activate: function() {
		this.model.activate();
	},
	
	deactivate: function() {
		this.model.deactivate()
	},
	
	toggleHelpTopic: function() {
		$(this.el).find('.notify-help-topic').toggle();
		$(this.el).find('.notify-help').toggleClass('notify-help-active');
	}
});