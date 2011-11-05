$(function() {
	describe('Note View', function() {
		
		beforeEach(function() {
			this.note = new Note({
				id: 'n1',
				desc: 'some desc',
				pos: 1000,
				list: 'aList'
			});
			
			this.view = new NoteView({
				model: this.note,
				readonly: false
			});
		});
		
		function getDescBody(view) {
			return $(view.render().el).find('.note-desc').html()
		}
		
		describe('render', function() {
			it ('should create a div element', function() {
				expect(this.view.render().el.nodeName).toEqual('LI');
			});
		});
		
		describe("Parse @at tags", function() {
			
			it ('should highlight @tag', function() {
				this.note.set({desc: 'some @tag here'});
				expect(getDescBody(this.view))
					.toEqual('some <span class="ui-tag ui-tag-at">@tag</span> here');
			});
			
			it ('should highlight @tag', function() {
				this.note.set({desc: '@tag here'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-at">@tag</span> here');
			});
			
			it ('should highlight @tag', function() {
				this.note.set({desc: 'some @tag'});
				expect(getDescBody(this.view))
					.toEqual('some <span class="ui-tag ui-tag-at">@tag</span>');
			});
			
			it ('should highlight @tag', function() {
				this.note.set({desc: '@tag'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-at">@tag</span>');
			});
			
			it ('should highlight @tag.tag', function() {
				this.note.set({desc: '@tag.tag'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-at">@tag.tag</span>');
			});
			
			it ('should highlight @tag.tag:boo', function() {
				this.note.set({desc: '@tag.tag:boo'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-at">@tag.tag:boo</span>');
			});
			
		});
		
		describe("Parse #hash tags", function() {
			
			it ('should highglight #hash', function() {
				this.note.set({desc: 'some #hash here'});
				expect(getDescBody(this.view))
					.toEqual('some <span class="ui-tag ui-tag-hash">#hash</span> here');
			});
			
			it ('should highglight #hash', function() {
				this.note.set({desc: '#hash here'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-hash">#hash</span> here');
			});
			
			it ('should highglight #hash', function() {
				this.note.set({desc: 'some #hash'});
				expect(getDescBody(this.view))
					.toEqual('some <span class="ui-tag ui-tag-hash">#hash</span>');
			});
			
			it ('should highglight #hash', function() {
				this.note.set({desc: '#hash'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-hash">#hash</span>');
			});
			
			it ('should highglight #hash.hash', function() {
				this.note.set({desc: '#hash.hash'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-hash">#hash.hash</span>');
			});
			
			it ('should highglight #foo.bar:baz', function() {
				this.note.set({desc: '#foo.bar:baz'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-hash">#foo.bar:baz</span>');
			});
			
			it ('should mix #hash and @tag', function() {
				this.note.set({desc: '#hash @tag'});
				expect(getDescBody(this.view))
					.toEqual('<span class="ui-tag ui-tag-hash">#hash</span> <span class="ui-tag ui-tag-at">@tag</span>');
			});
			
		});
			
		describe("Parse urls", function() {
			
			it ('should linkify http://www.google.com', function() {
				this.note.set({desc: 'http://www.google.com'});
				expect(getDescBody(this.view))
					.toEqual('<a href="http://www.google.com">http://www.google.com</a>');
			});
			
			it ('should linkify http://www.google.com', function() {
				this.note.set({desc: 'bla bla http://www.google.com la la'});
				expect(getDescBody(this.view))
					.toEqual('bla bla <a href="http://www.google.com">http://www.google.com</a> la la');
			});
			
			it ('should linkify www.google.com', function() {
				this.note.set({desc: 'www.google.com'});
				expect(getDescBody(this.view))
					.toEqual('<a href="http://www.google.com">www.google.com</a>');
			});
			
			it ('should linkify www.google.com', function() {
				this.note.set({desc: 'lu lu www.google.com bla bla'});
				expect(getDescBody(this.view))
					.toEqual('lu lu <a href="http://www.google.com">www.google.com</a> bla bla');
			});
			
			it ('should linkify reader.google.com', function() {
				this.note.set({desc: 'lu lu reader.google.com bla bla'});
				expect(getDescBody(this.view))
					.toEqual('lu lu <a href="http://reader.google.com">reader.google.com</a> bla bla');
			});
			
			it ('should linkify http://reader.google.com', function() {
				this.note.set({desc: 'lu lu http://reader.google.com bla bla'});
				expect(getDescBody(this.view))
					.toEqual('lu lu <a href="http://reader.google.com">http://reader.google.com</a> bla bla');
			});
			
			it ('should linkify google.com', function() {
				this.note.set({desc: 'google.com'});
				expect(getDescBody(this.view))
					.toEqual('<a href="http://google.com">google.com</a>');
			});
			
			it ('should linkify google.com', function() {
				this.note.set({desc: 'gu gu google.com me me'});
				expect(getDescBody(this.view))
					.toEqual('gu gu <a href="http://google.com">google.com</a> me me');
			});
			
		});
		
		describe("Parse emails", function() {
			
			it ('should linkify matteo.caprari@gmail.com', function() {
				this.note.set({desc: 'some matteo.caprari@gmail.com text'});
				expect(getDescBody(this.view))
					.toEqual('some <a href="mailto:matteo.caprari@gmail.com">matteo.caprari@gmail.com</a> text');
			});
			
			it ('should linkify matteo.caprari@gmail.com', function() {
				this.note.set({desc: 'matteo.caprari@gmail.com text'});
				expect(getDescBody(this.view))
					.toEqual('<a href="mailto:matteo.caprari@gmail.com">matteo.caprari@gmail.com</a> text');
			});
			
			it ('should linkify matteo.caprari@gmail.com', function() {
				this.note.set({desc: 'some matteo.caprari@gmail.com'});
				expect(getDescBody(this.view))
					.toEqual('some <a href="mailto:matteo.caprari@gmail.com">matteo.caprari@gmail.com</a>');
			});
			
			it ('should linkify matteo.caprari@gmail.com', function() {
				this.note.set({desc: 'matteo.caprari@gmail.com'});
				expect(getDescBody(this.view))
					.toEqual('<a href="mailto:matteo.caprari@gmail.com">matteo.caprari@gmail.com</a>');
			});
			
			it ('should linkify mailto:matteo.caprari@gmail.com', function() {
				this.note.set({desc: 'mailto:matteo.caprari@gmail.com'});
				expect(getDescBody(this.view))
					.toEqual('<a href="mailto:matteo.caprari@gmail.com">mailto:matteo.caprari@gmail.com</a>');
			});
			
			it ('should linkify mailto:anything', function() {
				this.note.set({desc: 'mailto:anything'});
				expect(getDescBody(this.view))
					.toEqual('<a href="mailto:anything">mailto:anything</a>');
			});
		});
		
		describe("Mix all parsers", function() {
			
			it('should linkyf a url and hihghlight tags', function() {
				this.note.set({desc: 'smo matteo.caprari@gmail.com smo google.com #hash @tag'});
				expect(getDescBody(this.view))
				.toEqual('smo <a href="mailto:matteo.caprari@gmail.com">matteo.caprari@gmail.com</a> ' 
						+ 'smo <a href="http://google.com">google.com</a> '
						+ '<span class="ui-tag ui-tag-hash">#hash</span> <span class="ui-tag ui-tag-at">@tag</span>');
			});
			
		});
	});
});