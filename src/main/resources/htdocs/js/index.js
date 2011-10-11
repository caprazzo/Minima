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
			
			if ('list-' + item_val.list == list_id) {
				// new absolute position in ui
				var new_position = ui.item.index();
				// old absolute position in ui
				var old_position = lists[item_val.list][item_val.id].abs_pos;
				
				var item_replaced = lists[item_val.list].items[item_abs_position];
				console.log(list_id,' on.update', list_id, item_val.desc, 'moved from ', old_position, 'to', new_position);
			}
		}
	});
	
	
	$.getJSON('/data/stories', function(data) {
		
		// distribute items to the relevant lists
		$.each(data.stories, function(key, val) {			
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
	});
	
});
