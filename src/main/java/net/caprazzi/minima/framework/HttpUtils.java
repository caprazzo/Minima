package net.caprazzi.minima.framework;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HttpUtils {
	
	private static Logger logger = LoggerFactory.getLogger(HttpUtils.class);

	public static void sendErrorJson(HttpServletResponse resp) throws IOException {		
		ServletOutputStream bos = resp.getOutputStream();
		bos.write("{}".getBytes());
		resp.setStatus(500);
		bos.close();
	}

	public static void sendNotFoundJson(HttpServletResponse resp) throws IOException {		
		ServletOutputStream bos = resp.getOutputStream();
		bos.write("{}".getBytes());
		resp.setStatus(404);
		bos.close();
	}
	
	public static void sendEmptyJson(HttpServletResponse resp) throws IOException {
		resp.setStatus(200);
		ServletOutputStream bos = resp.getOutputStream();
		bos.write("{}".getBytes());
		bos.close();			
	}
	
	public final static String readBodyAsString(InputStream is) throws IOException {
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();

		int nRead;
		byte[] data = new byte[16384];

		while ((nRead = is.read(data, 0, data.length)) != -1) {
			buffer.write(data, 0, nRead);
		}
		buffer.flush();
		return new String(buffer.toByteArray(), "UTF-8");
	}

	public static void sendNotAuthorized(HttpServletResponse resp) throws IOException {
		ServletOutputStream bos = resp.getOutputStream();
		bos.write("NOT AUTHORIZED".getBytes());
		resp.setStatus(500);
		bos.close();		
	}

	public static void sendError(HttpServletResponse resp) throws IOException {
		ServletOutputStream bos = resp.getOutputStream();
		bos.write("ERROR".getBytes());
		resp.setStatus(500);
		bos.close();		
	}

	public static void dumpHeaders(HttpServletRequest req) throws IOException {
		Enumeration<String> headerNames = req.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String name = headerNames.nextElement();
			logger.debug("HEADER {}: {}", name, req.getHeader(name));
		}
		logger.debug("BODY: {}", IOUtils.toString(req.getInputStream(), "UTF-8"));
	}

	public static void tagResponse(HttpServletResponse resp, String tag) {
		if (Taggable.class.isAssignableFrom(resp.getClass())) {
			((Taggable)resp).tag(tag);
		}
	}

}
