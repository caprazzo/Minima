package net.caprazzi.minima.servlet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.caprazzi.minima.framework.RequestInfo;

public class PrivacyFilter implements Filter {

	private final boolean requireSessionToView;
	private final boolean requireSessionToEdit;
	
	public PrivacyFilter(boolean requireSessionToView, boolean requireSessionToEdit) {
		this.requireSessionToView = requireSessionToView;
		this.requireSessionToEdit = requireSessionToEdit;
	}
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		
	}
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;
		
		RequestInfo info = RequestInfo.fromRequest(req);
		
		boolean hasSession = (req.getSession(false) != null);
		
		boolean allowEdit = !requireSessionToEdit || hasSession;
		boolean allowView = allowEdit || (!requireSessionToView || hasSession);
		
		request.setAttribute("minima.readonly", !allowEdit);
		
		// redirect /index to /login if login required
		if (info.isGet("{ctx}/index") && !allowView) {
			resp.sendRedirect(req.getContextPath() + "/login");
			return;
		}

		// redirect /login to /index if login not required
		if (info.isGet("{ctx}/login") && allowEdit && allowView) {
			resp.sendRedirect(req.getContextPath() + "/index");
			return;
		}
		
		// let pass requests to /login if login is required
		if (info.isPath("{ctx}/login") && (!allowView || !allowEdit)) {
			chain.doFilter(request, response);
			return;
		}
		
		// only show logout if there is a session
		if (info.isGet("{ctx}/logout") && !hasSession) {
			resp.sendRedirect(req.getContextPath() + "/index");
			return;
		}
		
		// stop all other reads if view is not allowed
		if (info.isRead() && !allowView) {
			resp.sendError(403);
			return;
		}
		
		// stop all other writes if view is not required
		if (info.isWrite() && !allowEdit) {
			resp.sendError(403);
			return;
		}
		
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {
	}

}
