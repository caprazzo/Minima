package net.caprazzi.minima.servlet;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.http.HttpMethods;

import net.caprazzi.minima.framework.BuildServices;
import net.caprazzi.minima.framework.HttpUtils;
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
		
		HttpUtils.sendNoCacheHeaders(resp);
		
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

	private ByteArrayOutputStream baos;
	private void handleCssRequest(RequestInfo info, HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("text/css");
		
		
		OutputStream out = resp.getOutputStream();
		if (acceptGzip(req)) {
			resp.setHeader("Content-Encoding","gzip");
			if (baos != null) {
				baos.writeTo(out);
				out.close();
				return;
			}
			baos = new ByteArrayOutputStream();
			OutputStream gzout = new GZIPOutputStream(new BufferedOutputStream(baos));
			service.writeProductionCssData(gzout);
			gzout.close();
			baos.writeTo(out);
			out.close();
			return;
		}		 
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
	
	private boolean acceptGzip(HttpServletRequest req) {
		String ae = req.getHeader("accept-encoding");
        return ae != null 
        		&& ae.indexOf("gzip")>=0 
        		&& !HttpMethods.HEAD.equalsIgnoreCase(req.getMethod());
	}
	
}
