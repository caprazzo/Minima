# Minima
Minima is a to-do list board in the spirit of pivotaltracker and trello. Minima is a standalone server that you can run on your host.

![screenshot](https://github.com/mcaprari/Minima/raw/master/screenshot-minima-0.5.png "Minima Screenshot")

### Features:

* can create, update, sort and move around cards between lists
* live updates: all connected browsers are updated (well, only browsers with websockets)
* standalone java server and embedded database: get up and running in seconds


### Un-features (things you may expect but that are not there):

* no multiple board support: each instance has only one board
* no multiple lists support: only 'todo', 'doing', 'done' 
* no authentication & security: all viewers can update your board

## For users
 
### Install and run
1. Download the latest jar from ...
2. java -jar minima-1.0-with-dependencies.jar
3. http://localhost:8989/index

## For developers

### Eclipse setup

1. clone project from github
2. mvn eclipse:eclipse
3. file -> import -> existing projects...

### Building

1. mvn assembly:assembly
2. java -jar target/minima-0.5-jar-with-dependencies.jar

## Changelog

### V 0.5 18 October 2011
 
* Add, create, archive cards
* All changes are pushed to all clients (WebSockets only)
* Http API
* All data stored as plain text files using Keez/KeezFileDb
* Web ui built with jquery and custom javascript

### Http Api

## v 0.5

Story object:

{
"id": string, // unique id for this story
"revision": int, // revision number
"desc": string // body of the story
"list": string // id of the list
"archived": boolean // if this story is archived
"pos": decimal // position of this story relative to others in the same list 
}

### get all stories

GET /data/stories

{"stories": [{ story }, { story }, ...]}

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
Returns the updated story, with revision number incremented by one