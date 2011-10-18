# Minima
Minima is a to-do list board in the spirit of pivotaltracker and trello.

![screenshot](https://github.com/mcaprari/Minima/raw/master/screenshot-minima-0.5.png "Minima Screenshot")

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

## For developers

### Eclipse setup

1. clone project from github
2. mvn eclipse:eclipse
3. file -> import -> existing projects...

### Building

1. mvn assembly:assembly
2. java -jar target/minima-0.5-jar-with-dependencies.jar
