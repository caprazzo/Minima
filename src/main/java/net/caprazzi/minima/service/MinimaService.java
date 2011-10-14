package net.caprazzi.minima.service;

import java.io.IOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.SecureRandom;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.Get;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.Stories;
import net.caprazzi.minima.Story;
import net.caprazzi.minima.servlet.MinimaPushServlet;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MinimaService {

	private static final Logger logger = LoggerFactory.getLogger("MinimaService");
	
	private final Keez.Db db;

	private final MinimaPushServlet pushServlet;

	public MinimaService(final Keez.Db db, MinimaPushServlet pushServlet) {
		this.db = db;
		this.pushServlet = pushServlet;
	}

	public void writeBoard(final Writer out) {
		db.list(new List() {

			@Override
			public void entries(Iterable<Entry> entries) {
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
					throw new RuntimeException("Error while wrinting board to output", e);
				}
			}
		});
	}
	
	public void createStory(String key, byte[] data, final CreateStory cb) {
		
		Story story = fromJson(data);
		story.setId(key);
		story.setRevision(1);	
		
		if (story.getPos() == null) {
			cb.error("Position must be specified", null);
			return;
		}
	
		db.put(key, 0, asJson(story), new Put() {

			@Override
			public void ok(String key, int rev) {
				logger.info("Created story [" + key + "]@" + rev);
				db.get(key, new Get() {

					@Override
					public void found(String key, int rev, byte[] data) {
						cb.success(fromJson(data));
					}

					@Override
					public void notFound(String key) {
						cb.error("just saved story not found", null);
					}

					@Override
					public void error(String key, Exception e) {
						cb.error("error while retrieveing just saved key " + key, e);
					}
					
				});
			}

			@Override
			public void collision(String key, int yourRev, int foundRev) {
				cb.error("Collision while creating " + key + "@" + yourRev + ": " + foundRev + " found in db", null);
			}
			
		});
		
	}

	public void updateStory(String id, final int revision, final byte[] storyData, final UpdateStory cb) {
		if (!validateStoryData(storyData, cb)) 
			return;
		
		Story story = fromJson(storyData);
		story.setId(id);
		story.setRevision(revision+1);	
		final byte[] writeData = asJson(story);
		db.put(id, revision, writeData, new Put() {

			@Override
			public void ok(String key, int rev) {
				logger.info("Saved story [" + key + "]@" + rev);
				cb.success(key, rev, writeData);
				pushServlet.send(writeData);
			}

			@Override
			public void collision(String key, int yourRev, int foundRev) {
				cb.collision(key, yourRev, foundRev);
			}
			
			@Override
			public void error(String key, Exception e) {
				logger.warn("Error on storing story [" + key + "]", e);
				cb.error(key, e);
			}
		});
	}
	
	public Story fromPostStoryJson(byte[] story) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			Stories postStory = mapper.readValue(story, Stories.class);
			return postStory.getStories().get(0);			
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public Story fromJson(byte[] story) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.readValue(story, Story.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	private boolean validateStoryData(final byte[] story, final Callback cb) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			Story read = mapper.readValue(story, Story.class);
			if (isEmpty(read.getDesc(), read.getList())) {
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

	public byte[] asJson(Story story) {
		 ObjectMapper mapper = new ObjectMapper();
		 try {
			return mapper.writeValueAsBytes(story);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public interface Callback {
		public abstract void error(String string, Exception e);
	}
	
	public static abstract class UpdateStory implements Callback {
		public abstract void success(String key, int revision, byte[] jsonData);
		public abstract void collision(String key, int yourRev, int foundRev);
	}
	
	public static abstract class CreateStory implements Callback  {
		public abstract void success(Story story);
	}
	
	private static SecureRandom random = new SecureRandom();
	public static String randomString() {
		return new BigInteger(32, random).toString(32);
	}


}
