package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.BuildServices;
import net.caprazzi.minima.framework.RequestInfo;

@SuppressWarnings("serial")
public class AppServlet extends HttpServlet {

	private final BuildServices service;

	public AppServlet(BuildServices service) {
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
		
		String path = req.getRequestURI().substring(req.getContextPath().length());
		handleDevelResourceRequest(path, resp);
	}
	
	
	// This will serve original files
	private void handleDevelResourceRequest(String requestURI,
			HttpServletResponse resp) throws IOException {
		
		if (requestURI.endsWith(".js")) {
			resp.setContentType("text/javascript");
		}
		else if (requestURI.endsWith(".css")) {
			resp.setContentType("text/css");
		}
		
		long now = new Date().getTime();
		long year = 1000 * 60 * 60 * 24 * 365;
		resp.addDateHeader("Last-Modified", now + year);
		resp.addDateHeader("Expires", now - year);
		resp.addHeader("Cache-control", "no-cache, must-revalidate");
		resp.addHeader("Pragma", "no-cache");
		
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
