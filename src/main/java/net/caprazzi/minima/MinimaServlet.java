package net.caprazzi.minima;

import java.io.IOException;
import java.io.Writer;
import java.math.BigInteger;
import java.security.SecureRandom;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.MinimaService.Callback;

import org.eclipse.jetty.util.IO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MinimaServlet extends HttpServlet {

	private static Logger logger = LoggerFactory.getLogger("MinimaServlet");
	
	private final MinimaService minimaService;

	public MinimaServlet(MinimaService minimaService) {
		this.minimaService = minimaService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String[] parts = req.getRequestURI().split("/");
		if (parts[1].equals("board")) {
			logger.debug("GET /board");
			Writer out = resp.getWriter();
			minimaService.writeBoard(out);
			out.close();
			return;
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, final HttpServletResponse resp)
			throws ServletException, IOException {
		String[] parts = req.getRequestURI().split("/");
		if (parts[1].equals("story")) {
			int revision = 0;

			byte[] story = IO.readBytes(req.getInputStream());
			String key = randomString();
			minimaService.saveStory(key, revision, story, new Callback() {

				@Override
				public void success() {
					Writer out;
					try {
						out = resp.getWriter();
						minimaService.writeBoard(out);
						out.close();
					} catch (IOException e) {
						throw new RuntimeException(e);
					}
				}

				@Override
				public void error(String message, Exception e) {
					throw new RuntimeException(e);
				}
				
			});
			
		}
	}
	
	private static SecureRandom random = new SecureRandom();
	public static String randomString() {
		return new BigInteger(32, random).toString(32);
	}

}
