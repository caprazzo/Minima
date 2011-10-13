function ModelList() {
	this.name = null;
	this.id = null;
	this.stories = {};
}

ModelList.fromJson = function(json_list) {
	var list = new ModelList();
	list.setName(json_list.name);
	list.setId(json_list.id);
	return list;
}

ModelList.prototype.addStory = function(story) {
	console.log('[ModelList] addStory', this.getId(), story);
	this.stories[story.getId()] = story;
}

ModelList.prototype.getStories = function() {
	return $.map(this.stories, function(el) { return el; });
}

ModelList.prototype.setName = function(name) {
	this.name = name;
}

ModelList.prototype.getName = function() {
	return this.name;
}

ModelList.prototype.setId = function(id) {
	this.id = id;
}

ModelList.prototype.getId = function() {
	return this.id;
}

ModelList.prototype.diff = function(other) {
	var diff = {};
	if (other.getId() != this.getId()) {
		throw 'Trying to diff two listModel with different ids';
	}
	
	diff['name'] = (other.getName() != this.getName());

	return diff;
}