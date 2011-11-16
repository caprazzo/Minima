package net.caprazzi.minima.service;

import java.io.Writer;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.model.Entity;
import net.caprazzi.minima.model.Meta;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataService {

	private static final Logger logger = LoggerFactory.getLogger("MinimaService");

	public final Keez.Db db;

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
	
	private void update(String id, final int revision, final Entity e, final Update cb) {
		e.setId(id);
		e.setRevision(revision + 1);
		
		final Meta<Entity> meta = Meta.wrap(e);
		final byte[] writeData = meta.toJson();
		
		db.put(id, revision, writeData, new Put() {

			@Override
			public void ok(String key, int rev) {
				logger.info("Saved object [" + key + "]@" + rev);
				cb.success(key, revision, e);
				pushServlet.send(meta);
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
	
	public void writeJsonBoard(final Writer out) {
		db.list(new List() {

			@Override
			public void entries(Iterable<Entry> entries) {
				ObjectMapper mapper = new ObjectMapper();
				ObjectNode root = mapper.createObjectNode();
				
				ArrayNode stories = mapper.createArrayNode();
				root.put("stories", stories);
				
				ArrayNode lists = mapper.createArrayNode();
				root.put("lists", lists);
				
				for(Entry entry : entries) {
					Meta<?> meta = Meta.fromJson(entry.getData());
					ObjectNode json = meta.getObj().toJson(true);
					if (meta.getName().equals("list")) {						
						lists.add(json);
					}
					else  if (meta.getName().equals("story")) {
						stories.add(json);
					}
					
					json.put("id", entry.getKey());
					json.put("revision", entry.getRevision());
				}				
				
				try {					
					mapper.writeValue(out, root);
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}

			@Override
			public void notFound() {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void error(Exception ex) {
				// TODO Auto-generated method stub
				
			}
			
		});
	}

}
