from minima import Minima
from BeautifulSoup import BeautifulSoup
from pprint import pprint
import urllib3
import json

def eq(actual, expected):
    if (actual != expected):
        pprint({ 'actual': actual, 'expected': expected })
        assert(False)
        
def test(actual, fn):
    if not fn(actual):
        print actual
        assert(False)
        
def isTrue(expected):
    if not expected:
        assert(False)

class MinimaTest:
    
    def __init__(self, client):
        self.client = client
        self.http = urllib3.connection_from_url(client.base)
        
    def testIndex(self, devel=False):
        html = self.client.getIndex(devel);
        self.testScripts(html)
        self.testCss(html)  
        self.testVariables(html)      
        print 'PASS testIndex(devel=%s)' % devel
    
    def testScripts(self, html):
        soup = BeautifulSoup(html)
        for s in soup.findAll('script', {'type': 'text/javascript'}):
            r = self.getFile(self.client.base + s['src'])
            eq(r.status, 200)
            
    def testCss(self, html):
        soup = BeautifulSoup(html)
        for s in soup.findAll('link', {'type': 'text/css', 'rel': 'stylesheet'}):
            if s['href'].startswith('http'):
                continue
            r = self.getFile(self.client.base + s['href'])
            eq(r.status, 200)
            
    def testVariables(self, html):
        soup = BeautifulSoup(html)
        inputs = dict([(el['id'], el) for el in soup.findAll('input', {'type': 'hidden'})])
        pprint(inputs)
        eq( inputs['minima-data-location']['value'], self.client.webroot + 'data')
        eq( inputs['minima-comet-location']['value'], self.client.webroot + 'comet')
        test( inputs['minima-websocket-location']['value'], lambda v: v.endswith(self.client.webroot + 'websocket'))
            
    def getFile(self, url):
        return self.http.get_url(url)
        
def test_plain_install():
    client = Minima('http://localhost:8989', '/foo/')
    test = MinimaTest(client)
    
    test.testIndex()
    test.testIndex(devel=True)
    

if __name__ == '__main__':
    
    test_plain_install()
        
        