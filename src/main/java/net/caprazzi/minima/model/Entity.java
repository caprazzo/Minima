package net.caprazzi.minima.model;

public interface Entity {
	byte[] toJson();
	void setId(String id);
	void setRevision(int revision);
}
