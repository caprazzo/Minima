ListCreateView = Backbone.View.extend({
	tagName: 'div',
	model: List,
	className: 'list-create-container',
	
	events: {
		'mouseenter .list-create-btn': 'toggleBtnHighlight',
		'mouseleave .list-create-btn': 'toggleBtnHighlight',
		'click .list-create-btn': 'createNewList'
	},
	
	initialize: function(args) {
		this.lists = args.lists;
		this.template = Templates['list-create'];
	},
	
	render: function() {
		var el = $(this.el);
		el.html(this.template({}));
		this.ui = {
			el: el,
			btn: el.find('.list-create-btn'),
		}
		return this;
	},
	
	createNewList: function() {
		var last = this.lists.last();
		var pos = 65536 + ((last) ? last.get('pos') : 0);
		this.lists.create({
			id: 'list' + Minima.makeId(),
			pos: pos,
			revision: 0,
			name: 'New List'
		});
	},
	
	toggleBtnHighlight: function() {
		this.ui.btn.toggleClass('list-create-btn-hover');
	}
});