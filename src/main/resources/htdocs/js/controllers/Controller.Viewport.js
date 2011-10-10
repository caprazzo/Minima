/**
 * Chat Controller
 *
 * @author Nils Dehl <mail@nils-dehl.de>
 */
Ext.regController('Viewport', {

	index: function(options) {
		console.log('[Controller.Viewport] index', options);
		this.store = options.store;
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