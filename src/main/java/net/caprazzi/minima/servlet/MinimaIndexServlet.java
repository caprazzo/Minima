package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.RequestInfo;
import net.caprazzi.minima.framework.SkimpyTemplate;
import net.caprazzi.minima.service.MinimaAppService;

import org.eclipse.jetty.util.IO;

import com.google.inject.Inject;

@SuppressWarnings("serial")
public class MinimaIndexServlet extends HttpServlet {

	private String boardTitle;
	private final String websocketLocation;
	private final MinimaAppService appService;

	@Inject
	public MinimaIndexServlet(String websocketLocation, MinimaAppService appService) {
		this.websocketLocation = websocketLocation;
		this.appService = appService;
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
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("index.html");
		PrintWriter writer = resp.getWriter();
		
		
		SkimpyTemplate template = new SkimpyTemplate(in)
			.add("BOARD_TITLE", boardTitle)
			.add("READ_ONLY", req.getAttribute("minima.readonly").toString())
			.add("WEBSOCKET_LOCATION", websocketLocation.equals("auto") 
					? "ws://" + req.getServerName() + ":" + req.getServerPort() + "/" + req.getContextPath() + "websocket" : websocketLocation)
			.add("DATA_LOCATION", req.getContextPath() + "/data")
			.add("COMET_LOCATION", req.getContextPath() + "/comet")
			.add("LOGIN_URL", req.getContextPath() + "/login")
			.add("TEMPLATES", appService.getTemplatesHtml());
		
		if (req.getParameter("devel") != null) {
			template
				.add("CSS_IMPORTS", appService.getDevelCssHtmlLink(req.getContextPath()))
				.add("LIB_IMPORTS", appService.getDevelLibsHtmlLink(req.getContextPath()))
				.add("MAIN_IMPORTS", appService.getDevelMainHtmlLink(req.getContextPath()));			
		}			
		else {
			template
				.add("CSS_IMPORTS", appService.getProductionCssHtmlLink(req.getContextPath()))
				.add("LIB_IMPORTS", appService.getProductionLibsHtmlLink(req.getContextPath()))
				.add("MAIN_IMPORTS", appService.getProductionMainHtmlLink(req.getContextPath()));
		}

		template.write(writer);
		writer.close();
		in.close();
	}

	public void setTitle(String boardTitle) {
		this.boardTitle = boardTitle;		
	}

}
