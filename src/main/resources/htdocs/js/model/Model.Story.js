function ModelStory() {
	this.desc = null;
	this.id = null
	this.pos = null
	this.rev = null;
	this.list_id = null;
}

ModelStory.newStory = function(list_id, text) {
	var story = new ModelStory();
	story.setListId(list_id);
	story.setDesc(text);
	story.setId(Minima.makeId());
	return story;
}

ModelStory.fromJson = function(json_story) {
	var story = new ModelStory();
	story.setId(json_story.id);
	story.setListId(json_story.list);
	story.setDesc(json_story.desc);
	story.setPos(json_story.pos);
	story.setRevision(json_story.revision);
	return story;
}

ModelStory.prototype.getId = function() {
	return this.id;
}

ModelStory.prototype.getDesc = function() {
	return this.desc;
}

ModelStory.prototype.setId = function(id) {
	this.id = id;
}
ModelStory.prototype.setDesc = function(desc) {
	this.desc = desc;
}
ModelStory.prototype.setListId = function(list_id) {
	this.list_id = list_id;
}
ModelStory.prototype.getListId = function() {
	return this.list_id;
}
ModelStory.prototype.setPos = function(pos) {
	this.pos = pos;
}
ModelStory.prototype.getPos = function(pos) {
	return this.pos;
}
ModelStory.prototype.setRevision = function(rev) {
	this.rev = rev;
}

ModelStory.prototype.diff = function(other) {
	var diff = {};
	if (other.getId() != this.getId()) {
		throw 'Trying to diff two listModel with different ids';
	}
	
	diff['desc'] = (other.getDesc() != this.getDesc());

	return diff;
}

ModelStory.prototype.isBefore = function(other) {
	return this.getPos() < other.getPos();
}

