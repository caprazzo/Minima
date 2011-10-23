package net.caprazzi.minima.service;

import static org.junit.Assert.*;
import static org.mockito.Matchers.*;
import static org.mockito.AdditionalMatchers.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.math.BigDecimal;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.Keez.Delete;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.Get;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.minima.model.MasterRecord;
import net.caprazzi.minima.model.Meta;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;

import static net.caprazzi.minima.TestUtils.*;

import org.codehaus.jackson.JsonParseException;
import org.junit.Before;
import org.junit.Test;

public class MinimaDbTest {

	private Db db;
	private MinimaDb minimaDb;
	private String masterKey = MinimaDb.MASTER_KEY;
	private byte[] masterRecord = "record".getBytes();

	@Before
	public void setUp() {
		db = mock(Keez.Db.class);
		minimaDb = new MinimaDb(db);
	}
	
	@Test
	public void init_should_put_master_record_and_lists_if_not_there() {
		minimaDb = spy(new MinimaDb(db));
		
		doAnswer(getNotFound).when(db).get(eq(masterKey), any(Get.class));
		when(minimaDb.getMasterRecord()).thenReturn(masterRecord);
		minimaDb.init();
		verify(db).get(eq(masterKey), any(Get.class));
		verify(db).put(eq(masterKey), eq(0), eq(masterRecord), any(Put.class));
	}			
	
	@Test
	public void init_should_update_if_no_master_key_and_then_install_master_record() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		doAnswer(getNotFound).when(db).get(eq(masterKey), any(Get.class));
		when(minimaDb.getMasterRecord()).thenReturn(masterRecord);
		
