function BoardViewModel() {
	this.boardModel = null;
	this.listVms = [];
}

// sets a new model. wipes all existing models
BoardViewModel.prototype.setModel = function(boardModel) {
	this.boardModel = boardModel;
	
	var vm = this;
	$.each(this.boardModel.getLists(), function(idx, listModel) {
		var storyModel = ViewModelList.fromModel(listModel);
		vm.listVms.push(storyModel);
	});
	
	this.fireUpdate();
}

/**
 * fires every time the underlying model is updated
 */
BoardViewModel.prototype.onUpdate = function(fn, ctx) {
	this.fireOnUpdateHandler = Minima.bindEvent(this.fireOnUpdateHandler, fn, ctx);
}

BoardViewModel.prototype.fireUpdate = function() {
	Minima.fireEvent(this.fireOnUpdateHandler, this);
}

/** setters **/
BoardViewModel.prototype.setName = function(name) {
	this.boardModel.setName(name);
	this.fireUpdate();
}

/** getters **/

BoardViewModel.prototype.getName = function() {
	return this.boardModel.getName();
}

BoardViewModel.prototype.getLists = function() {
	return this.listVms;
}