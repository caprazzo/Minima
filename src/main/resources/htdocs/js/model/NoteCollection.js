// this is the container for all the notes
NoteCollection = Backbone.Collection.extend({
	model: Note,
	comparator: function(note) {
		return note.get('pos');
	}
});