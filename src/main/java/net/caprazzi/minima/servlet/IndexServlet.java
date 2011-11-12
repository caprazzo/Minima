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
		if (info.isPath(req.getContextPath() + "/")) {
			resp.sendRedirect(req.getContextPath() + "/index");
			return;
		}
		
		if (!info.isPath(req.getContextPath() +  "/index")) {
			resp.sendError(404);
			return;
		}
		
		
		resp.setContentType("text/html");
		
		SkimpyTemplate index = build.getPage("index");
		
//		InputStream in = this.getClass().getClassLoader().getResourceAsStream("index.html");
			
		index
			.add("BOARD_TITLE", boardTitle)
			.add("READ_ONLY", req.getAttribute("minima.readonly").toString())
			.add("WEBSOCKET_LOCATION", websocketLocation.equals("auto") 
					? "ws://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath() + "/websocket" : websocketLocation)
			.add("DATA_LOCATION", req.getContextPath() + "/data")
			.add("COMET_LOCATION", req.getContextPath() + "/comet")
			.add("LOGIN_URL", req.getContextPath() + "/login")
			.add("TEMPLATES", build.getTemplatesHtml());
		
		if (req.getParameter("devel") != null) {
			index
				.add("CSS_IMPORTS", build.getDevelCssTags(req.getContextPath()))
				.add("LIB_IMPORTS", build.getDevelLibsTags(req.getContextPath()))
				.add("MAIN_IMPORTS", build.getDevelMainTags(req.getContextPath()));			
		}			
		else {
			index
				.add("CSS_IMPORTS", build.getProductionCssTag(req.getContextPath()))
				.add("LIB_IMPORTS", build.getProductionLibsTag(req.getContextPath()))
				.add("MAIN_IMPORTS", build.getProductionMainTag(req.getContextPath()));
		}

		PrintWriter writer = resp.getWriter();
		index.write(writer);
		writer.close();		
	}

	public void setTitle(String boardTitle) {
		this.boardTitle = boardTitle;		
	}

}
