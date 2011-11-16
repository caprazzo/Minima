package net.caprazzi.minima.model;

import java.io.InputStream;
import java.math.BigDecimal;

import net.caprazzi.slabs.SlabsDoc;
import net.caprazzi.slabs.SlabsType;

@SlabsType("list")
public class List extends SlabsDoc {

	private BigDecimal pos;
	private String name;
	private boolean archived;
	
	public BigDecimal getPos() {
		return pos;
	}
	
	public void setPos(BigDecimal pos) {
		this.pos = pos;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public boolean isArchived() {
		return archived;
	}
	
	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public static List fromJson(InputStream in) {
		return SlabsDoc.fromJson(in, List.class);		
	}
	
}
