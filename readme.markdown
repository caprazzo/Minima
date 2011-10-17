# Minima
Minima is a to-do list board in the spirit of pivotaltracker and trello.

### Features:

* can create, update, sort and move around cards between lists
* live updates: all connected browsers are updated (well, only browsers with websockets)
* standalone java server and embedded database: get up and running in seconds


### Un-features (things you may expect but that are not there):

* no multiple board support: each instance has only one board
* no multiple lists support: only 'todo', 'doing', 'done' 
* no authentication & security: all viewers can update your board
 
### Getting started
1. Download the latest jar from ...
2. java -jar minima-1.0-with-dependencies.jar
3. http://localhost:8989/index

![screenshot](/path/img.jpg "Minima Screenshot")