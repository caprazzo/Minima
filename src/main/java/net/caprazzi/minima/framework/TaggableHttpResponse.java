package net.caprazzi.minima.framework;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;


/**
 *	Wrapper for HttpServletResponse that provides the ability to attach descriptive
 *  string to responses. This is useful for better logging and debugging  
 */
public class TaggableHttpResponse extends HttpServletResponseWrapper implements Taggable {

	private StringBuilder builder = new StringBuilder();

	public TaggableHttpResponse(HttpServletResponse response) {
		super(response);
	}
	
	public void tag(String tag) {
		this.builder.append(" [");
		this.builder.append(tag);
		this.builder.append("]");
	}
	
	public String getTag() {
		return this.builder.toString();
	}
	
}