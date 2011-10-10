
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

//./js/controllers/Controller.Viewport.js

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
			
			getGroupString: function(record) {
				return record.get('list')[0]
			},
			
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


	initComponent: function(options) {
		console.log('[View.Viewport] initComponent', this.store);
		var that = this;
		var config = {
			xtype: 'panel',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [
			   { 
				   xtype: 'panel',
				   title: 'todo',
				   flex: 1,
				   dockedItems: [{
					   dock: 'top',
					   html: 'todo'
				   }],
				   items: [{
				       xtype: 'list',
				       itemId: 'todoList',
				       store: this.store,
				       itemSelector: 'foo.bar',
				       collectData: function(records, startIndex) {
				    	   var r = [];
				    	   for( var i=0; i<records.length; i++ ) {
				               if( records[i].data.list == 'todo' )
				                   r.push( this.prepareData(records[i].data, 0, records[i]) );
				    	   }
				           return r;
				       },
				       itemTpl: new Ext.XTemplate('{desc}')
				   }, 
				   {
					   xtype: 'textareafield',
		               itemId: 'txt-new-story-todo',
		               hidden: true,
		               listeners: {
		            	   keyup: function(el, ev) {
		            		   console.log('keyup', ev, ev.browserEvent.keyCode);		            		   
		            		   if (ev.browserEvent.keyCode == 13) {
		            			   console.log('submit', ev);
		            		   }
		            	   }
		               }
				   },
				   {					 
					   xtype: 'button',
					   itemId: 'btn-create-todo',
					   text: 'create',
					   handler: function() {
						   console.log('[View.Viewport] btn.create.todo');
						   var input = that.query('#txt-new-story-todo')[0];
						   input.show();
					   }
				   }]
			   },
			   { 
				   xtype: 'panel',
				   title: 'doing',
				   flex: 1,
				   dockedItems: [{
					   dock: 'top',
					   html: 'doing'
				   }],
				   items: [{
				       xtype: 'list',
				       itemId: 'todoList',
				       store: this.store,
				       itemSelector: 'foo.bar',
				       collectData: function(records, startIndex) {
				    	   var r = [];
				    	   for( var i=0; i<records.length; i++ ) {
				               if( records[i].data.list == 'doing' )
				                   r.push( this.prepareData(records[i].data, 0, records[i]) );
				    	   }
				           return r;
				       },
				       itemTpl: new Ext.XTemplate('{desc}')
				   }, {
					   dock: 'bottom',
					   html: 'create'
				   }]
			   },
			   { 
				   xtype: 'panel',
				   title: 'done',
				   flex: 1,
				   dockedItems: [{
					   dock: 'top',
					   html: 'done'
				   }],
				   items: [{
				       xtype: 'list',
				       itemId: 'todoList',
				       store: this.store,
				       itemSelector: 'foo.bar',
				       collectData: function(records, startIndex) {
				    	   var r = [];
				    	   for( var i=0; i<records.length; i++ ) {
				               if( records[i].data.list == 'done' )
				                   r.push( this.prepareData(records[i].data, 0, records[i]) );
				    	   }
				           return r;
				       },
				       itemTpl: new Ext.XTemplate('{desc}')
				   }, {
					   dock: 'bottom',
					   html: 'create'
				   }]
			   },
			]
		}
		
		Ext.apply(this, config);
		App.View.Viewport.superclass.initComponent.call(this);
		
		this.store.on(
			'datachanged',
			function() {
				console.log('[View] store.on.datachanged');
			},
			this
		);
	}
});

Ext.reg('App.View.Viewport', App.View.Viewport);
