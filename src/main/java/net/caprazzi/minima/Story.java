package net.caprazzi.minima;

public class Story {

	private String id;
	private String desc;
	private String list;
	private int revision;

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
