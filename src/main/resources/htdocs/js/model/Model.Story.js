function ModelStory() {
	this.desc = null;
	this.id = null
	this.pos = null
	this.rev = null;
	this.list_id = null;
	this.archived = null;
}

ModelStory.newStory = function(list_id, text, pos) {
	var story = new ModelStory();
	story.setListId(list_id);
	story.setDesc(text);
	story.setId(Minima.makeId());
	story.setPos(pos);
	return story;
}

ModelStory.prototype.asObject = function() {
	return {
		id: this.id,
		pos: this.pos,
		desc: this.desc,
		revision: this.rev,
		list: this.list_id,
		archived: this.archived
	}
}

ModelStory.initialPos = function() {
	return 65536;
}

ModelStory.fromObject = function(story_obj) {
	var story = new ModelStory();
	story.setId(story_obj.id);
	story.setListId(story_obj.list);
	story.setDesc(story_obj.desc);
	story.setPos(story_obj.pos);
	story.setRevision(story_obj.revision);
	story.setArchived(story_obj.archived);
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
ModelStory.prototype.getRevision = function() {
	return this.rev;
}
ModelStory.prototype.incrementRevision = function() {
	this.rev += 1;
}

ModelStory.prototype.diff = function(other) {
	var diff = {};
	if (other.getId() != this.getId()) {
		throw 'Trying to diff two listModel with different ids';
	}
	
	diff['desc'] = (other.getDesc() != this.getDesc());
	diff['pos'] = (other.getPos() != this.getPos());

	return diff;
}

ModelStory.prototype.reposition = function(prevModel, nextModel) {
	console.log('[ModelStory:' + this.id +']', 'reposition between', prevModel, 'and', nextModel);
	
	// this is the only item in its list
	if (prevModel == null && nextModel == null) {
		this.setPos(ModelStory.initialPos());
		return;
	}
	
	if (prevModel == null) {
		this.setPos(nextModel.getPos() / 2);
		return;
	}
	
	if (nextModel == null) {
		this.setPos(prevModel.getPos() + 65536);
		return;
	}
	
	this.setPos(prevModel.getPos() + (nextModel.getPos() - prevModel.getPos())/2);
}

ModelStory.prototype.isBefore = function(other) {
	return this.getPos() < other.getPos();
}

ModelStory.prototype.setArchived = function(archived) {
	this.archived = archived;
}

ModelStory.prototype.getArchived = function() {
	return this.archived;
}
