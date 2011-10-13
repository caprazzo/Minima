function ViewModelStory(model) {
	this.model = model;
}

ViewModelStory.fromText = function(text) {
	return new ViewModelStory(ModelStory.fromText(text));
}

ViewModelStory.prototype.getId = function() {
	return this.model.getId();
}

ViewModelStory.prototype.getDesc = function() {
	return this.model.getDesc();
}