package net.caprazzi.minima.model;

import java.io.IOException;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

public class Meta<T extends Entity> {

	private T obj;
	private String name; 
	
	private enum Types {
		
		story(Story.class),
		list(StoryList.class), 
		master_record(MasterRecord.class);
		
		private final Class<?> clazz;

		Types(Class<?> clazz) {
			this.clazz = clazz;
		}
		
		public static Class<?> getType(String name) {
			return Types.valueOf(name).clazz;
		}
		
		public static Types fromClass(Class<?> clazz) {
			if (story.clazz == clazz)
				return story;
			if (list.clazz == clazz)
				return list;
			throw new IllegalArgumentException();
		}
	}

	private Meta(String name, T obj) {
		this.name = name;
		this.obj = obj;
	}
	
	public static <T extends Entity> Meta<T> wrap(String name, T obj) {
		return new Meta<T>(name, obj);
	}
	
	public static Meta<Entity> wrap(Entity obj) {
		String name = Types.fromClass(obj.getClass()).name();
		return wrap(name, obj);
	}
	
	public static Meta<? extends Entity> fromJson(byte[] json) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = mapper.getJsonFactory();
			JsonParser parser = jf.createJsonParser(json);
			JsonNode tree = mapper.readTree(parser);
			JsonNode node = tree.get("name");
			String name = node.getValueAsText();
			Entity obj = (Entity) mapper.readValue(tree.get("obj").toString(), Types.getType(name));
			return wrap(node.getValueAsText(), obj);
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public static <T extends Entity> Meta<T> fromJson(Class<T> clazz, byte[] json) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = mapper.getJsonFactory();
			JsonParser parser = jf.createJsonParser(json);
			JsonNode tree = mapper.readTree(parser);
			JsonNode node = tree.get("name");
			T obj = mapper.readValue(tree.get("obj").toString(), clazz);
			return wrap(node.getValueAsText(), obj);
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
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

	@SuppressWarnings("unchecked")
	public <K> K getObj(Class<K> clazz) {
		return (K) this.obj;
	}
	
}
