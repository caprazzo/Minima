/**
 * Chat Controller
 *
 * @author Nils Dehl <mail@nils-dehl.de>
 */
Ext.regController('Viewport', {

	index: function() {
		var store = new App.Store.Minima();
		store.load();
		console.log('loaded');
		console.log(store.getAt(0));
		console.log(store.data);
		//this.showView();
	},
	
	showView: function() {
		if (!this.viewPort) {
			this.viewPort = this.render({
				xtype: 'App.View.Viewport'
			});
		}
	}
});