package net.caprazzi.minima.model;

import java.math.BigDecimal;

import org.codehaus.jackson.map.ObjectMapper;

public class StoryList implements ToJson {

	private BigDecimal pos;
	private String id;
	private String name;
	private int revision;
	private boolean archived;

	public StoryList(String id, String name, BigDecimal pos) {
		this.id = id;
		this.name = name;
		this.pos = pos;
	}
	
	public StoryList() {
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public BigDecimal getPos() {
		return pos;
	}
	
	public void setPos(BigDecimal pos) {
		this.pos = pos;
	}

	public static StoryList fromJson(byte[] data) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.readValue(data, StoryList.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public byte[] toJson() {
		ObjectMapper mapper = new ObjectMapper();
		 try {
			return mapper.writeValueAsBytes(this);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public void setRevision(int revision) {
		this.revision = revision;		
	}
	
	public int getRevision() {
		return revision;
	}
	
	public void setArchived(boolean archived) {
		this.archived = archived;
	}
	
	public boolean getArchived() {
		return this.archived;
	}

}
