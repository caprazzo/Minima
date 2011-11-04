# Minima
Minima is a to-do list board in the spirit of pivotaltracker and trello. Minima is a standalone server that you can run on your host.

Try the [online demo](http://minima.caprazzi.net/demo/ "Minima live demo")

Peek at [this project board](http://minima.caprazzi.net/minima/ "Minima project board") (read only) 

Screenshot:

![screenshot](https://github.com/mcaprari/Minima/raw/master/screenshots/screenshot-minima-0.8.png "Minima Screenshot")

### Features:

* create, edit and rearrange notes between lists
* edit list names
* live updates: all connected browsers are updated
* desktop notifications (supported browsers only)
* password protection - same password for all users (see configuration below to enable)
* optional readonly view for access without password (see configuration below to enable)
* standalone java server and embedded database: get up and running in seconds

## For users
 
### Install and run
1. Download the [latest jar](https://github.com/downloads/mcaprari/Minima/Minima-0.8-standalone.jar)
2. java -jar Minima-0.8-standalone.jar (or doubleclick)
3. browse to http://localhost:8989/index

### Configuration

All configurations are optional

* -Dminima.port=8989 - http port, defaults to 8989
* -Dminima.db.dir=./minima-db - database directory, defaults to ./minima-db and is created if it does not exist
* -Dminima.board.default.title=Minima - default board title (as shown on the index page). Defaults to "Minima"
* -Dminima.password="" - password to protect this minima instance. By default there is no password and the board is open to all
* -Dminima.readonly=false - if this is set to true and a password is configured, non-authenticated users can see but not modify the board
* -Dminima.websocket.location=auto - explicit the websocket url. This allows to use the main app trough a proxy that does not support
	websockets, but send websocket connections directly to minima. Default to "auto" which should do the right thing for non-proxied minima instances

## For developers

### Eclipse setup

1. clone project from github
2. mvn eclipse:eclipse
3. file -> import -> existing projects...

### Build and run (maven)

1. mvn assembly:assembly
2. java -jar target/minima-0.8-jar-with-dependencies.jar

## Changelog

### V 0.8 - 03 November 2011

* board can be protected by password
* protected boards can be made available in readonly mode
* list name can be edited
* now using backbone.js and underscore.js templates
* optionally configure webapp root 
* websockets friendly with proxies

### V 0.7 - 26 October 2011

* push updates on non-websocket browsers (using long polling)
* User interface scales with window size 
* Support for desktop notifications (HTML 5, supported browsers only)

### V 0.6 - 23 October 2011

* Refined user interface (simpler)
* Highlighting #hash tags and @at tags
* (Moved lists definition on server)
* (Changed database format on database + automatic upgrade)

### V 0.5 - 18 October 2011
 
* Add, create, archive cards
* All changes are pushed to all clients (WebSockets only)
* Http API
* All data stored as plain text files using Keez/KeezFileDb
* Web ui built with jquery and custom javascript

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

