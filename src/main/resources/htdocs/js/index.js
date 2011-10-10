Ext.regApplication('App', {
	defaultTarget: 'viewport',
	defaultUrl   : 'Viewport/index',
	name         : 'App',
	useHistory   : false,
	useLoadMask : true,

	launch: function() {
		Ext.Viewport.init();
		Ext.Viewport.onOrientationChange();

		var store = new App.Store.Minima();
		store.load();
		console.log('loaded');
		console.log(store.getAt(0));
		console.log(store.data);
		
		this.viewport = new App.View.Viewport({
			application: this,
			store: store
		});

		Ext.dispatch({
			controller: 'Viewport',
			action    : 'index',
			store:	store
		});
	}
});