package net.caprazzi.minima;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicBoolean;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.MinimaService.Callback;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;

public class MinimaServiceTest {

	private Db db;
	private MinimaService service;
	private final byte[] data = new byte[] {1,2,3};

	@Before
	public void setUp() {
		db = mock(Keez.Db.class);
	}
	
	@Test
	public void test_should_save_story() {
		service = new MinimaService(db);
		byte[] data = service.asJson(new Story("key", "dsec", "tofo"));
	
		final AtomicBoolean flag = new AtomicBoolean();
		service.saveStory("key", 0, data, new Callback() {
			
			@Override
			public void success() {
				flag.set(true);
			}
			
			@Override
			public void error(String message, Exception e) {
				throw new RuntimeException(message, e);
			}
		});
		
		verify(db).put(eq("key"), eq(0), eq(data), Matchers.any(Put.class));
		assertTrue(flag.get());
	}
	
	@Test
	public void test_should_create_good_json() throws JsonParseException, IOException {
		service = new MinimaService(db);
		Story story = new Story("key", "description", "todo");
		byte[] asJson = service.asJson(story);
		
		System.out.println(new String(asJson));
		
		
		Story readBack = new ObjectMapper().readValue(asJson, Story.class);
		assertEquals(story, readBack);
	}
	
	@Test
	public void should_reject_invalid_json() {
		service = new MinimaService(db);
		final AtomicBoolean flag = new AtomicBoolean();
		service.saveStory("key", 0, "garbage".getBytes(), new Callback() {
			
			@Override
			public void success() {}
			
			@Override
			public void error(String message, Exception e) {
				flag.set(true);
			}
		});
		assertTrue(flag.get());
	}
	
}
