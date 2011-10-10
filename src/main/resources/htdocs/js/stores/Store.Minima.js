Ext.ns('App.Store');
App.Store.Minima = Ext.extend(Ext.data.Store, {
	constructor: function(cfg) {
		cfg = cfg || {};
		
		var config = Ext.apply({
			model: 'Story',
			storeId: 'MinimaStore',
			autoSave: true,
			
			getGroupString: function(record) {
				return record.get('list')[0]
			},
			
			proxy: {
				type: 'rest',
				url: 'data/stories',
				record: 'stories',
				writer: {
					type: 'json',
					root: 'stories'
				},
				reader: {
					type: 'json',
					root: 'stories'
				}
			},
			
			listeners: {
				datachanged: function() {
					console.log('[Store.MinimaStore] datachanged');
				}
			}
		}, cfg);
		App.Store.Minima.superclass.constructor.call(this, config);
	}
});
Ext.reg('App.Store.Minima', App.Store.Minima);