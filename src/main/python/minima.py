import urllib3
import json

class Minima:

	def __init__(self, base, webroot):
		self.base = base
		self.webroot = webroot
		self.http = urllib3.connection_from_url(base)
		
	def getIndex(self, devel=False):
		url = self.webroot + 'index'
		if (devel):
			url = url + '?devel'
		r = self.http.urlopen('GET', url)
		return r.data
	
	def getBoard(self):
		r = self.http.urlopen('GET', '/data/stories')
		return r.data
		
	def putNote(self, note):
		body = json.dumps({'name':'story', 'obj':note}) 
		r = self.http.urlopen('PUT', '/data/stories/%s/%s' % (note['id'], note['revision']) , body)
		return (r.status, r.data)
	
	def putList(self, ls):
		body = json.dumps({'name':'list', 'obj':ls}) 
		r = self.http.urlopen('PUT', '/data/stories/%s/%s' % (ls['id'], ls['revision']) , body)
		return (r.status, r.data)
	
if __name__ == '__main__':
	
	client = Minima('http://localhost:8989/')
	
	board = client.getBoard()
	print board
	
	print client.putNote({'pos': 10, 'desc':"Note", 'archived':False, 'id':'someid2', 'revision':0})
	
	print client.putList({'pos': 99, 'name':'List', 'archived':False, 'id':'someotherId2', 'revision': 0})