package net.caprazzi.slabs;

import net.caprazzi.keez.inmemory.KeezInMemory;
import net.caprazzi.slabs.SlabsOnKeez.SlabsList;
import net.caprazzi.slabs.SlabsOnKeez.SlabsPut;

import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Iterables;

import static org.junit.Assert.*;

public class SlabsTest {

	private KeezInMemory db;
	private Slabs slabs;
	private boolean called = false;

	@Before public void setup() {
		db = new KeezInMemory();
		Class[] clz = new Class[] { TestDoc.class };
		slabs = new SlabsOnKeez(db, clz);
		called = false;
	}
	
	@Test public void list_should_call_notFound_if_db_empty() {
		slabs.list(new ListHelp() {
			@Override
			public void notFound() {
				called = true;
			}
		});
		assertTrue(called);
	}
	
	@Test public void put_and_list_documents() {
		slabs.put(new TestDoc("a", 0, "A"), putOk);
		slabs.put(new TestDoc("b", 0, "B"), putOk);
		slabs.put(new TestDoc("c", 0, "C"), putOk);
		
		slabs.list(new ListHelp() {
			@Override
			public void entries(Iterable<SlabsDoc> found) {
				SlabsDoc[] docs = Iterables.toArray(found, SlabsDoc.class);
				assertEquals(3, docs.length);
				
				assertEquals("a", docs[0].getId());
				assertEquals(1, docs[0].getRevision());
				assertEquals("test_doc", docs[0].getTypeName());
				
				TestDoc doc = (TestDoc) docs[0];
				assertEquals("A", doc.getValue());
				
				called = true;				
			}
		});
		assertTrue(called);
	}
	
	@Test public void put_should_call_ok() {
		slabs.put(new TestDoc("a",0,"A"), new PutHelp() {
			@Override
			public void ok(SlabsDoc doc) {
				assertEquals("a", doc.getId());
				assertEquals(1, doc.getRevision());
				called = true;
			}
		});
		assertTrue(called);
	}
	
	@Test public void put_should_call_collision() {
		slabs.put(new TestDoc("a", 0, "A"), putOk);
		slabs.put(new TestDoc("a", 0, "A"), new PutHelp() {
			@Override
			public void collision(String id, int yourRev, int foundRev) {
				assertEquals("a", id);
				assertEquals(0, yourRev);
				assertEquals(1, foundRev);
			}
		});
	}
	
	public static class PutHelp extends SlabsPut {
		
		@Override
		public void ok(SlabsDoc doc) {
			throw new RuntimeException("Unexpected ok " + doc);
		}
		
		@Override
		public void collision(String id, int yourRev, int foundRev) {
			throw new RuntimeException("Unexpected collision " + yourRev + " " + foundRev);
		}
		
		@Override
		public void error(String id, SlabsException e) {
			throw new RuntimeException("Unexpected error " + id, e);
		}
		
		@Override
		public void applicationError(SlabsException ex) {
			throw new RuntimeException("Unexpected applicationError()", ex);
		}
		
	}
	
	public static class ListHelp extends SlabsList {

		@Override
		public void entries(Iterable<SlabsDoc> docs) {
			throw new RuntimeException("Unexpected call to entries()");
		}

		@Override
		public void error(SlabsException ex) {
			throw new RuntimeException("Unexpected error", ex);			
		}

		@Override
		public void notFound() {
			throw new RuntimeException("Unexpected notFound(");
		}
		
		@Override
		public void applicationError(SlabsException ex) {
			throw new RuntimeException("Unexpected applicationError()", ex);
		}
		
	}
	
	private static final SlabsPut putOk = new PutHelp() {
		@Override public void ok(SlabsDoc doc) {};
	};
	
}
