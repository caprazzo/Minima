AppView = Backbone.View.extend({
	el: $("#minima"),
	
	initialize: function(args) {		
		this.el = $('#minima');
		this.lists = args.lists;
		this.notes = args.notes;
		this.appModel = args.appModel;
		this.template = Templates["app"];
						
		this.views = {
			alerts: new AlertsView(),
		}
		
		Minima.bind('archive-note', function(note) {
			var alView = new AlertArchivedView({ model: note, itemName: 'note' });
			alView.render();
			this.views.alerts.addAlert(alView, 22000);
		}, this);
		
		Minima.bind('archive-list', function(list) {
			var alView = new AlertArchivedView({ model: list, itemName: 'list' });
			alView.render();
			this.views.alerts.addAlert(alView, 22000);
		}, this);
	},
	
	render: function() {
		console.log(this.appModel.toJSON());
		this.el.html(this.template(this.appModel.toJSON()));
						
		// alerts panel
		$('#alerts').append(this.views.alerts.render().el);
		
		// notifications control	
		var nModel = new NotificationsCtrlModel();
		var nView = new NotificationsCtrlView({model: nModel});	
		this.el.find('#notifications_ctrl').append(nView.el);
		nView.render();
		
		// list create view
		if (!this.appModel.get('readonly')) {
			var listCreateView = new ListCreateView ({
				lists: this.lists
			});
			$('#list-create-ctrl').append(listCreateView.render().el);
		}
		else {
			var alert = new AlertReadonlyView({ 
				login_url: this.appModel.get('login_url')
			})
			this.views.alerts.addAlert(alert);
		}
		
		// list collection view
		var listsView = new ListCollectionView({
			lists: this.lists,
			notes: this.notes,
			readonly: this.appModel.get('readonly')
		});
		
		$(window).resize(function() {
	    	listsView.resize($(this).width());
		});
		
		$('#board').append(listsView.render().el);
		
		listsView.resize($(window).width());		
	}
});