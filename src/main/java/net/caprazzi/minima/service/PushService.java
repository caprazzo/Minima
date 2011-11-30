package net.caprazzi.minima.service;

import net.caprazzi.minima.servlet.CometServlet;
import net.caprazzi.minima.servlet.WebsocketServlet;
import net.caprazzi.slabs.SlabsDoc;

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
	
	public void send(String sender, SlabsDoc doc) {
		byte[] json = getUpdateJson(sender, doc);
		this.websocketServlet.send(json);
		this.cometServlet.send(json);
	}
	
	private byte[] getUpdateJson(String sender, SlabsDoc doc) {
		ObjectNode root = mapper.createObjectNode();		
		ObjectNode entity = doc.toJsonNode();
		root.put("sender", sender);
		root.put("name", doc.getTypeName());		
		try {
			root.put("obj", entity);
			return mapper.writeValueAsBytes(root);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
}
