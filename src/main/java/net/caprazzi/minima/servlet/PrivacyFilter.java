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

public class PrivacyFilter implements Filter {

	
	private final boolean publicView;
	private final boolean privateAccess;

	public PrivacyFilter(boolean privateAccess, boolean publicView) {
		this.privateAccess = privateAccess;
		this.publicView = publicView;
	}
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) request;
		String[] parts = req.getRequestURI().split("/");
		
		HttpSession session = req.getSession(false);
		
		if (privateAccess && publicView) {
			request.setAttribute("minima.readonly", (session == null));
			chain.doFilter(request, response);
			return;
		}
		
		request.setAttribute("minima.readonly", false);
		if (privateAccess && !publicView && session == null) {
			if (parts.length > 1 && !parts[1].equals("login") && session == null) {
				HttpServletResponse resp = (HttpServletResponse) response;
				if (parts[1].equals("index")) {
					resp.sendRedirect("/login");
				}
				else {
					resp.sendError(403);
				}
				return;
			}	
		}
		
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

}
