package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.BuildServices;
import net.caprazzi.minima.framework.RequestInfo;
import net.caprazzi.minima.framework.SkimpyTemplate;

@SuppressWarnings("serial")
public class IndexServlet extends HttpServlet {

	private String boardTitle;
	private final String websocketLocation;
	private final BuildServices build;

	public IndexServlet(String websocketLocation, BuildServices buildService) {
		this.websocketLocation = websocketLocation;
		this.build = buildService;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
		String contextPath = req.getContextPath();
		
		if (info.isPath(contextPath + "/")) {
			resp.sendRedirect(contextPath + "/index");
			return;
		}
		
		if (!info.isPath(contextPath +  "/index")) {
			resp.sendError(404);
			return;
		}
		
		Boolean readonly = req.getParameter("readonly") != null 
				|| (Boolean)req.getAttribute("minima.readonly");
		
		resp.setContentType("text/html");
		SkimpyTemplate index = build.getPage("index");
		index
			.add("BOARD_TITLE", boardTitle)
			.add("READ_ONLY", readonly.toString())
			.add("WEBSOCKET_LOCATION", websocketLocation.equals("auto") 
					? "ws://" + req.getServerName() + ":" + req.getServerPort() + contextPath + "/websocket" : websocketLocation)
			.add("DATA_LOCATION", contextPath + "/data")
			.add("COMET_LOCATION", contextPath + "/comet")
			.add("LOGIN_URL", contextPath + "/login")
			.add("TEMPLATES", build.getTemplatesHtml());
		
		if (req.getParameter("devel") != null) {
			index
				.add("CSS_IMPORTS", build.getDevelCssTags(contextPath))
				.add("LIB_IMPORTS", build.getDevelLibsTags(contextPath))
				.add("MAIN_IMPORTS", build.getDevelMainTags(contextPath));			
		}			
		else {
			index
				.add("CSS_IMPORTS", build.getProductionCssTag(contextPath))
				.add("LIB_IMPORTS", build.getProductionLibsTag(contextPath))
				.add("MAIN_IMPORTS", build.getProductionMainTag(contextPath));
		}

		PrintWriter writer = resp.getWriter();
		index.write(writer);
		writer.close();		
	}

	public void setTitle(String boardTitle) {
		this.boardTitle = boardTitle;		
	}

}
