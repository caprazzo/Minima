Ext.ns('App.View');

App.View.Viewport = Ext.extend(Ext.Panel, {
	id        : 'viewport',
	layout    : 'card',
	fullscreen: true,


	initComponent: function(options) {
		console.log('[View.Viewport] initComponent', this.store);
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
				   }, {
					   dock: 'bottom',
					   html: 'create'
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