package model;

import java.io.IOException;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

public class Meta<T> {

	private T obj;
	private String name; 

	private Meta(String name, T obj) {
		this.name = name;
		this.obj = obj;
	}
	
	public static <T> Meta<T> wrap(String name, T obj) {
		return new Meta<T>(name, obj);
	}
	
	public static <T> Meta<T> fromJson(Class<T> clazz, byte[] json) throws JsonParseException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		JsonFactory jf = mapper.getJsonFactory();
		JsonParser parser = jf.createJsonParser(json);
		JsonNode tree = mapper.readTree(parser);
		JsonNode node = tree.get("name");
		T obj = mapper.readValue(tree.get("obj").toString(), clazz);
		return wrap(node.getValueAsText(), obj);
	}
	
	public T getObj() {
		return obj;
	}
	
	public void setObj(T obj) {
		this.obj = obj;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public byte[] toJson() {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.writeValueAsBytes(this);
		} catch (JsonGenerationException e) {
			throw new RuntimeException(e);
		} catch (JsonMappingException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	
}
