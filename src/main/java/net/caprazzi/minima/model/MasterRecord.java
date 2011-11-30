package net.caprazzi.minima.model;

import net.caprazzi.slabs.SlabsDoc;
import net.caprazzi.slabs.SlabsType;

@SlabsType("master_record")
public class MasterRecord extends SlabsDoc {

	private String dbVersion;
	
	public String getDbVersion() {
		return dbVersion;
	}
	
	public void setDbVersion(String dbVersion) {
		this.dbVersion = dbVersion;
	}
	
}
