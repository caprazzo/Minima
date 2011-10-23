package net.caprazzi.minima.service;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;

import java.io.File;

import net.caprazzi.keez.simpleFileDb.KeezFileDb;
import net.caprazzi.keez.simpleFileDb.KeezFileDbTest.GetTestHelp;
import net.caprazzi.minima.TestUtils;
import net.caprazzi.minima.model.MasterRecord;
import net.caprazzi.minima.model.Meta;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;

import org.junit.Before;
import org.junit.Test;

import com.google.common.io.Files;

public class MinimaDbFunctionalTest {

	private File testDir;
	private KeezFileDb db;
	private MinimaDb minimaDb;

	@Before
	public void setUp() {
		testDir = Files.createTempDir();
		db = new KeezFileDb(testDir.getAbsolutePath(), "pfx", false);
		minimaDb = new MinimaDb(db);
	}
	
	@Test
	public void should_init_empty_database() {
		assertEquals(testDir.list().length, 0);
		minimaDb.init();
		File[] files = testDir.listFiles();		
		assertEquals(4, files.length);
		
		db.get("keylisttodo", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<StoryList> fromJson = Meta.fromJson(StoryList.class, data);
				assertEquals("list", fromJson.getName());
				assertEquals("todo", fromJson.getObj().getName());
				assertEquals(65536, fromJson.getObj().getPos().intValue());
				assertEquals("keylisttodo", fromJson.getObj().getId());
			}
		});
		
		db.get("keylistdoing", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<StoryList> fromJson = Meta.fromJson(StoryList.class, data);
				assertEquals("list", fromJson.getName());
				assertEquals("doing", fromJson.getObj().getName());
				assertEquals(65536*2, fromJson.getObj().getPos().intValue());
				assertEquals("keylistdoing", fromJson.getObj().getId());
			}
		});
		
		db.get("keylistdone", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<StoryList> fromJson = Meta.fromJson(StoryList.class, data);
				assertEquals("list", fromJson.getName());
				assertEquals("done", fromJson.getObj().getName());
				assertEquals(65536*3, fromJson.getObj().getPos().intValue());
				assertEquals("keylistdone", fromJson.getObj().getId());
			}
		});
		
		db.get("minimaster", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<MasterRecord> fromJson = Meta.fromJson(MasterRecord.class, data);
				assertEquals("master_record", fromJson.getName());
				assertEquals("1", fromJson.getObj().getDbVersion());
			}
		});
		
	}
	
	@Test
	public void should_upgrade_existing_legacy_database() {
		
		// simulate existing db version 0
		db.put("story1", 0, new Story("story1", "desc1", "todo").toJson(), TestUtils.putNoop);
		db.put("story2", 0, new Story("story2", "desc2", "todo").toJson(), TestUtils.putNoop);
		db.put("story3", 0, new Story("story3", "desc3", "doing").toJson(), TestUtils.putNoop);
		
		minimaDb.init();
		
		// old stories shouls have been deleted
		db.get("story1", new GetTestHelp() { public void notFound(String key) {}; });
		db.get("story2", new GetTestHelp() { public void notFound(String key) {}; });
		db.get("story3", new GetTestHelp() { public void notFound(String key) {}; });

		// master key and lists should now be in place		
		db.get("minimaster", new GetTestHelp() { public void found(String key, int rev, byte[] data) {};} );
		db.get("keylisttodo", new GetTestHelp() { public void found(String key, int rev, byte[] data) {};} );
		db.get("keylistdoing", new GetTestHelp() { public void found(String key, int rev, byte[] data) {};} );
		db.get("keylistdone", new GetTestHelp() { public void found(String key, int rev, byte[] data) {};} );
		
		// stories should have been converted
		db.get("story1rx", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<Story> meta = Meta.fromJson(Story.class, data);
				assertEquals("story", meta.getName());
				assertEquals("desc1", meta.getObj().getDesc());
				assertEquals("story1rx", meta.getObj().getId());
				assertEquals("keylisttodo", meta.getObj().getList());
			}
		});
		
		db.get("story2rx", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<Story> meta = Meta.fromJson(Story.class, data);
				assertEquals("story", meta.getName());
				assertEquals("desc2", meta.getObj().getDesc());
				assertEquals("story2rx", meta.getObj().getId());
				assertEquals("keylisttodo", meta.getObj().getList());
			}
		});
		
		db.get("story3rx", new GetTestHelp() {
			@Override
			public void found(String key, int rev, byte[] data) {
				assertEquals(1, rev);
				Meta<Story> meta = Meta.fromJson(Story.class, data);
				assertEquals("story", meta.getName());
				assertEquals("desc3", meta.getObj().getDesc());
				assertEquals("story3rx", meta.getObj().getId());
				assertEquals("keylistdoing", meta.getObj().getList());
			}
		});
	
	}
	
	@Test
	public void should_leave_alone_existing_recent_db() {

		// simulate existing db version 0
		db.put("story1", 0, new Story("story1", "desc1", "todo").toJson(), TestUtils.putNoop);
		db.put("story2", 0, new Story("story2", "desc2", "todo").toJson(), TestUtils.putNoop);
		db.put("story3", 0, new Story("story3", "desc3", "doing").toJson(), TestUtils.putNoop);
		
		// upgrade to v1
		minimaDb.init();
		File[] list = testDir.listFiles();
		
		// should not change anything
		minimaDb.init();		
		assertArrayEquals(list, testDir.listFiles());
	}
	
}
