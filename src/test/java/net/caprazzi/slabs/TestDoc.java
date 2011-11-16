package net.caprazzi.slabs;

@SlabsType("test_doc") class TestDoc extends SlabsDoc {
	
	private String value;
	
	public TestDoc() {
	
	}
	
	public TestDoc(String key, int revision, String value) {
		this.setId(key);
		this.setRevision(revision);
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
}