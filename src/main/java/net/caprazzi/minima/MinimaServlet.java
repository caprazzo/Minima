package net.caprazzi.minima;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.math.BigInteger;
import java.security.SecureRandom;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.MinimaService.UpdateStory;

import org.eclipse.jetty.util.IO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
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
	protected void doPut(HttpServletRequest req, final HttpServletResponse resp)
			throws ServletException, IOException {
		String[] parts = req.getRequestURI().split("/");
		if (parts[1].equals("story")) {
			String key = parts[2];
			int revision = Integer.parseInt(parts[3]);
			byte[] story = IO.readBytes(req.getInputStream());
			minimaService.updateStory(key, revision, story, new UpdateStory() {

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
					try  {
						resp.setStatus(500);	
						Writer w = resp.getWriter();
						w.write(e.getMessage());
						w.flush();
					} catch (IOException e1) {
						throw new RuntimeException(e);
					}
				}
				
			});
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, final HttpServletResponse resp)
			throws ServletException, IOException {
		String[] parts = req.getRequestURI().split("/");
		if (parts[1].equals("story")) {
			byte[] story = IO.readBytes(req.getInputStream());
			minimaService.createStory(story, new MinimaService.CreateStory() {
				@Override
				public void success(byte[] story) {
					resp.setStatus(201);
					ServletOutputStream out;
					try {
						out = resp.getOutputStream();
						out.write(story);
						out.close();					
					} catch (IOException e) {
						throw new RuntimeException(e);
					}
				}
				
				@Override
				public void error(String string, Exception e) {
					logger.warn(string, e);
				}
			});
		}
	}
	
	
}
