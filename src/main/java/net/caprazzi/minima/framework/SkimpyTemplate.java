package net.caprazzi.minima.framework;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;

import org.eclipse.jetty.util.IO;

/**
 * Poor man templating system
 */
public class SkimpyTemplate {

	private String template;

	public SkimpyTemplate(InputStream inputStream) throws IOException {
		template = IO.toString(inputStream);
	}

	public SkimpyTemplate add(String key, String value) {
		template = template.replaceAll("\\{\\{ " + key + " \\}\\}", value);
		return this;
	}

	public void write(Writer out) throws IOException {
		out.write(template);
	}

}