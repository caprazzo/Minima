
//./js/index.js

Ext.regApplication('App', {
	defaultTarget: 'viewport',
	defaultUrl   : 'Viewport/index',
	name         : 'App',
	useHistory   : false,
	useLoadMask : true,

	launch: function() {
		Ext.Viewport.init();
		Ext.Viewport.onOrientationChange();

		this.viewport = new App.View.Viewport({
			application: this
		});

		Ext.dispatch({
			controller: 'Viewport',
			action    : 'index'
		});
	}
});

//./js/controllers/Controller.Viewport.js

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

//./js/models/Model.Story.js

Ext.regModel('Story', {
	fields: [
		{
			name: 'revision',
			type: 'number'
		},
		{
			name: 'id',
			type: 'string'
		},
		{
			name: 'desc',
			type: 'string'
		},
		{
			name: 'list',
			type: 'string'
		}
	]
});

//./js/stores/Store.Minima.js

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

//./js/views/View.Viewport.js

Ext.ns('App.View');

App.View.Viewport = Ext.extend(Ext.Panel, {
	id        : 'viewport',
	layout    : 'card',
	fullscreen: true,


	initComponent: function() {
		var config = {
			layout: 'fit',
			items: [
			   { html: 'hello world' }
			]
		};
		Ext.apply(this, config);
		App.View.Viewport.superclass.initComponent.call(this);

	}
});

Ext.reg('App.View.Viewport', App.View.Viewport);
