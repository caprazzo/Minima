Ext.ns('App.Store');
App.Store.Minima = Ext.extend(Ext.data.Store, {
	constructor: function(cfg) {
		cfg = cfg || {};
		var config = Ext.apply({
			model: 'Story',
			storeId: 'MinimaStore',
			proxy: {
				type: 'ajax',
				url: 'data/board',
				reader: {
					type: 'json',
					root: 'stories'
				}
			}
		}, cfg);
		App.Store.Minima.superclass.constructor.call(this, config);
	}
});
Ext.reg('App.Store.Minima', App.Store.Minima);