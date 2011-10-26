package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class MinimaCometServlet extends HttpServlet {

	private Map<String, AsyncContext> asyncContexts = new ConcurrentHashMap<String, AsyncContext>();

	public void send(byte[] data) {
	  for (AsyncContext asyncContext : asyncContexts.values()) {
          try {
        	  sendMessage(asyncContext.getResponse().getOutputStream(), data);
          } catch (Exception e) {
              asyncContexts.values().remove(asyncContext);
          }
      }
	}
	
	private void sendMessage(OutputStream wr, byte[] data) throws IOException {
		wr.write(data);
		wr.flush();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//resp.setContentType("text/plain");
		//resp.setCharacterEncoding("utf-8");

		// Access-Control-Allow-Origin header
		//resp.setHeader("Access-Control-Allow-Origin", "*");

		final String id = UUID.randomUUID().toString();
		final AsyncContext ac = req.startAsync();
		ac.addListener(new AsyncListener() {

			@Override
			public void onTimeout(AsyncEvent event) throws IOException {
				asyncContexts.remove(id);
			}

			@Override
			public void onStartAsync(AsyncEvent event) throws IOException {

			}

			@Override
			public void onError(AsyncEvent event) throws IOException {
				asyncContexts.remove(id);
			}

			@Override
			public void onComplete(AsyncEvent event) throws IOException {
				asyncContexts.remove(id);
			}
		});
		asyncContexts.put(id, ac);
	}
}
