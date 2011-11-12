package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.http.HttpServletRequest;

import org.eclipse.jetty.util.log.Log;
import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;

@SuppressWarnings("serial")
public class WebsocketServlet extends WebSocketServlet {

	private volatile Set<MinimaWebSocket> _consumers = new CopyOnWriteArraySet<MinimaWebSocket>();
	
	@Override
	public WebSocket doWebSocketConnect(HttpServletRequest request,
			String protocol) {
		return new MinimaWebSocket();
	}
	
	public void send(byte[] data) {
		for (MinimaWebSocket member: _consumers) {
			try {
				member.sendMessage(data);
			} catch (IOException e) {
				Log.info("error while sending message");
			}
		}
	}
	
	class MinimaWebSocket implements WebSocket {

		private Connection connection;

		@Override
		public void onOpen(Connection connection) {
			this.connection = connection;
			_consumers.add(this);
		}

		public void sendMessage(byte[] data) throws IOException {
			connection.sendMessage(new String(data, "UTF-8"));
		}

		@Override
		public void onClose(int closeCode, String message) {
			_consumers.remove(this);
		}
	}
}
