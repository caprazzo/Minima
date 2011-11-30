package net.caprazzi.minima.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.BuildServices;
import net.caprazzi.minima.framework.HttpUtils;
import net.caprazzi.minima.framework.RequestInfo;

import org.eclipse.jetty.http.HttpMethods;

@SuppressWarnings("serial")
public class AppServlet extends HttpServlet {

	private final BuildServices service;
	
	private ByteArrayOutputStream gzipCss;
	private ByteArrayOutputStream gzipMain;
	private ByteArrayOutputStream gzipLibs;

	private ByteArrayOutputStream plainLibs;
	private ByteArrayOutputStream plainMain;
	private ByteArrayOutputStream plainCss;

	public AppServlet(BuildServices service) throws IOException {
		this.service = service;
		primeLibsCaches();
		primeCssCaches();
		primeMainCaches();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
				
		if (info.isPath(req.getContextPath() + "/app/libs")) {
			handleLibsRequest(req, resp);
			return;
		}
		
		if (info.isPath(req.getContextPath() + "/app/main")) {
			handleMainRequest(req, resp);
			return;
		}
		
		if (info.isPath(req.getContextPath() + "/app/css")) {
			handleCssRequest(req, resp);
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
	
	private void handleLibsRequest(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");
		if (acceptGzip(req))
			sendCompressed(gzipLibs, resp);
		else
			sendCache(plainLibs, resp);
	}

	private void handleCssRequest(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("text/css");
		if (acceptGzip(req))
			sendCompressed(gzipCss, resp);
		else
			sendCache(plainCss, resp);
	}
	
	private void handleMainRequest(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");
		if (acceptGzip(req))
			sendCompressed(gzipMain, resp);
		else
			sendCache(gzipLibs, resp);
	}
	
	private void primeLibsCaches() throws IOException {
		plainLibs = new ByteArrayOutputStream();
		service.writeProductionLibsData(plainLibs);
		plainLibs.close();
		
		gzipLibs = new ByteArrayOutputStream();
		OutputStream gzout = new GZIPOutputStream(gzipLibs);
		plainLibs.writeTo(gzout);
		gzout.close();
	}
	
	private void primeMainCaches() throws IOException {
		plainMain = new ByteArrayOutputStream();
		service.writeProductionMainData(plainMain);
		plainMain.close();
		
		gzipMain = new ByteArrayOutputStream();
		OutputStream gzout = new GZIPOutputStream(gzipMain);
		plainMain.writeTo(gzout);
		gzout.close();
	}

	private void primeCssCaches() throws IOException {
		plainCss = new ByteArrayOutputStream();
		service.writeProductionCssData(plainCss);
		plainCss.close();
		
		gzipCss = new ByteArrayOutputStream();
		OutputStream gzout = new GZIPOutputStream(gzipCss);
		plainCss.writeTo(gzout);
		gzout.close();
	}
	
	private void sendCache(ByteArrayOutputStream cache, HttpServletResponse resp) throws IOException {
		ServletOutputStream out = resp.getOutputStream();
		cache.writeTo(out);
		out.close();
	}
	
	private void sendCompressed(ByteArrayOutputStream cache, HttpServletResponse resp) throws IOException {
		resp.setHeader("Content-Encoding","gzip");
		sendCache(cache, resp);
	}
	
	private boolean acceptGzip(HttpServletRequest req) {
		String ae = req.getHeader("accept-encoding");
        return ae != null 
        		&& ae.indexOf("gzip")>=0 
        		&& !HttpMethods.HEAD.equalsIgnoreCase(req.getMethod());
	}
	
}
