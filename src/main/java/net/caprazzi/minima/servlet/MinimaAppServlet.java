package net.caprazzi.minima.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.BuildServices;
import net.caprazzi.minima.framework.RequestInfo;

public class MinimaAppServlet extends HttpServlet {

	private final BuildServices service;

	public MinimaAppServlet(BuildServices service) {
		this.service = service;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
				
		if (info.isPath(req.getContextPath() + "/app/libs")) {
			handleLibsRequest(info, req, resp);
			return;
		}
		
		if (info.isPath(req.getContextPath() + "/app/main")) {
			handleMainRequest(info, req, resp);
			return;
		}
		
		if (info.isPath(req.getContextPath() + "/app/css")) {
			handleCssRequest(info, req, resp);
			return;
		}
		
		handleDevelResourceRequest(req.getRequestURI(), resp);
	}
	
	// This will serve original files
	private void handleDevelResourceRequest(String requestURI,
			// TODO: disable caches
			// TODO: set content type? Mhh this could be js or css, can I guess from
			// the request? Does it matter?
			HttpServletResponse resp) throws IOException {
		ServletOutputStream out = resp.getOutputStream();
		service.writeFile(requestURI, out);
		out.close();
	}

	private void handleLibsRequest(RequestInfo info, HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");
		ServletOutputStream out = resp.getOutputStream();
		service.writeProductionLibsData(out);
		out.close();
	}

	private void handleCssRequest(RequestInfo info, HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("text/css");
		ServletOutputStream out = resp.getOutputStream();
		service.writeProductionCssData(out);
		out.close();
	}

	private void handleMainRequest(RequestInfo info, HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");
		ServletOutputStream out = resp.getOutputStream();
		service.writeProductionMainData(out);
		out.close();
	}
	
}
