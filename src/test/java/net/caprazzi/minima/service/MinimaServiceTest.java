package net.caprazzi.minima.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.AdditionalMatchers.aryEq;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicBoolean;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.TestUtils;
import net.caprazzi.minima.model.MasterRecord;
import net.caprazzi.minima.model.Meta;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
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
		
		story.setRevision(1);
		story.setId("id");
		byte[] json = Meta.wrap("story", story).toJson();
		verify(db).put(anyString(), eq(0), aryEq(json), any(Put.class));
	}
	
	@Test
	public void update_should_update_story_in_db() {
		Story story = new Story("key", "dsec", "tofo");
		Meta<Story> meta = Meta.wrap("story", story);
		byte[] data = meta.toJson();
		service.update("key", 1, data, TestUtils.updateStoryNoop);
		
		story.setRevision(2);
		story.setId("key");
		byte[] json = meta.toJson();
		verify(db).put(eq("key"), eq(1), aryEq(json), any(Put.class));
	}
	
	@Test
	public void test_should_create_good_json() throws JsonParseException, IOException {
		Story story = new Story("key", "description", "todo");
		byte[] asJson = service.asJson(story);
		Story readBack = new ObjectMapper().readValue(asJson, Story.class);
		assertEquals(story, readBack);
	}
	
	@Test
	public void should_write_empty_board() throws JsonParseException, IOException {
		
		Entry[] entries = new Entry[] {
			new Entry("master", 0, Meta.wrap("master_record", new MasterRecord()).toJson())
		};
		doAnswer(TestUtils.listFound(entries)).when(db).list(any(List.class));
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		OutputStreamWriter writer = new OutputStreamWriter(baos);		
		service.writeBoard(writer);
		
		byte[] written = baos.toByteArray();
		
		System.out.println(new String(written));
		
		JsonNode tree = getJsonTree(written);
		
		JsonNode storiesNode = tree.get("stories");
		assertNotNull(storiesNode);
		
		JsonNode listsNode = tree.get("lists");
		assertNotNull(listsNode);
	}
	
	@Test
	public void should_write_board_with_lists_only() throws JsonParseException, IOException {
		
		Entry[] entries = new Entry[] {
			new Entry("master", 0, Meta.wrap("master_record", new MasterRecord()).toJson()),
			new Entry("list1", 0, Meta.wrap("list", new StoryList("list1", "listOne", new BigDecimal(1))).toJson()),
			new Entry("list2", 0, Meta.wrap("list", new StoryList("list2", "listTwo", new BigDecimal(1))).toJson())
		};
		doAnswer(TestUtils.listFound(entries)).when(db).list(any(List.class));
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		OutputStreamWriter writer = new OutputStreamWriter(baos);		
		service.writeBoard(writer);
		
		byte[] written = baos.toByteArray();
		
		
		JsonNode tree = getJsonTree(written);
		
		JsonNode storiesNode = tree.get("stories");
		assertNotNull(storiesNode);
		
		JsonNode listsNode = tree.get("lists");
		assertNotNull(listsNode);
		
		byte[] binaryValue = listsNode.get(0).toString().getBytes();
		StoryList listOne = StoryList.fromJson(binaryValue);
		assertNotNull(listOne);
		
		StoryList listTwo = StoryList.fromJson(listsNode.get(1).toString().getBytes());
		assertNotNull(listTwo);
	}
	
	@Test
	public void should_write_board_with_lists_and_stories() throws JsonParseException, IOException {
		
		Entry[] entries = new Entry[] {
			new Entry("master", 0, Meta.wrap("master_record", new MasterRecord()).toJson()),
			new Entry("list1", 0, Meta.wrap("list", new StoryList("list1", "listOne", new BigDecimal(1))).toJson()),
			new Entry("list2", 0, Meta.wrap("list", new StoryList("list2", "listTwo", new BigDecimal(1))).toJson()),
			new Entry("story1", 0, Meta.wrap("story", new Story("story1", "storyOne", "todo")).toJson()),
			new Entry("story2", 0, Meta.wrap("story", new Story("story2", "storyTwo", "done")).toJson())
		};
		doAnswer(TestUtils.listFound(entries)).when(db).list(any(List.class));
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		OutputStreamWriter writer = new OutputStreamWriter(baos);		
		service.writeBoard(writer);
		
		byte[] written = baos.toByteArray();
		
		JsonNode tree = getJsonTree(written);
		
		JsonNode storiesNode = tree.get("stories");
		assertNotNull(storiesNode);
		
		assertNotNull(Story.fromJson(storiesNode.get(0).toString().getBytes()));
		assertNotNull(Story.fromJson(storiesNode.get(1).toString().getBytes()));
		
		JsonNode listsNode = tree.get("lists");
		assertNotNull(listsNode);
		
		assertNotNull(StoryList.fromJson(listsNode.get(0).toString().getBytes()));
		assertNotNull(StoryList.fromJson(listsNode.get(1).toString().getBytes()));
		
		
	}

	private JsonNode getJsonTree(byte[] written) throws IOException,
			JsonParseException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		JsonFactory jf = mapper.getJsonFactory();
		JsonParser parser = jf.createJsonParser(written);
		JsonNode tree = mapper.readTree(parser);
		return tree;
	}
	
	@Test
	public void should_reject_invalid_json() {
		final AtomicBoolean flag = new AtomicBoolean();
		service.update("key", 0, "garbage".getBytes(), new TestUtils.TestUpdateStory() {
			@Override
			public void error(String message, Exception e) {
				flag.set(true);
			}
		});
		assertTrue(flag.get());
	}
	
}
