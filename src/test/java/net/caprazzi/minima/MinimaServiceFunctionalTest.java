package net.caprazzi.minima;

import static org.mockito.Mockito.mock;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Collection;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.simpleFileDb.KeezFileDb;
import net.caprazzi.minima.MinimaService.CreateStory;

import static org.junit.Assert.*;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonToken;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import com.google.common.io.Files;

public class MinimaServiceFunctionalTest {

	private Keez.Db db;
	private MinimaService service;
	private File testDir;
	private boolean flag;

	@Before
	public void setUp() {
		testDir = Files.createTempDir();
		db = new KeezFileDb(testDir.getAbsolutePath(), "pfx");
		service = new MinimaService(db);
	}
	
	@Test
	public void create_story_should_return_story_with_id_and_rev() {
		Story story = new Story(null,"desc","list");
		service.createStory(service.asJson(story), new TestUtils.TestCreateStory() {
			
			@Override
			public void success(byte[] story) {
				Story stored = service.fromJson(story);
				assertEquals("desc", stored.getDesc());
				assertEquals("list", stored.getList());
				assertNotNull(stored.getId());
				assertEquals(1, stored.getRevision());
				flag = true;
			}
		});
		assertTrue(flag);
	}
	
	@Test
	public void created_stories_should_be_in_board() throws JsonParseException, IOException {
		Story story = new Story(null,"desc","list");
		service.createStory(service.asJson(story), TestUtils.createStoryNoop);
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
		assertNotNull(s.getId());
	}
	
	@Test
	public void updated_stories_should_be_in_board() throws JsonParseException, IOException {
		Story story = new Story(null,"desc","list");
		
		service.createStory(service.asJson(story), new TestUtils.TestCreateStory() {
			@Override
			public void success(byte[] story) {
				Story updated = service.fromJson(story);
				updated.setDesc("newDesc");
				updated.setList("newList");
				byte[] updatedJson = service.asJson(updated);
				service.updateStory(updated.getId(), updated.getRevision(), updatedJson, new TestUtils.TestUpdateStory() {
					@Override
					public void success() {
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
	
	private static class Board {
		
		private Collection<Story> stories;
		
		public Collection<Story> getStories() {
			return stories;
		}
		
		public void setStories(Collection<Story> stories) {
			this.stories = stories;
		}
		
	}
	
}
