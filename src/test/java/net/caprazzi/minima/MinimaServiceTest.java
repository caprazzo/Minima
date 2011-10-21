package net.caprazzi.minima;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicBoolean;

import model.Story;
import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.service.MinimaService;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

public class MinimaServiceTest {

	private Db db;
	private MinimaService service;

	@Before
	public void setUp() {
		db = mock(Keez.Db.class);
		service = new MinimaService(db, null);
	}
	
	@Test
	public void create_should_put_new_story_in_db() {
		Story story = new Story("key", "dsec", "tofo");
		story.setPos(new BigDecimal(99));
		byte[] data = service.asJson(story);
		service.createStory("id", data, TestUtils.createStoryNoop);
		verify(db).put(anyString(), eq(0), any(byte[].class), any(Put.class));
	}
	
	@Test
	public void update_should_update_story_in_db() {
		byte[] data = service.asJson(new Story("key", "dsec", "tofo"));
		service.updateStory("key", 1, data, TestUtils.updateStoryNoop);		
		verify(db).put(eq("key"), eq(1), any(byte[].class), any(Put.class));
	}
	
	@Test
	public void test_should_create_good_json() throws JsonParseException, IOException {
		Story story = new Story("key", "description", "todo");
		byte[] asJson = service.asJson(story);
		System.out.println(new String(asJson));
		Story readBack = new ObjectMapper().readValue(asJson, Story.class);
		assertEquals(story, readBack);
	}
	
	@Test
	public void should_reject_invalid_json() {
		final AtomicBoolean flag = new AtomicBoolean();
		service.updateStory("key", 0, "garbage".getBytes(), new TestUtils.TestUpdateStory() {
			@Override
			public void error(String message, Exception e) {
				flag.set(true);
			}
		});
		assertTrue(flag.get());
	}
	
	
	
}
