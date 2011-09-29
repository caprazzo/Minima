package net.caprazzi.minima;

import java.io.IOException;
import java.io.Writer;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MinimaService {

	private static final Logger logger = LoggerFactory.getLogger("MinimaService");
	
	private final Keez.Db db;

	public MinimaService(final Keez.Db db) {
		this.db = db;
	}

	public void writeBoard(final Writer out) {
		db.list(new List() {

			@Override
			public void entries(Iterable<Entry> entries) {
				ObjectMapper mapper = new ObjectMapper();
				
				JsonFactory factory = new JsonFactory();
				try {
					JsonGenerator json = factory.createJsonGenerator(out);
					json.writeStartObject();
					
					json.writeFieldName("stories");
					json.writeStartArray();
					
					for (Entry e : entries) {
						json.writeRawValue(new String(e.getData()));
					
					}
					
					json.writeEndArray();
					
					json.writeEndObject();
					json.flush();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
	}

	public void saveStory(String id, final int revision, final byte[] story, final Callback cb) {
		if (!validateStoryData(story, cb)) 
			return;
		
		db.put(id, revision, story, new Put() {

			@Override
			public void ok(String key, int rev) {
				cb.success();
			}

			@Override
			public void collision(String key, int yourRev, int foundRev) {
				cb.error("collision", new RuntimeException("collision"));
			}
			
			@Override
			public void error(String key, Exception e) {
				cb.error(key, e);
			}
		});
	}

	private boolean validateStoryData(final byte[] story, final Callback cb) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			Story read = mapper.readValue(story, Story.class);
			if (isEmpty(read.getDesc(), read.getList(), read.getId())) {
				cb.error("Data is missing some fields", new IllegalArgumentException("Data is missing some fields"));
			}
			return true;
		} catch (JsonParseException e) {
			cb.error("Error while parsing data", e);
		} catch (JsonMappingException e) {
			cb.error("Error mapping object", e);
		} catch (IOException e) {
			cb.error("IO error", e);
		}
		return false;
	}

	
	private boolean isEmpty(String... args) {
		for (String arg : args) {
			if (arg == null || arg.trim().length() == 0)
				return true;
		}
		return false;
	}

	protected byte[] asJson(Story story) {
		 ObjectMapper mapper = new ObjectMapper();
		 try {
			return mapper.writeValueAsBytes(story);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public static abstract class Callback {
		public abstract void success();
		public abstract void error(String string, Exception e);
	}

}
