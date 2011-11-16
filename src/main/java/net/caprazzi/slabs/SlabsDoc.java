package net.caprazzi.slabs;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import net.caprazzi.minima.model.Note;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.MappingJsonFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import org.junit.Ignore;

public abstract class SlabsDoc {

	/****
	 * 
	 *  TODO: make SlabsDoc immutable
	 * 
	 */
	private String id;
	private int revision;
	private String typeName = null;		
	
	public final void setId(String id) {
		this.id = id;
	}
	
	public final void setRevision(int revision) {
		this.revision = revision;
	}
	
	public final String getId() {
		return id;
	}
	
	public final int getRevision() {
		return revision;
	}
	
	@JsonIgnore
	public final String getTypeName() {		
		if (typeName == null)
			typeName = this.getClass().getAnnotation(SlabsType.class).value();
		return typeName;
	}
	
	public void toJson(OutputStream out) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(out, this);
		} catch (Exception e) {
			new SlabsException("Exception while writing json to outputStream", e);
		}
	}
	
	protected ObjectNode toInternalJson() {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode root = mapper.valueToTree(this);		
		root.remove("id");
		root.remove("revision");
		return root;
	}
	
	/**
	 * Returns a json object tree in the default database format
	 * {
	 * 		name: "<type name, as configured with the annotation>"
	 * 		obj: { <  the actual data of the object, as returned by toJson(false) > }
	 * }
	 * @return a jackson ObjectNode
	 */
	ObjectNode getDatabaseJson() {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode root = mapper.createObjectNode();
		root.put("name", getTypeName());
		root.put("obj", toInternalJson());
		return root;
	}
	
	public ObjectNode toJsonNode() {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.valueToTree(this);
	}
			
	public static <T> T fromJson(byte[] in, Class<T> clazz) {
		 MappingJsonFactory jsonFactory = new MappingJsonFactory(); // or, for data binding, org.codehaus.jackson.mapper.MappingJsonFactory 
		 try {
			JsonParser jp = jsonFactory.createJsonParser(in);
			return jp.readValueAs(clazz);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public static <T> T fromJson(InputStream in, Class<T> clazz) {
		 MappingJsonFactory jsonFactory = new MappingJsonFactory(); // or, for data binding, org.codehaus.jackson.mapper.MappingJsonFactory 
		 try {
			JsonParser jp = jsonFactory.createJsonParser(in);
			return jp.readValueAs(clazz);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		
	}

}
