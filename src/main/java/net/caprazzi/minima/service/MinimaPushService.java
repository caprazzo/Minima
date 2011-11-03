package net.caprazzi.minima.service;

import net.caprazzi.minima.servlet.MinimaCometServlet;
import net.caprazzi.minima.servlet.MinimaWebsocketServlet;

public class MinimaPushService {

	private final MinimaWebsocketServlet websocketServlet;
	private final MinimaCometServlet cometServlet;
	
	public MinimaPushService(MinimaWebsocketServlet websocketServlet, MinimaCometServlet cometServlet) {
		this.websocketServlet = websocketServlet;
		this.cometServlet = cometServlet;
	}
	
	public void send(byte[] data) {
		this.websocketServlet.send(data);
		this.cometServlet.send(data);
	}
	
}
