package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.caprazzi.minima.framework.RequestInfo;

import org.eclipse.jetty.util.IO;

public class MinimaLoginServlet extends HttpServlet {

	private final String password;

	public MinimaLoginServlet(String password) {
		this.password = password;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
		if (!info.isPath(req.getContextPath() + "/login")) {
			resp.sendError(404);
			return;
		}
		
		String password = req.getParameter("password");
		if (this.password.equals(password)) {
			HttpSession session = req.getSession(true);
			resp.sendRedirect(req.getContextPath() + "/login");
			return;
		}
		
		resp.setContentType("text/html");
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("login.html");
		PrintWriter writer = resp.getWriter();
		writer.write(IO.toString(in).replaceAll("\\{\\{ ERROR \\}\\}", "invalid-pass"));

		writer.close();
		in.close();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		RequestInfo info = RequestInfo.fromRequest(req);
		if (info.isPath(req.getContextPath() + "/logout")) {
			if (req.getSession(false) != null) {
				req.getSession().invalidate();
				
			}			
			resp.sendRedirect(req.getContextPath() + "/index");
			return;
		}
		
		if (req.getSession(false) != null) {
			resp.sendRedirect(req.getContextPath() + "/index");
			return;
		}
		
		resp.setContentType("text/html");
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("login.html");
		PrintWriter writer = resp.getWriter();
		writer.write(IO.toString(in).replaceAll("\\{\\{ ERROR \\}\\}", ""));
		writer.close();
		in.close();
	}
	
}
