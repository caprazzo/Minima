package net.caprazzi.minima;

import java.math.BigDecimal;

/**
 * 
 * Position:
 * - first story in a board has position 2^16 (65536)
 * - new stories added after that have position last_story.pos + 65536
 * - when a story is placed before the first, its pos becomes first_story.pos / 2
 * - whan a story is placed between two other stories, its pos becomes high_story.pos + ((high_story.pos - low_story.pos)/2)
 *
 */
public class Story {

	private String id;
	private String desc;
	private String list;
	private BigDecimal pos;
	private int revision;
	private boolean archived;
	

	public Story() {
		// this constructor intentionally empty: jackson requires it for automagic mapping
	}
	
	public Story(String id, String desc, String list) {
		this.id = id;
		this.desc = desc;
		this.list = list;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setList(String list) {
		this.list = list;
	}
	
	public String getDesc() {
		return desc;
	}
	
	public void setDesc(String desc) {
		this.desc = desc;
	}
	
	public int getRevision() {
		return revision;
	}
	
	public void setRevision(int revision) {
		this.revision = revision;
	}
	
	public String getList() {
		return list;
	}
	
	public void setPos(BigDecimal pos) {
		this.pos = pos;
	}
	
	public BigDecimal getPos() {
		return pos;
	}
	
	public void setArchived(boolean archived) {
		this.archived = archived;
	}
	
	public boolean getArchived() {
		return this.archived;
	}

	@Override
	public boolean equals(Object object) {
		if (object == this) return true;
        if (object == null || getClass() != object.getClass()) return false;
        
        Story other = (Story) object;
        return (id.equals(other.id)
        	&& desc.equals(other.desc)
        	&& list.equals(other.list));
	}
	
	@Override
	public int hashCode() {
		throw new RuntimeException("not implemented");
	}
	
}
