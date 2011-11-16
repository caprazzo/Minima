package net.caprazzi.minima.model;

import java.math.BigDecimal;

import javax.servlet.ServletInputStream;

import net.caprazzi.slabs.SlabsDoc;
import net.caprazzi.slabs.SlabsType;

@SlabsType("story")
public class Note extends SlabsDoc {

	private String desc;
	private String list;
	private BigDecimal pos;
	private boolean archived;
	
	public String getDesc() {
		return desc;
	}
	
	public void setDesc(String desc) {
		this.desc = desc;
	}
	
	public String getList() {
		return list;
	}
	
	public void setList(String list) {
		this.list = list;
	}
	
	public BigDecimal getPos() {
		return pos;
	}
	
	public void setPos(BigDecimal pos) {
		this.pos = pos;
	}
	
	public boolean isArchived() {
		return archived;
	}
	
	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public static Note fromJson(ServletInputStream servletInputStream) {
		return SlabsDoc.fromJson(servletInputStream, Note.class);
	}
	
}