		minimaDb.init();		
		verify(db).get(eq(masterKey), any(Get.class));
		verify(minimaDb).upgradeFrom0to1();
		verify(db).put(eq(masterKey), eq(0), eq(masterRecord), any(Put.class));
	}
	
	@Test
	public void init_should_not_install_master_record_if_upgrade_fails() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		doAnswer(getNotFound).when(db).get(eq(masterKey), any(Get.class));
		
		doThrow(new Exception()).when(minimaDb).upgradeFrom0to1();
		
		try { minimaDb.init(); } catch (RuntimeException ex) {}
		
		verify(db, never()).put(eq(masterKey), eq(0), any(byte[].class), any(Put.class));
	}
	
	@Test
	public void init_should_not_upgrade_if_master_record_presesnt() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		doAnswer(getFound(1, masterRecord))
			.when(db).get(eq(masterKey), any(Get.class));
		
		minimaDb.init();
		
		verify(minimaDb, never()).upgradeFrom0to1();
	}
	
	@Test
	public void upgradeFrom0to1_shold_do_nothing_if_database_empty() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		Entry[] entries = new Entry[] {};
		
		doAnswer(listFound(entries)).when(db).list(any(List.class));
		
		minimaDb.upgradeFrom0to1();
		
		verify(db).list(any(List.class));
		verify(minimaDb, never()).upgradeEntry(any(Entry.class));
	}
	
	@Test
	public void upgradeFrom0To1_should_create_list_entries() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		minimaDb.upgradeFrom0to1();
		
		verify(minimaDb).createList(MinimaDb.ID_LIST_TODO, "todo", 65536);
		verify(minimaDb).createList(MinimaDb.ID_LIST_DOING, "doing" , 65536 * 2);
		verify(minimaDb).createList(MinimaDb.ID_LIST_DONE, "done", 65536 * 3);
		
		verify(minimaDb).upgradeStories();
	}
	
	@Test
	public void upgradeFrom0To1_should_rollback_lists_if_one_fails() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		doThrow(new Exception()).when(minimaDb).createList(MinimaDb.ID_LIST_DOING, "doing", 65536 * 2);
		
		try {
			minimaDb.upgradeFrom0to1();
			fail();
		} catch (Exception e) {}
		
		verify(minimaDb).rollbackInstallList(MinimaDb.ID_LIST_TODO);
		verify(minimaDb).rollbackInstallList(MinimaDb.ID_LIST_DOING);
		verify(minimaDb).rollbackInstallList(MinimaDb.ID_LIST_DONE);
	}
	
	@Test
	public void upgradeFrom0To1_should_rollback_lists_if_update_story_fails() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		Entry[] entries = new Entry[] {
			new Entry("story0", 1, "somedata".getBytes()),
		};
		
		doAnswer(listFound(entries)).when(db).list(any(List.class));
		
		doThrow(new Exception()).when(minimaDb).upgradeEntry(entries[0]);
		
		try {
			minimaDb.upgradeFrom0to1();
			fail();
		} catch (Exception e) {}
				
		
		verify(minimaDb).rollbackInstallList(MinimaDb.ID_LIST_TODO);
		verify(minimaDb).rollbackInstallList(MinimaDb.ID_LIST_DOING);
		verify(minimaDb).rollbackInstallList(MinimaDb.ID_LIST_DONE);
	}
	
	@Test
	public void upgradeFrom0to1_should_upgrade_each_story() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		Entry[] entries = new Entry[] {
			new Entry("story1", 1, new Story("id1", "desc1", "todo").toJson()),
			new Entry("story2", 2, new Story("id2", "desc2", "todo").toJson()),
		};
		
		doAnswer(listFound(entries)).when(db).list(any(List.class));
		
		minimaDb.upgradeFrom0to1();
		
		verify(minimaDb).upgradeEntry(entries[0]);
		verify(minimaDb).upgradeEntry(entries[1]);
	}
	
	@Test
	public void upgradeFrom0to1_should_delete_old_stories_after_upgrade() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		Entry[] entries = new Entry[] {
			new Entry("story1", 1, new Story("id1", "desc1", "todo").toJson()),
			new Entry("story2", 2, new Story("id2", "desc2", "todo").toJson()),
		};
		
		doAnswer(listFound(entries)).when(db).list(any(List.class));
		
		minimaDb.upgradeFrom0to1();
		
		verify(db).delete(eq("story1"), any(Delete.class));
		verify(db).delete(eq("story2"), any(Delete.class));
	}
	
	@Test
	public void upgradeFrom0To1_should_rollback_if_any_upgrade_fails_then_throw() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		Entry[] entries = new Entry[] {
			new Entry("story1", 1, new Story("id1", "desc1", "todo").toJson()),
			new Entry("story2", 2, new Story("id2", "desc2", "todo").toJson()),
			new Entry("story3", 2, new Story("id3", "desc3", "todo").toJson())
		};
		
		doAnswer(listFound(entries)).when(db).list(any(List.class));
		
		doThrow(new Exception()).when(minimaDb).upgradeEntry(entries[1]);
		
		try {
			minimaDb.upgradeFrom0to1();
			fail();
		} catch (Exception e) {}
		
		verify(minimaDb).upgradeEntry(entries[0]);
		verify(minimaDb).upgradeEntry(entries[1]);
		
		verify(minimaDb, never()).upgradeEntry(entries[2]);
		
		verify(minimaDb).rollbackUpgradeEntry(entries[0]);
		verify(minimaDb).rollbackUpgradeEntry(entries[1]);
		
		verify(minimaDb, never()).rollbackUpgradeEntry(entries[2]);
	}
	
	@Test
	public void upgradeFrom0To1_rollback_keeps_going_if_rollback_fails_then_throw() throws Exception {
		minimaDb = spy(new MinimaDb(db));
		
		Entry[] entries = new Entry[] {
			new Entry("story0", 0, new Story("id0", "desc0", "todo").toJson()),
			new Entry("story1", 1, new Story("id1", "desc1", "doing").toJson()),
			new Entry("story2", 2, new Story("id2", "desc2", "done").toJson())
		};
		
		doAnswer(listFound(entries)).when(db).list(any(List.class));
		doThrow(new Exception()).when(minimaDb).upgradeEntry(entries[1]);
		doThrow(new Exception()).when(minimaDb).rollbackUpgradeEntry(entries[0]);
		
		try {
			minimaDb.upgradeFrom0to1();
			fail();
		} catch (Exception e) {}
		
		verify(minimaDb).rollbackUpgradeEntry(entries[0]);
		verify(minimaDb).rollbackUpgradeEntry(entries[1]);	
	}
	
	@Test
	public void upgradeEntry_should_wrap_story_in_meta_and_relink_list_and_zero_rev() throws Exception {
		Story story = new Story("keyA", "title", "todo");
		story.setRevision(1234);
		
		byte[] storyData = story.toJson();		
		Entry entry = spy(new Entry("keyA", 130, storyData));
		
		Story upgraded = new Story("keyArx","title", MinimaDb.ID_LIST_TODO);
		upgraded.setRevision(1);
		
		Meta<Story> wrap = Meta.wrap("story", upgraded);
		byte[] wrapData = wrap.toJson();
		
		minimaDb.upgradeEntry(entry);
		
		System.out.println("want: " + new String(wrapData));
		verify(db).put(eq("keyArx"), eq(0), aryEq(wrapData), any(Put.class));
	}
	
	@Test
	public void rollbackList_should_delete_list_key() throws Exception {
		minimaDb.rollbackInstallList("listId");
		verify(db).delete(eq("listId"), any(Delete.class));
	}
	
	@Test
	public void rollbackUpgradeEntry_should_delete_new_entry_key() throws Exception {
		minimaDb.rollbackUpgradeEntry(new Entry("somekey", 0, null));
		verify(db).delete(eq("somekeyrx"), any(Delete.class));
	}
	
	@Test
	public void test_createList_should_put_list_in_db() throws Exception {
		StoryList list = new StoryList("id", "title", new BigDecimal(123));
		Meta<StoryList> meta = Meta.wrap("list", list);
		byte[] json = meta.toJson();
		
		minimaDb.createList("id", "title", 123);
		
		verify(db).put(eq("id"), eq(0), aryEq(json), any(Put.class));
	}
	
	@Test
	public void getMasterRecord_should_return_valid_record() throws JsonParseException, IOException {
		byte[] record = minimaDb.getMasterRecord();
		System.out.println(new String(record));
		Meta<MasterRecord> meta = Meta.fromJson(MasterRecord.class, record);
		assertEquals("1", meta.getObj().getDbVersion());
	}
	
}
