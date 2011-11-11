package net.caprazzi.minima.framework;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;

import javax.servlet.ServletOutputStream;


/**
 * BuildService provides access to client resources (js, css and templates) in plain
 * or compiled form. This is used at runtime and, at the moment, there is no caching,
 * so the filesystem is hit.
 */
public class BuildServices {

	private final BuildDescriptor descriptor;

	/**
	 * Construct a new AppService using the given descriptor
	 * @param descriptor
	 */
	public BuildServices(BuildDescriptor descriptor) {
		this.descriptor = descriptor;
	}

	/**
	 * Get all developement <link> tags for css files
	 * @param basepath prefix for the file url
	 * @return
	 */
	public String getDevelCssTags(String basepath) {
		return allTags(CSS_FMT, fixPath(basepath), descriptor.getExternalCssPaths());
	}
	
	/**
	 * Get all development <script> tags for library files
	 * @param basepath prefix for the file url
	 * @return
	 */
	public String getDevelLibsTags(String basepath) {
		return allTags(SCRIPT_FMT, fixPath(basepath), descriptor.getExternalLibsPaths());
	}
	
	/**
	 * Get all development <script> tags for application files 
	 * @param basepath
	 * @return
	 */
	public String getDevelMainTags(String basepath) {
		return allTags(SCRIPT_FMT, fixPath(basepath), descriptor.getExternalMainPaths());
	}

	/**
	 * Get <link> tag to rolled-up css files
	 * @param basepath
	 * @return
	 */
	public String getProductionCssTag(String basepath) {
		return  String.format(CSS_FMT, fixPath(basepath), "app/css", "");
	}
	
	/**
	 * Get <script> tag to rolled-up library files
	 * @param basepath
	 * @return
	 */
	public String getProductionLibsTag(String basepath) {
		return  String.format(SCRIPT_FMT, fixPath(basepath), "app/libs", "");
	}
	
	/**
	 * Get <script> tag to rolled-up application files
	 * @param basepath
	 * @return
	 */
	public String getProductionMainTag(String basepath) {
		return  String.format(SCRIPT_FMT, fixPath(basepath), "app/main", "");
	}
	
	private String fixPath(String basepath) {
		return basepath.endsWith("/") ? basepath : basepath + "/"; 
	}

	/**
	 * Reads all css files and writes them out
	 * @param out
	 * @throws IOException
	 */
	public void writeProductionCssData(OutputStream out) throws IOException {
		writeAllFiles(this.descriptor.getCssPaths(),  out);
	}

	/**
	 * Reads all library files and writes them out
	 * @param out
	 * @throws IOException
	 */
	public void writeProductionLibsData(OutputStream out) throws IOException {
		writeAllFiles(this.descriptor.getLibsPaths(),  out);
	}

	/**
	 * Reads all application files and writes them out
	 * @param out
	 * @throws IOException
	 */
	public void writeProductionMainData(OutputStream out) throws IOException {
		writeAllFiles(this.descriptor.getMainPaths(),  out);		
	}
	
	/**
	 * Concatenates all template files after wrapping each one in
	 * a <script> tag with type=text/template and id = the file
	 * name with the extension trimmed. 
	 * @return the rolled-up templates
	 * @throws IOException
	 */
	public String getTemplatesHtml() throws IOException {
		StringBuilder html = new StringBuilder();
		for (String path : descriptor.getTemplatesPaths()) {
			String id = descriptor.getTemplateId(path);
			html.append("<script type=\"text/template\" id=\"" + id + "\">\n");
			html.append(new String(descriptor.getTemplateData(path)));
			html.append("\n</script>\n\n");
		}
		return html.toString();
	}
		
	/**
	 * All files passed in are written to the stream; \n is added after each file
	 * @param paths
	 * @param out
	 * @throws IOException
	 */
	private void writeAllFiles(String[] paths, OutputStream out)
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
	
	/**
	 * Builds <link> or <script> tags configured to load the given resource.
	 * Automatically adds a query parameter to defeat caches.
	 * @param format
	 * @param basepath
	 * @param paths
	 * @return
	 */
	private String allTags(String format, String basepath, String[] paths) {
		StringBuilder build = new StringBuilder();
		for (String path : paths) {
			build.append(String.format(format, basepath, path, "?" + getTimestamp())).append("\n");
		}
		return build.toString();
	}
	
	private static final String SCRIPT_FMT
		= "<script src=\"%s%s%s\" type=\"text/javascript\"></script>";
	private static final String CSS_FMT 
		= "<link href=\"%s%s%s\" rel=\"stylesheet\" type=\"text/css\"/>";
	
	private String getTimestamp() {
		return Long.toString((new Date().getTime()));
	}

	public SkimpyTemplate getPage(String name) throws IOException {
		return new SkimpyTemplate(descriptor.getPage(name));
	}

	public void writeFile(String requestURI, OutputStream out) throws IOException {
		descriptor.writeData(requestURI, out);
	}
	
}
