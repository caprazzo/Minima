package net.caprazzi.minima;

import static org.mockito.Mockito.mock;

import java.io.File;
import java.util.Collection;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.simpleFileDb.KeezFileDb;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;
import net.caprazzi.minima.service.DataService;
import net.caprazzi.minima.service.PushService;

import org.junit.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.io.Files;

public class MinimaServiceFunctionalTest {

	Logger logger = LoggerFactory.getLogger(MinimaServiceFunctionalTest.class);
	
	private Keez.Db db;
	private DataService service;
	private PushService pushServlet;
	private File testDir;
	private boolean flag;

	@Before
	public void setUp() {
		flag = false;
		testDir = Files.createTempDir();
		db = new KeezFileDb(testDir.getAbsolutePath(), "pfx", false);
		pushServlet = mock(PushService.class);
		service = new DataService(db, pushServlet);
	}
	
	/*
	
	@Test
	public void create_story_should_return_story_with_id_and_rev() {
		Story story = new Story(null,"desc","list");
		story.setPos(new BigDecimal(99));
		service.createStory("id", story.toJson(), new TestUtils.TestCreateStory() {
			
			@Override
			public void success(Story stored) {
				assertEquals("desc", stored.getDesc());
				assertEquals("list", stored.getList());
				assertEquals(99, stored.getPos().intValue());
				assertNotNull(stored.getId());
				assertEquals(1, stored.getRevision());
				flag = true;
			}
		});
		assertTrue(flag);
	}
	
	@Test
	public void create_story_should_push_created() {
		Story story = new Story(null,"desc","list");
		story.setPos(new BigDecimal(99));
		service.createStory("id", story.toJson(), new TestUtils.TestCreateStory() {
			
			@Override
			public void success(Story stored) {
				flag = true;
			}
		});
		assertTrue(flag);
		verify(pushServlet).send(any(byte[].class));
	}
	
	@Test
	public void create_story_should_push_updated() {
		Story story = new Story(null,"desc","list");
		story.setPos(new BigDecimal(99));
		service.createStory("id", story.toJson(), new TestUtils.TestCreateStory() {
			@Override
			public void success(Story created) {

				Meta<Story> meta = Meta.wrap("story", created);
				
				service.update(created.getId(), created.getRevision(), meta.toJson(), new TestUtils.TestUpdateStory() {
					@Override
					public void success(String key, int revision, byte[] jsonData) {
						flag = true;
					}
				});
			}
		});
		
		assertTrue(flag);
		verify(pushServlet, times(2)).send(any(byte[].class));
	}
	
	@Test
	public void update_story_should_return_story_with_id_and_rev() {
		Story story = new Story(null,"desc","list");
		story.setPos(new BigDecimal(99));
		service.createStory("id", story.toJson(), new TestUtils.TestCreateStory() {
			@Override
			public void success(Story created) {
				created.setDesc("newDesc");
				created.setList("newList");
				created.setPos(new BigDecimal(66));
				Meta<Story> meta = Meta.wrap("story", created);
				service.update(created.getId(), created.getRevision(), meta.toJson(), new TestUtils.TestUpdateStory() {
					@Override
					public void success(String key, int revision, byte[] jsonData) {
						Story updated = Meta.fromJson(Story.class, jsonData).getObj();
						assertEquals("newDesc", updated.getDesc());
						assertEquals("newList", updated.getList());
						assertEquals(66, updated.getPos().intValue());
						assertEquals(key, updated.getId());
						assertEquals(revision, updated.getRevision());
						flag = true;
					}
				});
			}
		});
		
		assertTrue(flag);
	}
	
	@Test
	public void created_stories_should_be_in_board() throws JsonParseException, IOException {
		Story story = new Story(null,"desc","list");
		story.setPos(new BigDecimal(99));
		service.createStory("id", story.toJson(), TestUtils.createStoryNoop);
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		OutputStreamWriter out = new OutputStreamWriter(baos);
		service.writeBoard(out);
		System.out.println(baos.toString());
		
		Board b = new ObjectMapper().readValue(baos.toString(), Board.class);

		assertEquals(1, b.getStories().size());
		
		Story s = b.getStories().toArray(new Story[]{})[0];
		
		assertEquals(1, s.getRevision());
		assertEquals("desc", s.getDesc());
		assertEquals("list", s.getList());
		assertEquals(99, s.getPos().intValue());
		assertNotNull(s.getId());
	}
	
	@Test
	public void updated_stories_should_be_in_board() throws JsonParseException, IOException {
		Story story = new Story(null,"desc","list");
		story.setPos(new BigDecimal(99));
		service.createStory("id", story.toJson(), new TestUtils.TestCreateStory() {
			@Override
			public void success(Story updated) {
				updated.setDesc("newDesc");
				updated.setList("newList");
				updated.setPos(new BigDecimal(66));
				Meta<Story> meta = Meta.wrap("story", updated);
				service.update(updated.getId(), updated.getRevision(), meta.toJson(), new TestUtils.TestUpdateStory() {
					@Override
					public void success(String key, int rev, byte[] data) {
						flag = true;
					}
				});
			}
		});
		
		assertTrue(flag);
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		OutputStreamWriter out = new OutputStreamWriter(baos);
		service.writeBoard(out);
		System.out.println(baos.toString());
		
		Board b = new ObjectMapper().readValue(baos.toString(), Board.class);

		assertEquals(1, b.getStories().size());
		
		Story s = b.getStories().toArray(new Story[]{})[0];
		
		assertEquals(2, s.getRevision());
		assertEquals("newDesc", s.getDesc());
		assertEquals("newList", s.getList());
		assertNotNull(s.getId());
	}
	*/
	
	private static class Board {
		
		private Collection<Story> stories;
		private Collection<StoryList> lists;
		
		public Collection<Story> getStories() {
			return stories;
		}
		
		public void setStories(Collection<Story> stories) {
			this.stories = stories;
		}
		
		public void setLists(Collection<StoryList> lists) {
			this.lists = lists;
		}
		
	}
	
}
