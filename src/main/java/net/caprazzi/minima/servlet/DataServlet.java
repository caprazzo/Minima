package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.RequestInfo;
import net.caprazzi.minima.model.Entity;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;
import net.caprazzi.minima.service.DataService;
import net.caprazzi.minima.service.DataService.Update;

import org.codehaus.jackson.map.ObjectMapper;
import org.eclipse.jetty.util.IO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
public class DataServlet extends HttpServlet {

	private static Logger logger = LoggerFactory.getLogger("MinimaServlet");
	
	private final DataService minimaService;

	private final String webroot;
	private ObjectMapper mapper = new ObjectMapper();

	public DataServlet(String webroot, DataService minimaService) {
		this.webroot = webroot;
		this.minimaService = minimaService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
		if (!info.isPath(webroot + "/data/stories")) {
			sendError(resp, 404, "not found");
			return;
		}
		
		resp.setContentType("application/json");
		Writer out = resp.getWriter();
		minimaService.writeJsonBoard(out);
		out.close();
		return;
	}
	
	@Override
	protected void doPut(HttpServletRequest req, final HttpServletResponse resp)
			throws ServletException, IOException {
		
		if (req.getAttribute("minima.readonly").equals(true)) {
			sendError(resp, 403, "not authorised");
			return;
		}
		
		RequestInfo info = RequestInfo.fromRequest(req);
		
		if (info.isPath(webroot + "/data/stories/_/_")) {
			saveStory(req, resp, info);
			return;
		}
		
		if (info.isPath(webroot + "/data/lists/_/_")) {
			saveList(req, resp, info);
			return;
		}
		
		sendError(resp, 404, "not found");
	}
	
	private void saveList(HttpServletRequest req, final HttpServletResponse resp,
			RequestInfo info) throws IOException {
		
		String id = info.get(-2);
		int revision = Integer.parseInt(info.get(-1));
		byte[] data = IO.readBytes(req.getInputStream());
		StoryList list = StoryList.fromJson(data);
		
		update(resp, id, revision, list);
	}

	private void saveStory(HttpServletRequest req,
			final HttpServletResponse resp, RequestInfo info)
			throws IOException {
		
		String id = info.get(-2);
		int revision = Integer.parseInt(info.get(-1));
		byte[] storyJson = IO.readBytes(req.getInputStream());
		Story story = Story.fromJson(storyJson);
		
		update(resp, id, revision, story);
	}
	
	private void update(final HttpServletResponse resp, String id, int revision, Entity e) {
		minimaService.update(id, revision, e, new Update() {

			@Override
			public void error(String message, Exception e) {
				logger.error("Error while updating story " + message, e);
				sendError(resp, 500, "Internal Server Error");
			}
	
			@Override
			public void collision(String key, int yourRev, int foundRev) {
				logger.warn("Collision while updating item ["+key+"@"+yourRev+"]: was expecting revision " + foundRev);
				sendError(resp, 409, "Could not update item ["+key+"@"+yourRev+"]: was expecting revision " + foundRev);
			}
	
			@Override
			public void success(String key, int revision, Entity updated) {
				try {
					sendJson(resp, 201, mapper.writeValueAsBytes(updated.toJson(true)));
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}
		});
	}
	
	private static void sendJson(HttpServletResponse resp, int status, byte[] data) {
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
	
	private static void sendError(HttpServletResponse resp, int i, String message) {
		try  {
			resp.setStatus(i);	
			Writer w = resp.getWriter();
			w.write(message);
			w.flush();
		} catch (IOException e) {
			logger.error("Error writing to servlet output", e);
			throw new RuntimeException("Internal Server Error", e);
		}		
	}

}
