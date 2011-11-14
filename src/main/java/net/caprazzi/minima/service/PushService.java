package net.caprazzi.minima.service;

import net.caprazzi.minima.model.Meta;
import net.caprazzi.minima.servlet.CometServlet;
import net.caprazzi.minima.servlet.WebsocketServlet;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;

public class PushService {

	private final WebsocketServlet websocketServlet;
	private final CometServlet cometServlet;
	private ObjectMapper mapper = new ObjectMapper();
	
	public PushService(WebsocketServlet websocketServlet, CometServlet cometServlet) {
		this.websocketServlet = websocketServlet;
		this.cometServlet = cometServlet;
	}
	
	public void send(Meta<?> data) {
		byte[] json = getUpdateJson(data);
		this.websocketServlet.send(json);
		this.cometServlet.send(json);
	}
	
	private byte[] getUpdateJson(Meta<?> data) {
		ObjectNode root = mapper.createObjectNode();		
		ObjectNode entity = data.getObj().toJson(true);
		root.put("name", data.getName());		
		try {
			root.put("obj", entity);
			return mapper.writeValueAsBytes(root);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
}
