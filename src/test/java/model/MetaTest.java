package model;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.codehaus.jackson.JsonParseException;
import org.junit.Test;

public class MetaTest {

	private MockModel model;

	public void setUp() {
		model = new MockModel();
	}
	
	@Test
	public void test_build_from_object() {
		Meta<MockModel> wrap = Meta.wrap("mock", model);
		assertEquals(model, wrap.getObj());
		assertEquals("mock", wrap.getName());
	}
	
	@Test
	public void test_build_from_json() throws JsonParseException, IOException {
		byte[] json = "{\"name\":\"mock\", \"obj\": {\"value\":\"moo\"}}".getBytes();
		Meta<MockModel> metaModel = Meta.fromJson(MockModel.class, json);
		assertEquals("mock", metaModel.getName());
		assertEquals("moo", metaModel.getObj().getValue());
	}
	
	@Test
	public void test_should_convert_to_json() {
		byte[] asJson = Meta.wrap("mock", model).toJson();
		System.out.println(new String(asJson));
	}
	
	public static class MockModel {
		
		private String value;
		public String getValue() {
			return value;
		}
		public void setValue(String value) {
			this.value = value;
		}
		
	}
	
}
