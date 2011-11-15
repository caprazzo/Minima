package net.caprazzi.slabs;

import static org.junit.Assert.*;

import java.io.IOException;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import org.junit.Before;
import org.junit.Test;

public class SlabsDocTest {

	private TestDoc doc;

	@Before 
	public void set_up() {
		doc = new TestDoc();
		doc.setValue("some value");
		doc.setId("the id");
		doc.setRevision(99);
	}
	
	@Test
	public void should_discover_the_type_name() {
		TestDoc doc = new TestDoc();
		assertEquals("test_doc", doc.getTypeName());
	}
	
	@Test
	public void should_serialize_to_db_format() throws JsonParseException, IOException, SlabsException {
		ObjectNode root = doc.getDatabaseJson();
		assertEquals(doc.getTypeName(), root.get("name").getValueAsText());		
		ObjectNode node = (ObjectNode) root.get("obj");
		assertEquals(null, node.get("id"));
		assertEquals(null, node.get("revision"));
		assertEquals(doc.getValue(), node.get("value").getValueAsText());		
	}
	
	@Test
	public void should_serialize_to_plain_format_with_idrev() {
		ObjectNode node = doc.toJson(false);
		assertEquals(null, node.get("id"));
		assertEquals(null, node.get("revision"));
		assertEquals(doc.getValue(), node.get("value").getValueAsText());
	}
	
	@Test
	public void should_serialize_to_plain_format_without_idrev() {
		ObjectNode node = doc.toJson(true);
		assertEquals("the id", node.get("id").getValueAsText());
		assertEquals(99, node.get("revision").getValueAsInt());
		assertEquals(doc.getValue(), node.get("value").getValueAsText());
	}
	
	private ObjectNode dataAsTree(byte[] data) throws IOException,
			JsonParseException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		JsonFactory jf = mapper.getJsonFactory();
		JsonParser parser = jf.createJsonParser(data);
		return (ObjectNode) mapper.readTree(parser);
	}
	
	@SlabsType("test_doc")
	private static class TestDoc extends SlabsDoc {
		
		private String value;
		
		public String getValue() {
			return value;
		}
		
		public void setValue(String value) {
			this.value = value;
		}
	}
}
