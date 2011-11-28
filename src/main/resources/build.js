{
	"libs": [
		"/htdocs/js/lib/jquery-1.6.4.min.js",
		"/htdocs/js/lib/jquery-ui-1.8.16.min.js",
		"/htdocs/js/lib/underscore-1.2.1.min.js",
		"/htdocs/js/lib/backbone-0.5.3.min.js",
		"/htdocs/js/lib/json2.js",
		"/htdocs/js/lib/expanding.js"
	],
				
	"main": [
	    "/htdocs/js/model/AppModel.js",
		"/htdocs/js/model/FilteredCollection.js",
		"/htdocs/js/model/ListModel.js",
		"/htdocs/js/model/NoteModel.js",
		"/htdocs/js/model/ListCollection.js",
		"/htdocs/js/model/NoteCollection.js",
		"/htdocs/js/model/NotificationsCtrlModel.js",
		
		
		
		"/htdocs/js/view/AlertArchivedView.js",
		
		"/htdocs/js/view/ListView.js",
		"/htdocs/js/view/ListNameView.js",
		"/htdocs/js/view/ListCreateView.js",
		"/htdocs/js/view/ListCollectionView.js",
		"/htdocs/js/view/ListCreateView.js",
		"/htdocs/js/view/NoteView.js",
		"/htdocs/js/view/NoteEditView.js",
		"/htdocs/js/view/NoteCollectionView.js",
		"/htdocs/js/view/NotificationsCtrlView.js",
		"/htdocs/js/view/AlertsView.js",
		
		"/htdocs/js/Minima.js",	 
		"/htdocs/js/MinimaClient.js",
		"/htdocs/js/view/Templates.js",
		"/htdocs/js/view/AppView.js",
		"/htdocs/js/index.js"	
	],
	
	"css": [
		"/htdocs/js/lib/bootstrap-1.4.0.min.css",
		"/htdocs/css/app.css",
		"/htdocs/css/list.css",
		"/htdocs/css/note.css",
		"/htdocs/css/notify.css"
	],
	
	"templates": [
	    "templates/list-create.html",
	    "templates/list-name.html",
	    "templates/list.html",
	    "templates/note.html",
	    "templates/notify.html",
	    "templates/app.html",
	    "templates/alert-archived.html",
	    "templates/alert-readonly.html",
	    "templates/alerts.html"
	    
	],
	
	"pages": {
	    "index": "index.html",
	    "login": "login.html"
	} 
}