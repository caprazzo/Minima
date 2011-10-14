package net.caprazzi.minima.servlet;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.log.Log;
import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocket.Connection;
import org.eclipse.jetty.websocket.WebSocketServlet;

public class MinimaPushServlet extends WebSocketServlet {

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
				Log.warn("error while sending message", e);
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
	
	/*
	private volatile Set<MinimaWebSocket> _consumers = new CopyOnWriteArraySet<MinimaWebSocket>();
	
	public void send(byte[] data) {
		for (MinimaWebSocket member: _consumers) {
			try {
				member._outbound.sendMessage((byte)0, data, 0, data.length);
			} catch (IOException e) {
				Log.warn("error while sending message", e);
			}
		}
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
			ServletContext ctx = getServletContext();
			RequestDispatcher dispatcher = ctx.getNamedDispatcher("default"); 
					//ctx.getNamedDispatcher("default");
			dispatcher.forward(req, resp);
	}
	
	@Override
	protected WebSocket doWebSocketConnect(HttpServletRequest request,
			String protocol) {
		return new MinimaWebSocket();
	}
	
	class MinimaWebSocket implements WebSocket {
		Outbound _outbound;

		public void onConnect(Outbound outbound) {
			_outbound = outbound;
			_consumers.add(this);
		}

		public void onMessage(byte frame, byte[] data, int offset, int length) {
		}

		public void onMessage(byte frame, String data) {
			for (MinimaWebSocket member : _consumers) {
				try {
					member._outbound.sendMessage(frame, data);
				} catch (IOException e) {
					Log.warn(e);
				}
			}
		}

		public void onDisconnect() {
			_consumers.remove(this);
		}

		@Override
		public void onFragment(boolean more, byte opcode, byte[] data,
				int offset, int length) {
		}		
	}	
	*/

}
