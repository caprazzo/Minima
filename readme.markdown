# Minima
Minima is a to-do list board in the spirit of pivotaltracker and trello. Minima is a standalone server that you can run on your host.

![screenshot](https://github.com/mcaprari/Minima/raw/master/screenshot-minima-0.5.png "Minima Screenshot")

### Features:

* can create, update, sort and move around cards between lists
* live updates: all connected browsers are updated (well, only browsers with websockets)
* standalone java server and embedded database: get up and running in seconds

## For users
 
### Install and run
1. Download the latest jar from ...
2. java -jar minima-0.5-with-dependencies.jar
3. http://localhost:8989/index

## For developers

### Eclipse setup

1. clone project from github
2. mvn eclipse:eclipse
3. file -> import -> existing projects...

### Build and run (maven)

1. mvn assembly:assembly
2. java -jar target/minima-0.5-jar-with-dependencies.jar

### Configuration

All configurations are optional

* -Dminima.port=8989 - http port, defaults to 8989
* -Dminima.db.dir=./minima-db - database directory, defaults to ./minima-db and is created if it does not exist

## Changelog

### V 0.5 - 18 October 2011
 
* Add, create, archive cards
* All changes are pushed to all clients (WebSockets only)
* Http API
* All data stored as plain text files using Keez/KeezFileDb
* Web ui built with jquery and custom javascript 