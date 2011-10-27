package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.IO;

@SuppressWarnings("serial")
public class MinimaIndexServlet extends HttpServlet {

	private String boardTitle;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String[] parts = req.getRequestURI().split("/");
		if (parts.length == 0) {
			resp.sendRedirect("/index");
			return;
		}
		
		resp.setContentType("text/html");
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("index.html");
		PrintWriter writer = resp.getWriter();
		writer.write(IO.toString(in).replaceAll("\\{\\{ BOARD_TITLE \\}\\}", boardTitle));

		writer.close();
		in.close();
	}

	public void setTitle(String boardTitle) {
		this.boardTitle = boardTitle;		
	}

}
