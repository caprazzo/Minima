package net.caprazzi.slabs;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;

import com.google.common.base.Function;
import com.google.common.collect.Iterables;

/**
 * Slabs implementations based on Keez
 */
public class SlabsOnKeez implements Slabs {

	private final Db db;
	private Class<?>[] typeMap;

	public SlabsOnKeez(Db db, Class<? extends SlabsDoc>[] types) {
		this.db = db;
		typeMap = setupTypes(types);
	}		
	
	/* (non-Javadoc)
	 * @see net.caprazzi.slabs.Slabs#list(net.caprazzi.slabs.SlabsOnKeez.SlabsList)
	 */
	@Override
	public void list(final SlabsList list) {
 		db.list(new List() {
			@Override
			public void entries(Iterable<Entry> entries) {
				list.callEntries(Iterables.transform(entries, entriesToDocs));
			}

			@Override
			public void notFound() {
				list.callNotFound();
			}

			@Override
			public void error(Exception ex) {
				list.callError(ex);
			}
			
			@Override
			public void applicationError(Exception ex) {
				list.callApplicationError(ex);
			}
		});	
	}
	
	private Function<Keez.Entry, SlabsDoc> entriesToDocs = new Function<Keez.Entry, SlabsDoc>() {
		@Override
		public SlabsDoc apply(Entry e) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				ObjectNode root = mapper.readValue(e.getData(), ObjectNode.class);
				String typeName = root.get("name").getTextValue();
				Class<?> clz = getType(typeName);						
				SlabsDoc doc = (SlabsDoc) mapper.readValue(root.get("obj"), clz);
				doc.setId(e.getKey());
				doc.setRevision(e.getRevision());
				return doc;
			} catch (Exception ex) {				
				throw new RuntimeException();
			}
		}
	};
	
	@Override
	public void put(final SlabsDoc doc, final SlabsPut callback) {
		byte[] data;
		try {
			ObjectNode databaseJson = doc.getDatabaseJson();
			ObjectMapper mapper = new ObjectMapper();
			data = mapper.writeValueAsBytes(databaseJson);
		} catch (Exception e) {
			callback.callError(doc.getId(), e);
			return;
		} 
		
		db.put(doc.getId(), doc.getRevision(), data, new Put() {

			@Override
			public void collision(String key, int yourRev, int foundRev) {
				callback.callCollision(key, yourRev, foundRev);
			}

			@Override
			public void error(String key, Exception ex) {
				callback.callError(key, ex);
			}

			@Override
			public void ok(String key, int revision) {
				doc.setId(key);
				doc.setRevision(revision);
				callback.callOk(doc);
			}
		});
	}
	
	private Class<?>[] setupTypes(Class<? extends SlabsDoc>[] types) {
		Class<?>[] clz = new Class[types.length];		
		for (Class<?> t : types) {			
			String typeName = t.getAnnotation(SlabsType.class).value();
			clz[typeName.hashCode() % clz.length] = t;
		}
		return clz;
	}
	
	private Class<?> getType(String name) {
		return typeMap[name.hashCode() % typeMap.length];
	}
	
	/*
    /**********************************************************
    /* Callbacks
    /**********************************************************
     */
	
	public static abstract class Callback {
		public void applicationError(SlabsException ex) {
			ex.printStackTrace();
		}
		
		void callApplicationError(Exception ex) {
			try {
				applicationError(new SlabsException(ex));
			}
			catch (Exception e) {
				System.err.println("Exception while executing applicationError");
				e.printStackTrace();
			}
		}
	}
	
	public static abstract class SlabsPut extends Callback {
		
		public abstract void ok(SlabsDoc doc);

		public abstract void collision(String id, int yourRev, int foundRev);

		public abstract void error(String id, SlabsException e);

		final void callError(String id, Exception e) {
			try {
				error(id, new SlabsException(e));
			}
			catch(Exception ex) {
				callApplicationError(ex);
			}
		}

		final void callOk(SlabsDoc doc) {
			try {
				ok(doc);
			}
			catch(Exception ex) {
				callApplicationError(ex);
			}
		}

		public final void callCollision(String id, int yourRev, int foundRev) {
			try {
				collision(id, yourRev, foundRev);
			}
			catch(Exception ex) {
				callApplicationError(ex);
			}
		}
	}
	
	public static abstract class SlabsList extends Callback {
		
		public abstract void entries(Iterable<SlabsDoc> docs);
		
		public abstract void error(SlabsException ex);
		
		public abstract void notFound();
		
		protected final void callEntries(Iterable<SlabsDoc> docs) {
			try {
				entries(docs);
			}
			catch (Exception ex) {
				callApplicationError(ex);
			}
		}
		
		public final void callError(Exception ex) {
			try {
				error(new SlabsException(ex));
			}
			catch (Exception e) {
				callApplicationError(ex);
			}
		}

		public final void callNotFound() {
			try {
				notFound();
			}
			catch (SlabsException ex) {
				callApplicationError(ex);
			}
		}
	}
	
	public interface SlabsDelete {
		
	}
	
}
