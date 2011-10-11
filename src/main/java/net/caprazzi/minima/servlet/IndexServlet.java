package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.IO;

public class IndexServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		InputStream in = this.getClass().getClassLoader().getResourceAsStream("htdocs/index.html");
		PrintWriter writer = resp.getWriter();
		writer.write(IO.toString(in).replaceAll("\\{\\{ JS_SRC_URL \\}\\}", "all.js?rl=" + new Date().getTime()));

		writer.close();
		in.close();
	}

}
