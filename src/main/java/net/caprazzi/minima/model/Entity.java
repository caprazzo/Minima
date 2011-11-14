package net.caprazzi.minima.model;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;

public abstract class Entity {
		
	public ObjectNode toJson(boolean includeIdAndRev) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode root = mapper.valueToTree(this);		
		if (includeIdAndRev) {
			root.put("id", getId());
			root.put("revision", getRevision());
		}
		return root;
	}
			
	@JsonIgnore	
	public abstract void setId(String id);
	
	@JsonIgnore 
	public abstract void setRevision(int revision);
	
	@JsonIgnore 
	public abstract String getId();
	
	@JsonIgnore 
	public abstract int getRevision();
	
}
