package net.caprazzi.minima.framework;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.codehaus.jackson.map.ObjectMapper;
import org.eclipse.jetty.util.IO;
import org.eclipse.jetty.util.resource.Resource;

public class ImportsDescriptor {

	private String[] libs;
	private String[] css;
	private String[] main;
	private String[] templates;
	
	public String[] getTemplatesPaths() {
		return templates;
	}
	
	public void setTemplates(String[] templates) {
		this.templates = templates;
	}
	
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
		InputStream inputStream = resource.getInputStream();
		byte[] data = IO.readBytes(inputStream);
		inputStream.close();
		return data;
	}

	public String getTemplateId(String path) {
		String name = new File(path).getName();
		return name.substring(0, name.lastIndexOf("."));
	}

	public byte[] getTemplateData(String path) throws IOException {
		Resource resource = Resource.newClassPathResource(path);
		InputStream inputStream = resource.getInputStream();
		byte[] data = IO.readBytes(inputStream);
		inputStream.close();
		return data;
	}
	
}
