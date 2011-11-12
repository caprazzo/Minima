package net.caprazzi.minima.service;

import java.io.Writer;
import java.util.ArrayList;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.model.Meta;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;
import net.caprazzi.minima.model.Entity;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataService {

	private static final Logger logger = LoggerFactory.getLogger("MinimaService");

	private final Keez.Db db;

	private final PushService pushServlet;

	public DataService(final Keez.Db db, PushService pushService) {
		this.db = db;
		this.pushServlet = pushService;
	}
	
	public static abstract class  Update {
		public abstract void success(String key, int revision, Entity updated);
		public abstract void collision(String key, int yourRev, int foundRev);
		public abstract void error(String string, Exception e);
	}
	
	public void update(String id, final int revision, final Entity e, final Update cb) {
		e.setId(id);
		e.setRevision(revision + 1);
		
		final Meta<Entity> meta = Meta.wrap(e);
		final byte[] writeData = meta.toJson();
		
		db.put(id, revision, writeData, new Put() {

			@Override
			public void ok(String key, int rev) {
				logger.info("Saved object [" + key + "]@" + rev);
				cb.success(key, revision, meta.getObj());
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

	public void writeBoard(final Writer out) {
		db.list(new List() {

			@Override
			public void entries(Iterable<Entry> entries) {
				
				JsonFactory factory = new JsonFactory();
				try {
					
					ArrayList<Story> stories = new ArrayList<Story>();
					ArrayList<StoryList> lists = new ArrayList<StoryList>();
					
					for(Entry e : entries) {
						Meta<?> meta = Meta.fromJson(e.getData());
						if (meta.getName().equals("list")) {
							StoryList list = (StoryList) meta.getObj();
							list.setRevision(e.getRevision());
							lists.add(list);
						}
						else if (meta.getName().equals("story")) {
							stories.add((Story) meta.getObj());
						}
					}
					
					JsonGenerator json = factory.createJsonGenerator(out);
					json.writeStartObject();
					
					json.writeFieldName("stories");
					json.writeStartArray();
					
					for (Story s : stories) {
						json.writeRawValue(new String(s.toJson()));
					}
					
					json.writeEndArray();
					
					json.writeFieldName("lists");
					json.writeStartArray();
					
					for(StoryList l : lists) {
						json.writeRawValue(new String(l.toJson()));
					}
					json.writeEndArray();
					
					
					json.writeEndObject();
					json.flush();
				} catch (Exception e) {
					e.printStackTrace();
					throw new RuntimeException("Error while wrinting board to output", e);
				}
			}
		});
	}
	
}
