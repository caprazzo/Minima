package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.eclipse.jetty.util.IO;

public class MinimaLoginServlet extends HttpServlet {

	private final String password;

	public MinimaLoginServlet(String password) {
		this.password = password;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String password = req.getParameter("password");
		if (this.password.equals(password)) {
			HttpSession session = req.getSession(true);
			resp.sendRedirect("/login");
			return;
		}
		
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("login.html");
		PrintWriter writer = resp.getWriter();
		writer.write(IO.toString(in).replaceAll("\\{\\{ ERROR \\}\\}", "invalid-pass"));

		writer.close();
		in.close();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		if (req.getSession(false) != null) {
			resp.sendRedirect("/index");
		}
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("login.html");
		PrintWriter writer = resp.getWriter();
		writer.write(IO.toString(in).replaceAll("\\{\\{ ERROR \\}\\}", ""));
		writer.close();
		in.close();
	}
	
}
