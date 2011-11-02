package net.caprazzi.minima.servlet;

import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.util.resource.Resource;

/**
 * Serves static files from a directory in the classPath
 * @author mcaprari
 */
@SuppressWarnings("serial")
public class ClasspathFilesServlet extends DefaultServlet {

	private final String basePath;

	public ClasspathFilesServlet(String basePath) {
		this.basePath = basePath;
	}

	public Resource getResource(String pathInContext) {        		
		try {		
			return Resource.newClassPathResource(basePath + pathInContext);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	};

}
