$(function() {
	console.log('[Index] ready');
	var client = new MinimaClient();
	var store = new MinimaStore();
	var view = new ViewBoard({ content_matcher: '#content'});
	var controller = new MinimaController({
		client: client,
		store: store, 
		view: view
	});
	controller.start();
});