package net.caprazzi.minima.model;

import org.codehaus.jackson.map.ObjectMapper;

public class MasterRecord {

	private String dbVersion;
	
	public String getDbVersion() {
		return dbVersion;
	}
	
	public void setDbVersion(String dbVersion) {
		this.dbVersion = dbVersion;
	}
	
	public static MasterRecord fromJson(byte[] data) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.readValue(data, MasterRecord.class);
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

}
