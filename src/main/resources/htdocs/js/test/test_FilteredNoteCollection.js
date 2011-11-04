$(function() {
	
	function assert(val) {
		return (val) ? 'SUCCESS' : 'FAIL';
	}
	
	console.log('hello');
	
	var notes = null;
	var todo = null;
	function setup() {
		notes = new NoteCollection([
    	    {
    	    	id: 'n1',
    	    	desc: 'note1',
    	    	archived: false,
    	    	list: 'todo',
    	    	pos: 65536
    	    },
    	    {
    	    	id: 'n2',
    	    	desc: 'note2',
    	    	archived: false,
    	    	list: 'doing',
    	    	pos: 65536
    	    },
    	    {
    	    	id: 'n3',
    	    	desc: 'note3',
    	    	archived: false,
    	    	list: 'done',
    	    	pos: 65536
    	    }
    	]);
		
		todo = new FilteredCollection([], { 
			parent: notes, 
			filter: function(note) {
				return note.get('list') == 'todo'; 
			}
		});
		todo.comparator = function(note) {
			return note.get('pos');
		}
	}
	
	
	function trapEvent(collection, eventName) {
		var result = { model: null, fired: 0 };
		var trap = function(model) {
			result.fired += 1;
			result.model = model;
		}
		result.clear = function() {
			collection.unbind(eventName, trap);
		}
		collection.bind(eventName, trap);
		return result;
	}
	
	setup();
	// test initial elements are filtered correctly
	console.log( !!todo.get('n1') );
	console.log( !todo.get('n2') );
	console.log( !todo.get('n3') );	
	
	setup();
	// add a note that matches the filter
	var added = trapEvent(todo, 'add');
	var changed = trapEvent(todo, 'changed');
	var removed = trapEvent(todo, 'remove');
	notes.add({ id: 'n4', desc: 'note4', archived: false, list: 'todo', pos: 123456789});	
	console.log( !!todo.get('n4') );
	console.log( added.fired == 1 );
	console.log( added.model.id == 'n4' );
	console.log( !changed.fired );
	console.log( removed.fired == 0);
	added.clear();
	changed.clear();
	
	setup();
	// add a note that does not match the filter
	var added = trapEvent(todo, 'add');
	var changed = trapEvent(todo, 'changed');
	var removed = trapEvent(todo, 'remove');
	notes.add({ id: 'n4', desc: 'note4', archived: false, list: 'boing', pos: 123456789});	
	console.log( !todo.get('n4') );
	console.log( added.fired == 0 );
	console.log( changed.fired == 0 );
	console.log( removed.fired == 0);
	added.clear();
	changed.clear();
	
	setup();
	// remove a note in the filter
	var removed = trapEvent(todo, 'remove');
	var added = trapEvent(todo, 'add');
	var removed = trapEvent(todo, 'remove');
	notes.remove(notes.get('n1'));	
	console.log( !todo.get('n1') );
	console.log( removed.fired == 1);
	console.log( removed.model.id == 'n1' );
	console.log( added.fired == 0);
	removed.clear();
	added.clear();
	
	setup();
	// remove a note not in the filter
	var removed = trapEvent(todo, 'remove');
	var added = trapEvent(todo, 'add');
	var changed = trapEvent(todo, 'change');
	notes.remove(notes.get('n2'));	
	console.log( !todo.get('n2') );
	console.log( removed.fired == 0);
	console.log( added.fired == 0);
	console.log( changed.fired == 0);
	console.log( added.fired == 0);
	removed.clear();
	added.clear();
	
	setup();
	// change a note so it enters the filter
	var changed = trapEvent(todo, 'change');
	var added = trapEvent(todo, 'add');
	var removed = trapEvent(todo, 'remove');
	notes.get('n2').set({list: 'todo'});
	console.log( !!todo.get('n2') );
	console.log( changed.fired == 0);
	console.log( added.fired == 1);
	console.log( removed.fired == 0);
	changed.clear();
	added.clear();
	
	setup();
	// change a note so it fails the filter
	var changed = trapEvent(todo, 'change');
	var removed = trapEvent(todo, 'remove');
	var added = trapEvent(todo, 'add');
	notes.get('n1').set({list: 'doing'});
	console.log( !todo.get('n1'));
	console.log( changed.fired == 0);
	console.log( removed.fired == 1);
	console.log( added.fired == 0);
	changed.clear;
	removed.clear();
	
	setup();
	// change a note in a way that should not affect the filtered list
	var changed = trapEvent(todo, 'change');
	var removed = trapEvent(todo, 'remove');
	var added = trapEvent(todo, 'add');
	notes.get('n3').set({list: 'doing'});
	console.log( !todo.get('n3'));
	console.log( changed.fired == 0);
	console.log( removed.fired == 0);
	console.log( added.fired == 0);
	changed.clear;
	removed.clear();
	added.clear();
	
	setup();
	// change a note in the filtered list
	var changed = trapEvent(todo, 'change');
	var removed = trapEvent(todo, 'remove');
	var added = trapEvent(todo, 'remove');
	var sort = trapEvent(todo, 'sort');
	notes.get('n1').set({desc: "new desc"});
	console.log( !!todo.get('n1') );
	console.log( changed.fired == 1);
	console.log( changed.model.id == 'n1');
	console.log( removed.fired == 0);
	console.log( added.fired == 0);
	console.log( sort.fired == 0);
	
	
	setup();
	// change the order of a note
	notes.add({ id: 'n4', desc: 'note4', archived: false, list: 'todo', pos: 123456789});
	var changed = trapEvent(todo, 'change');
	var removed = trapEvent(todo, 'remove');
	var added = trapEvent(todo, 'remove');
	var sort = trapEvent(todo, 'sort');
	var reset = trapEvent(todo, 'reset');
	
	var before = todo.pluck('id').join(':')	
	notes.get('n4').set({pos: 15});
	var after = todo.pluck('id').join(':');
	console.log(before != after);
	
	console.log( changed.fired == 1);
	console.log( added.fired == 0);
	console.log( removed.fired == 0);
	console.log( sort.fired == 1);
	console.log( reset.fired == 0);
});