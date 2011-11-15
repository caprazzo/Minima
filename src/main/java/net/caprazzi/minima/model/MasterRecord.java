package net.caprazzi.minima.model;

import org.codehaus.jackson.map.ObjectMapper;

public class MasterRecord extends Entity {

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

	@Override
	public void setId(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setRevision(int revision) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getRevision() {
		// TODO Auto-generated method stub
		return 0;
	}

}
