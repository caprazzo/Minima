package net.caprazzi.minima.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;

import net.caprazzi.minima.framework.HttpUtils;
import net.caprazzi.minima.framework.RequestInfo;
import net.caprazzi.minima.service.MinimaAppService;

public class MinimaAppServlet extends HttpServlet {

	
	private final MinimaAppService service;

	@Inject
	public MinimaAppServlet(MinimaAppService service) {
		this.service = service;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
		
		System.out.println(req.getContextPath() + "app/lib");
		System.out.println(req.getRequestURI());
		
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
		
		HttpUtils.sendNotFoundJson(resp);
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
