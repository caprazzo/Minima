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