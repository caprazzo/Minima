function ViewModelList(model) {
	this.model = model;
	this.storyVms = {};
	this.refresh();
}

/**
 * fires every time the underlying model is updated
 */
ViewModelList.prototype.onUpdate = function(fn, ctx) {
	this.onUpdateHandler = Minima.bindEvent(this.onUpdateHandler, fn, ctx);
}

ViewModelList.prototype.fireUpdate = function() {
	Minima.fireEvent(this.onUpdateHandler, this);
}

ViewModelList.fromModel = function(listModel) {
	return new ViewModelList(listModel);
}

ViewModelList.prototype.setModel = function(listModel) {
	this.model = listModel;
	this.refresh();
}

ViewModelList.prototype.refresh = function() {
	// create viewmodels for all models that do not have one
	var vm = this;
	$.each(this.model.getStories(), function(idx, storyModel) {
		if (!vm.storyVms[storyModel.getId()]) {
			vm.storyVms[storyModel.getId()] = new ViewModelStory(storyModel);
		}
	});
	this.fireUpdate();
}

ViewModelList.prototype.getName = function() {
	return this.model.getName();
}

ViewModelList.prototype.getId = function() {
	return 'listVm-' + this.model.getId();
}

ViewModelList.prototype.getStories = function() {
	return $.map(this.storyVms, function(el) { 
		return el; 
	});
}

ViewModelList.prototype.createStory = function(text) {
	console.log('[ViewModelList] add story', this.getId(),  text);
	var storyModel = ModelStory.newStory(this.model.getId(), text);
	this.model.addStory(storyModel);
	Minima.fireCreateStory(storyModel);
}
