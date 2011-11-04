### Http Api V 0.6

Story object:

	{
		"id": string, // unique id for this story
		"revision": int, // revision number
		"desc": string // body of the story
		"list": string // id of the list
		"archived": boolean // if this story is archived
		"pos": decimal // position of this story relative to others in the same list 
	}

List object:

	{
		"id": string, // unique id for this list
		"name": string // name for this list
		"pos": decimal // position of this list relative to others in the same board
	} 

### get all stories

GET /data/stories

	{
		"stories": [
			{ story }, 
			{ story }, 
			...
		],
		"lists": [
			{ list },
			{ list }
		]
	}

### create story

POST /data/stories/<story.id>

contentType: application/json

body: { story } // the story must have the id and revision 0

Returns 

	201 if create succesful
		body: the created story, with revision number 1
		
	400 if the story was not created ( bad json or id exists)
	
	500 any other error 

### update story

PUT /data/stories/<story.id>/<story.revision>

contentType: application/json

body: { story }

	201 if update successfull
		body: the updated story with revision number incremented by 1
		
	409 if the update failed for a conflict (found a newer revision for the same id),
		body: the conflicting story
		
	400 if the update fails for malformed json
	
	500 any other error

