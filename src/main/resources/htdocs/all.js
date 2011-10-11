
//./js/index.js

(function() {
  Ext.override(Ext.data.Store, {
    onProxyWrite: function(operation) {
      var data     = this.data,
        action   = operation.action,
        records  = operation.getRecords(),
        length   = records.length,
        callback = operation.callback,
        record, i;

      if (operation.wasSuccessful()) {
        if (action == 'create' || action == 'update') {
          for (i = 0; i < length; i++) {
            record = records[i];

            record.phantom = false;
            record.join(this);
            if(action == 'create') {
              var old = data.findBy(function(item) { return item.phantom == true});
              data.replace(old.internalId, record);
            } else {
              data.replace(record);
            }
          }
        }

        else if (action == 'destroy') {
          for (i = 0; i < length; i++) {
            record = records[i];

            record.unjoin(this);
            data.remove(record);
          }

          this.removed = [];
        }

        this.fireEvent('datachanged');
      }


      if (typeof callback == 'function') {
          callback.call(operation.scope || this, records, operation, operation.wasSuccessful());
      }
    }
  });
})();

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
		},
		{
			name: 'pos',
			type: 'number'
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
			autoSave: true,
			
			sorters: [
			    {
			    	property: 'pos',
			    	direction: 'ASC'
			    }
			],
			
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
				       scroll: false,
				       singleSelect: true,
				       store: this.store,
				       itemSelector: 'div.item',
				       droppable: true,
				       collectData: function(records, startIndex) {
				    	   var r = [];
				    	   for( var i=0; i<records.length; i++ ) {
				               if( records[i].data.list == 'todo' )
				                   r.push( this.prepareData(records[i].data, 0, records[i]) );
				    	   }
				           return r;
				       },
				       itemTpl: new Ext.XTemplate('<tpl for="."><div class="around-item"><div class="item">{desc}</div></div></tpl>'),
				       listeners: {
				    	   update: function(e) {
				    		   var list = that.query('#todoList')[0];
				    		   //console.log('after render', list.el, e.getNodes());
				    		   
				    		   /*
				    		   new Ext.util.Droppable(list.el.id , {
				    			   listeners: { 
				    				   drop: function(droppable, draggable, ev) {
				    					   console.log('dropped item in list', droppable, draggable);
				    				   },
				    				   dropenter: function(droppable, draggable, ev) {
				    					   console.log('entering drop on list', droppable, draggable);
				    				   }
				    			   }
				    		   });
				    		   */
				    		   var nodes = e.getNodes();
				    		   if (nodes) {
				    			   for(var i=0; i<nodes.length; i++) {
				    				   
				    				   var d = new Ext.util.Draggable(nodes[i], {
				    					   revert: true,
				    					   listeners: {
				    						   drop: function(droppable, draggable, e) {
				    							   console.log('item dropped', dropped, draggable, e);
				    						   }
				    					   }
				    				   });   
				    				   
				    				   
				    				   var node = nodes[i];
				    				   var record = list.getRecord(node);
				    				   new Ext.util.Droppable(nodes[i], {
				    					   listeners: {
				    						   drop: function(droppable, draggable, e) {
				    							   console.log('droped over item', droppable, draggable, e);
				    						   },
				    						   dropenter: function(droppable, draggable, e) {
				    							   console.log('drop-enter', { node: node, record: record, droppable: droppable, draggable: draggable, event:e});
				    							   if (droppable == node)
				    								   return;
				    							   droppable.el.setHeight(droppable.el.getHeight() + draggable.el.getHeight());
				    						   },
				    						   dropleave: function(droppable, draggable, e) {
				    							   console.log('dropleave on item', droppable, draggable, e);
				    							   if (droppable == node)
				    								   return;
				    							   droppable.el.setHeight(droppable.el.getHeight() - draggable.el.getHeight());
				    						   }
				    					   }
				    				   });
				    			   }
				    		   }
				    	   }
				       }
				   }, 
				   {
					   xtype: 'textareafield',
		               itemId: 'txt-new-story-todo',
		               hidden: true,
		               listeners: {
		            	   blur: function(el, ev) {
		            		   console.log('blur', ev.target.value);
		            	   },
		            	   keyup: function(el, ev) {
		            		   //console.log('keyup', ev, ev.browserEvent.keyCode);		            		   
		            		   if (ev.browserEvent.keyCode == 13) {
		            			   console.log('submit', ev.target.value);
		            			   
		            			   // get last value in store
		            			   var lastStory = that.store.last();
		            			   var startPos = (lastStory) ? lastStory.data.pos : 0; 
		            			   var pos = startPos + 65536;
		            			   
		            			   console.log('loaded last story', lastStory);
		            			   var newStory = {
		            			      desc: Ext.util.Format.trim(ev.target.value),
		            			      list: 'todo',
		            			      pos: pos
		            			   }
		            			   
		            			   that.store.add(newStory);
		            			   that.store.sync();
		            			   var input = that.query('#txt-new-story-todo')[0];
		            			   input.hide();
		            			   input.reset();
		            			   var btn = that.query('#btn-create-todo')[0];
		            			   btn.show();
		            			   btn.enable();
		            		   }
		            	   }
		               }
				   },
				   {					 
					   xtype: 'button',
					   itemId: 'btn-create-todo',
					   text: 'create',
					   handler: function(el) {
						   el.hide();
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
				       itemId: 'doingList',
				       droppable: true,
				       store: this.store,
				       itemSelector: 'foo.bar',
				       droppable: true,
				       collectData: function(records, startIndex) {
				    	   var r = [];
				    	   for( var i=0; i<records.length; i++ ) {
				               if( records[i].data.list == 'doing' )
				                   r.push( this.prepareData(records[i].data, 0, records[i]) );
				    	   }
				           return r;
				       },
				       itemTpl: new Ext.XTemplate('{desc}'),
				       listeners: {
				    	   drop: function(droppable, draggable, e) {
				    		   console.log('dropped', dropped, draggable, e);
				    	   }
				       }
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
				       itemId: 'doneList',
				       droppable: true,
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
				       ,
				       listeners: {
				    	   drop: function(droppable, draggable, e) {
				    		   console.log('dropped', dropped, draggable, e);
				    	   }
				       }
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
