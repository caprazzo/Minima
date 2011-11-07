package net.caprazzi.minima.framework;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.codehaus.jackson.map.ObjectMapper;
import org.eclipse.jetty.util.IO;
import org.eclipse.jetty.util.resource.Resource;

public class ImportsDescriptor {

	private String[] libs;
	private String[] css;
	private String[] main;
	
	public void setLibs(String[] libs) {
		this.libs = libs;
	}
	
	public String[] getLibsPaths() {
		return libs;
	}
	
	public void setCss(String[] css) {
		this.css = css;
	}
	
	public String[] getCssPaths() {
		return css;
	}
	
	public void setMain(String[] main) {
		this.main = main;
	}
	
	public String[] getMainPaths() {
		return this.main;
	}
	
	public static ImportsDescriptor fromFile(String path) {
		try {		
			Resource resource = Resource.newClassPathResource(path);
			ObjectMapper mapper = new ObjectMapper();
			return mapper.readValue(resource.getInputStream(), ImportsDescriptor.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public byte[] getData(String path) throws IOException {
		Resource resource = Resource.newClassPathResource("/htdocs/" + path);
		System.out.println(resource.getURL());
		System.out.println(resource.getFile().getAbsolutePath());
		return IO.readBytes(resource.getInputStream());
	}
	
}
