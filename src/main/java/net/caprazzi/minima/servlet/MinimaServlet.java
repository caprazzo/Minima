package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.service.MinimaService;
import net.caprazzi.minima.service.MinimaService.CreateStory;
import net.caprazzi.minima.service.MinimaService.UpdateStory;

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
		if (!parts[2].equals("board")) {
			sendError(resp, 404, "not found");
			return;
		}
		
		resp.setContentType("application/json");
		Writer out = resp.getWriter();
		minimaService.writeBoard(out);
		out.close();
		return;
	}
	
	@Override
	protected void doPut(HttpServletRequest req, final HttpServletResponse resp)
			throws ServletException, IOException {
		
		String[] parts = req.getRequestURI().split("/");
		if (!parts[2].equals("story")) {
			sendError(resp, 404, "not found");
			return;
		}
		
		String key = parts[2];
		int revision = Integer.parseInt(parts[3]);
		byte[] story = IO.readBytes(req.getInputStream());
		minimaService.updateStory(key, revision, story, new UpdateStory() {

			@Override
			public void success(String key, int rev, byte[] jsonData) {
				sendJson(resp, 201, jsonData);
			}
			
			@Override
			public void collision(String key, int yourRev, int foundRev) {
				logger.warn("Collision while updating story ["+key+"@"+yourRev+"]: was expecting revision " + foundRev);
				sendError(resp, 409, "Could not update item ["+key+"@"+yourRev+"]: was expecting revision " + foundRev);
			}
			
			@Override
			public void error(String message, Exception e) {
				logger.error("Error while updating story " + message, e);
				sendError(resp, 500, "Internal Server Error");
			}
			
		});
	}
	
	@Override
	protected void doPost(HttpServletRequest req, final HttpServletResponse resp)
			throws ServletException, IOException {
		String[] parts = req.getRequestURI().split("/");
		
		if (!parts[2].equals("story")) {
			sendError(resp, 404, "not found");
			return;
		}
		
		minimaService.createStory(IO.readBytes(req.getInputStream()), new CreateStory() {
			@Override public void success(byte[] story) {
				sendJson(resp, 201, story);
			}
			@Override public void error(String string, Exception e) {
				logger.warn(string, e);
			}
		});
	}
	
	protected void sendJson(HttpServletResponse resp, int status, byte[] data) {
		try {
			resp.setContentType("application/json");
			resp.setStatus(201);
			ServletOutputStream out = resp.getOutputStream();
			out.write(data);
			out.close();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	protected void sendError(HttpServletResponse resp, int i, String message) {
		try  {
			resp.setStatus(500);	
			Writer w = resp.getWriter();
			w.write(message);
			w.flush();
		} catch (IOException e) {
			logger.error("Error writing to servlet output", e);
			throw new RuntimeException("Internal Server Error", e);
		}		
	}

}
