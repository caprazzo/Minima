$(function() {
	

	
	
	var stories = {};
	
	var lists = {
		todo: {
			el: $('#list-todo'),
			items: {}
		},
		doing: {
			el: $('#list-doing'),
			items: {}
		},
		done: {
			el: $('#list-done'),
			items: {}
		}
	}
	
	$('.ui-list').sortable({
		placeholder: "ui-state-highlight", 
		connectWith:'.ui-list',
		update: function(event, ui) {
			var list_id = event.target.id;
			var item_id = event.srcElement.id;
			var item_val = stories[item_id];
			var num_items = ui.item.parent().children().length;
			
			if ('list-' + item_val.list == list_id) {
				// new absolute position in ui
				var new_position = ui.item.index();
				// old absolute position in ui
				var old_position = lists[item_val.list].items[item_val.id].abs_pos;
				
				console.log(list_id,' on.update', item_val.desc, ' moved from ', old_position, 'to', new_position);
				// item is in between other two items
				
				if (new_position == old_position) {
					console.log('item remained in same position'); // event should not fire
					return;
				}
				
				if (new_position > 0 && new_position < num_items-1) {
					
					var previous_item = ui.item.parent().children().get(new_position -1 );
					var previous_item_val = stories[previous_item.id];
					var next_item = ui.item.parent().children().get(new_position +1 );
					var next_item_val = stories[next_item.id];										
					var new_pos = previous_item_val.pos + ((next_item_val.pos - previous_item_val.pos) / 2);
					console.log(list_id, ' on.update ', item_val.desc, 'is between items', previous_item_val, next_item_val, 'new pos', new_pos);
					
					// send update to server
					var updated_story = item_val;
					updated_story.pos = new_pos;
					$.ajax({
						type: 'PUT',
						url: '/data/stories/' + item_val.id + '/' + item_val.revision,
						contentType: 'application/json',
						data: JSON.stringify(updated_story),
						dataType: 'json',
						processData: false,
						success: function(data) {
							console.log('received back', data);	
						}
					});
				}
				else if (new_position == 0) {
					var next_item = ui.item.parent().children().get(new_position +1 );
					var next_item_val = stories[next_item.id];
					var new_pos = next_item_val.pos / 2;
					console.log(list_id, ' on.update ', item_val.desc, 'is first');
				}
				else if (new_position == num_items-1) {
					console.log(list_id, ' on.update ', item_val.desc, 'is last');
				}
				
				//var item_replaced = lists[item_val.list].items[item_abs_position];
				
			}
		}
	});
	
	function Minima() {
		this.board = {
			lists: {},
			stories: {}
		};

		this.ui = {
			idx: {
				data_id: {},
				html_id: {}
			}
			lists: {},
			stories: {}
		};
		
		this.id_to_el_map = {};
		this.el_to_id_map = {};
	}
	
	Minima.prototype.receiveBoard = function(board) {
		console.log('[Minima] receiveBoard', board);
		this.receiveLists(board.lists);
		this.receiveStories(board.stories);
		console.log('[Minima] received board', this.data);
		this.doLayout();
	}
	
	Minima.prototype.receiveLists = function(lists) {
		console.log('[Minima] receiveLists', lists);
		var that = this;
		$.each(lists, function(idx, list) {
			that.board.lists[list.id] = list;
		});
	}
	
	Minima.prototype.receiveStories = function(stories) {
		console.log('[Minima] receiveStories', stories);
		var that = this;
		$.each(stories, function(idx, story) {
			that.board.stories[story.id] = story;
		});
	}
	
	Minima.prototype.doLayout = function() {
		console.log('[Minima] doLayout');
		// create list containers if missing
		// already created in html (lists are static)
		$.each(this.board.lists, function(key, story) {
			var html_id = 'list-' + story.id;
			this.ui.idx.data_id[story.id] = html_id;
			this.ui.idx.html_id[html_id] = story.id;
			var el = $('#list-' + story.id);
			this.ui.lists[story.id] = { el: el };
		});		
	}		
	
	var minima = new Minima();
	
	// lists are static for now, but Minima need not know that
	var staticLists = [ { name: 'todo', id: 'todo', pos:65536 }, { name: 'doing', id: 'doing', pos:131072 }, { name: 'done', id: 'done', pos:196608 }];
	$.getJSON('/data/stories', function(data) {
		data.lists = staticLists;
		minima.receiveBoard(data);				
	});
	
	
	function receiveAllLists(lists) {
		$.each(lists, function(idx, val) {
			
		});
	}
	
	function receiveAllStories(stories) {
		
		// distribute items to the relevant lists
		$.each(stories, function(key, val) {			
			lists[val.list].items[val.id] = {
				abs_pos: -1,
				data: val
			};
		});
		
		var sorter = function(a, b) {
			return a.data.pos - b.data.pos;
		}
		// sort all items in list using data.pos
		$.each(lists, function(list, val) {
			console.log('preparing list', list);
			
			var items_sorted = $.map(lists[list].items, function(element) {
				return element;
			}).sort(sorter);
			
			// update the relative positions of each item
			// and render each item
			$.each(items_sorted, function(idx, item) {
				item.abs_pos = idx;				
				var story = item.data;
				
				var htmlId = 'story-' + story.id;
				stories[htmlId] = story;
				console.log(story);
				$('<li>').html(story.desc).attr('id', htmlId).appendTo(lists[list].el);
			});
		});
	
		console.log('lists prepared', lists);
	}
	
	
	
});
