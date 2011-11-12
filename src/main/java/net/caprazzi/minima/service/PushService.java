package net.caprazzi.minima.service;

import net.caprazzi.minima.servlet.CometServlet;
import net.caprazzi.minima.servlet.WebsocketServlet;

public class PushService {

	private final WebsocketServlet websocketServlet;
	private final CometServlet cometServlet;
	
	public PushService(WebsocketServlet websocketServlet, CometServlet cometServlet) {
		this.websocketServlet = websocketServlet;
		this.cometServlet = cometServlet;
	}
	
	public void send(byte[] data) {
		this.websocketServlet.send(data);
		this.cometServlet.send(data);
	}
	
}
