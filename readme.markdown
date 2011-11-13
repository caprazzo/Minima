# Minima
Minima is a to-do list board in the spirit of pivotaltracker and trello. Minima is a standalone server that you can run on your host.

Try the [online demo](http://minima.caprazzi.net/demo/ "Minima live demo")

Peek at [this project board](http://minima.caprazzi.net/minima/ "Minima project board") (read only) 

Screenshot:

![screenshot](https://github.com/mcaprari/Minima/raw/master/screenshots/screenshot-minima-0.9.png "Minima Screenshot")

### Features:

* add, edit and drag notes between lists
* add, edit and rearrange lists
* live updates: all connected browsers are updated
* desktop notifications (supported browsers only)
* password protection - same password for all users (see configuration below to enable)
* optional readonly view for access without password (see configuration below to enable)
* standalone java server and embedded database: get up and running in seconds

## For users
 
### Install and run
1. Download the [latest jar](https://github.com/downloads/mcaprari/Minima/Minima-0.9-standalone.jar)
2. java -jar Minima-0.9-standalone.jar (or doubleclick)
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
2. java -jar target/Minima-0.9-standalone.jar

### Notes

Options to /index

* ?devel: js and css files will be oaded separately and with all cacheing disabled
* ?readonly: the ui be rendered as if in readonly mode

## Changelog

### V 0.9 - 12 November 2011

* lists can be added, archived and rearranged
* using backbone.js
* css and javascript files are served rolled up by default

### V 0.8 - 04 November 2011

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

