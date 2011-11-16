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

public class Slabs {

	private final Db db;
	private Class<?>[] typeMap;

	public Slabs(Db db, Class<? extends SlabsDoc>[] types) {
		this.db = db;
		typeMap = setupTypes(types);
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
	
	private Function<Keez.Entry, SlabsDoc> fun = new Function<Keez.Entry, SlabsDoc>() {
		@Override
		public SlabsDoc apply(Entry e) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				ObjectNode root = mapper.readValue(e.getData(), ObjectNode.class);
				String typeName = root.get("name").getTextValue();
				Class<?> clz = getType(typeName);						
				return (SlabsDoc) mapper.readValue(root.get("obj"), clz);
			} catch (Exception ex) {				
				throw new RuntimeException();
			}
		}
	};
	
	public void list(final SlabsList list) {
		db.list(new List() {
			@Override
			public void entries(Iterable<Entry> entries) {
				try {
					list.entries(Iterables.transform(entries, fun));
				}
				catch (Exception ex) {
					list.error("Error while listing database", ex);
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
	
	public void put(SlabsDoc doc, SlabsPut cb) {
		byte[] data = null;
		
		/*
		try {
			data = doc.getSlabData();
		} catch (SlabsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		*/
		
		db.put(doc.getId(), doc.getRevision(), data, new Put() {

			@Override
			public void collision(String arg0, int arg1, int arg2) {
				// TODO Auto-generated method stub
			}

			@Override
			public void error(String arg0, Exception arg1) {
				// TODO Auto-generated method stub
			}

			@Override
			public void ok(String arg0, int arg1) {
				// TODO Auto-generated method stub
			}
			
		});
	}	
	
	public interface SlabsGet {
		
	}
	
	public interface SlabsPut {
		
	}
	
	public interface SlabsList {
		public abstract void entries(Iterable<SlabsDoc> docs);
		public abstract void error(String string, Exception ex);
	}
	
	public interface SlabsDelete {
		
	}
	
}
