package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;

import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet(asyncSupported = true)
public class CometServlet extends HttpServlet {

	private Map<String, AsyncContext> asyncContexts = new ConcurrentHashMap<String, AsyncContext>();

	private BlockingQueue<byte[]> messages = new LinkedBlockingQueue<byte[]>();

	public void send(byte[] data) {
		for (AsyncContext asyncContext : asyncContexts.values()) {
			try {
				messages.put(data);
			} catch (Exception e) {
				e.printStackTrace();
				asyncContexts.values().remove(asyncContext);
			}
		}
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		notifier.start();
	}

	private Thread notifier = new Thread(new Runnable() {

		@Override
		public void run() {
			boolean done = false;
			while (!done) {
				try {
					String message = new String(messages.take());
					for (AsyncContext asyncContext : asyncContexts.values()) {
						try {
							PrintWriter writer = asyncContext.getResponse().getWriter();
							writer.print(message);
							try {
								asyncContext.complete();
								writer.flush();
								asyncContexts.values().remove(asyncContext);
							} catch (Exception e) {
								e.printStackTrace();
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				} catch (InterruptedException e) {
					done = true;
				}
			}
		}

	});

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		resp.setCharacterEncoding("utf-8");

		// Content-Type header
		resp.setContentType("text/plain");

		// Access-Control-Allow-Origin header
		resp.setHeader("Access-Control-Allow-Origin", "*");

		// Id

		final String id = UUID.randomUUID().toString();
		final AsyncContext ac = req.startAsync(req, resp);
		ac.setTimeout(30 * 60 * 1000);
		ac.addListener(new AsyncListener() {

			@Override
			public void onTimeout(AsyncEvent event) throws IOException {
				log("on timeout");
				asyncContexts.remove(id);
			}

			@Override
			public void onStartAsync(AsyncEvent event) throws IOException {
				log("on start");
			}

			@Override
			public void onError(AsyncEvent event) throws IOException {
				log("on error");
				asyncContexts.remove(id);
			}

			@Override
			public void onComplete(AsyncEvent event) throws IOException {
				log("on complete");
				asyncContexts.remove(id);
			}
		});

		asyncContexts.put(id, ac);
	}
}
