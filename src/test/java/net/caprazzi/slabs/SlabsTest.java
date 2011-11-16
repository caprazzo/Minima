package net.caprazzi.slabs;

import net.caprazzi.keez.inmemory.KeezInMemory;
import net.caprazzi.slabs.Slabs.SlabsList;
import net.caprazzi.slabs.Slabs.SlabsPut;


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
		slabs = new Slabs(db, clz);
		called = false;
	}
	
	@Test public void test_list_documents() {
		slabs.put(new TestDoc("a", 0, "A"), new SlabsPut() {});
		slabs.put(new TestDoc("b", 0, "B"), new SlabsPut() {});
		slabs.put(new TestDoc("c", 0, "C"), new SlabsPut() {});
		
		slabs.list(new SlabsList() {
			
			@Override
			public void error(String string, Exception ex) {
				// TODO Auto-generated method stub				
			}
			
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
	
}
