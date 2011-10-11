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
				    				   
				    				  
				    				   
				    				   (function() {
			    						   	var node = nodes[i];
			    						   	var record = list.getRecord(node);
			    				   			console.log('making record droppable', record.data.desc);
			    				   			
			    				   			var d = new Ext.util.Draggable(node, {
					    					   revert: true,
					    					   node: node,
					    					   listeners: {
					    						   drop: function(droppable, draggable, e) {
					    							   console.log('item dropped', dropped, draggable, e);
					    						   }
					    					   }
			    				   			});   
			    				   		 
					    				   new Ext.util.Droppable(node, {
					    					   listeners: {
					    						   drop: function(droppable, draggable, e) {
					    							   //console.log('droped record', droppable, draggable, e);
					    						   },
					    						   dropenter: function(droppable, draggable, e) {
					    							   var node = draggable.node;
					    							   var source = list.getRecord(node);
					    							   that.store.remove(source);
					    							   source.data.pos = record.data.pos / 2;
					    							   that.store.insert(0, source);
					    							   console.log('drop-enter', source.data.desc, 'target: ', record.data.desc);
					    						   },
					    						   dropleave: function(droppable, draggable, e) {
					    							   var node = draggable.node;
					    							   var source = list.getRecord(node);
					    							   console.log('drop-leave', source.data.desc, 'target: ', record.data.desc);
					    						   }
					    					   }
					    				   });
				    				   })();
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