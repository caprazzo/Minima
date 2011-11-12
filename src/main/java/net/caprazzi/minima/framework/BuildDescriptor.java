package net.caprazzi.minima.framework;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;

import org.codehaus.jackson.map.ObjectMapper;
import org.eclipse.jetty.util.IO;
import org.eclipse.jetty.util.resource.Resource;

/**
 * Build descriptor for BuildServices. 
 * The descriptor describes how to find files of 4 different kinds.
 * 
 * css stylesheets
 * library javascript files - stuff like jquery and underscore.js
 * main javascript files - main app files
 * template files = html snippets to include in the index
 * pages
 * 
 * The resources are used to build the application index page.
 * 
 * It can be populated from a json file with this format:
 * {
 * 		libs: [],		// library files
 * 		main: [],		// application js files
 * 		css: [], 		// css files (application and 3rd party)
 * 		templates: [],	// templates
 * 		pages: [],		// pages
 * 					
 * }
 */
public class BuildDescriptor {

	private String[] libs;
	private String[] css;
	private String[] main;
	private String[] templates;
	private HashMap<String, String> pages;
	
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
	
	public String[] getExternalCssPaths() {
		return getExternalPaths("app", getCssPaths());
	}
	
	public String[] getExternalLibsPaths() {
		return getExternalPaths("app", getLibsPaths());
	}

	public String[] getExternalMainPaths() {
		return getExternalPaths("app", getMainPaths());
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
	
	public HashMap<String,String> getPages() {
		return pages;
	}
	
	public void setPages(HashMap<String, String> pages) {
		this.pages = pages;
	}
	
	public void writeData(String requestURI, OutputStream out) throws IOException {		
		String path = requestURI.substring("app/".length());
		
		Resource resource = Resource.newClassPathResource(path);
		
		if (resource == null)
			throw new IOException("could not find file in classpath: " + path);
	
		InputStream in = resource.getInputStream();
		IO.copy(in, out);
		in.close();
	}
	
	public static BuildDescriptor fromFile(String path) {
		try {		
			Resource resource = Resource.newClassPathResource(path);
			ObjectMapper mapper = new ObjectMapper();
			return mapper.readValue(resource.getInputStream(), BuildDescriptor.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public byte[] getData(String path) throws IOException {
		Resource resource = Resource.newClassPathResource(path);
		
		if (resource == null)
			throw new IOException("could not find file in classpath: " + path);
	
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

	public InputStream getPage(String name) throws IOException {
		String path = pages.get(name);
		Resource resource = Resource.newClassPathResource(path);
		return resource.getInputStream();
	}
	
	private String[] getExternalPaths(String prefix, String[] paths) {
		String[] external = new String[paths.length];
		for (int i=0; i<external.length; i++) {
			external[i] = prefix + paths[i];			
		}
		return external;
	}

}
