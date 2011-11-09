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
import javax.servlet.http.HttpSession;

import com.google.inject.Inject;

import net.caprazzi.minima.framework.RequestInfo;

public class PrivacyFilter implements Filter {

	
	private final boolean publicView;
	private final boolean privateAccess;

	@Inject
	public PrivacyFilter(boolean privateAccess, boolean publicView) {
		this.privateAccess = privateAccess;
		this.publicView = publicView;
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
		
		HttpSession session = req.getSession(false);		
		

		// if this board 
		// - is private 
		// AND has public view enabled
		// THEN configure request for readonly access, if user is not logged in
		if (privateAccess && publicView) {
			request.setAttribute("minima.readonly", (session == null));
			chain.doFilter(request, response);
			return;
		}
		
		// if this board 
		// is private 
		// AND does NOT have public view
		// AND there is no session
		// THEN send to login or deny access		
		if (privateAccess && !publicView && session == null) {
			if (info.isPath(req.getContextPath() + "/login")) {
				chain.doFilter(request, response);
				return;
			}						
			if (info.isPath(req.getContextPath() + "/index")) {
				resp.sendRedirect(req.getContextPath() + "/login");
			}
			else {
				resp.sendError(403);
			}
			return;
		}
		
		// in all other cases set readonly to false and proceed
		request.setAttribute("minima.readonly", false);
		
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {
	}

}
