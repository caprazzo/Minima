package net.caprazzi.slabs;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;

public abstract class SlabsDoc {

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
	
	/**
	 * Returns a json tree with this bean data, with or without 'id' and 'revision' fields
	 * @param includeIdAndRev
	 * @return
	 */
	public ObjectNode toJson(boolean includeIdAndRev) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode root = mapper.valueToTree(this);		
		if (!includeIdAndRev) {
			root.remove("id");
			root.remove("revision");
		}
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
		root.put("obj", toJson(false));
		return root;
	}
			
	final String getTypeName() {		
		if (typeName == null)
			typeName = this.getClass().getAnnotation(SlabsType.class).value();
		return typeName;
	}
	
}
