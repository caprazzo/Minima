package net.caprazzi.minima.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import net.caprazzi.minima.framework.ImportsDescriptor;

/**
 * App service helps to return minified and rolled client application files (js, css)
 */
public class MinimaAppService {

	private static final String SCRIPT_FMT = "<script src=\"%s%s\" type=\"text/javascript\"></script>";
	private static final String CSS_FMT = "<link href=\"%s%s\" rel=\"stylesheet\" type=\"text/css\"/>";
	
	private final ImportsDescriptor descriptor;

	public MinimaAppService(ImportsDescriptor descriptor) {
		this.descriptor = descriptor;
	}

	public String getDevelCssHtmlLink(String basepath) {
		return allLinks(CSS_FMT, basepath, descriptor.getCssPaths());
	}
	
	public String getDevelLibsHtmlLink(String basepath) {
		return allLinks(SCRIPT_FMT, basepath, descriptor.getLibsPaths());
	}
	
	public String getDevelMainHtmlLink(String basepath) {
		return allLinks(SCRIPT_FMT, basepath, descriptor.getMainPaths());
	}

	public String getProductionCssHtmlLink(String basepath) {
		return  String.format(CSS_FMT, basepath, "app/css");
	}
	
	public String getProductionLibsHtmlLink(String basepath) {
		return  String.format(SCRIPT_FMT, basepath, "app/libs");
	}
	
	public String getProductionMainHtmlLink(String basepath) {
		return  String.format(SCRIPT_FMT, basepath, "app/main");
	}
	
	public void writeProductionCssData(OutputStream out) throws IOException {
		writeAllFiles(out,  this.descriptor.getCssPaths());
	}

	public void writeProductionLibsData(OutputStream out) throws IOException {
		writeAllFiles(out,  this.descriptor.getLibsPaths());
	}

	public void writeProductionMainData(OutputStream out) throws IOException {
		writeAllFiles(out,  this.descriptor.getMainPaths());		
	}

	private void writeAllFiles(OutputStream out, String[] paths)
			throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		for (String path : paths) {
			try {
				baos.write(this.descriptor.getData(path));
			}
			catch (Exception ex) {
				throw new RuntimeException("Could not read data for " + path, ex);
			}
			baos.write("\n".getBytes());
		}
		baos.writeTo(out);
	}
	
	private String allLinks(String format, String basepath, String[] paths) {
		StringBuilder build = new StringBuilder();
		for (String path : paths) {
			build.append(String.format(format, basepath, path)).append("\n");
		}
		return build.toString();
	}
	
}
