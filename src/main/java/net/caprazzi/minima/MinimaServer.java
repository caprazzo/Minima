package net.caprazzi.minima;

import net.caprazzi.minima.service.MinimaService;
import net.caprazzi.minima.servlet.ClasspathFilesServlet;
import net.caprazzi.minima.servlet.MinimaCometServlet;
import net.caprazzi.minima.servlet.MinimaIndexServlet;
import net.caprazzi.minima.servlet.MinimaServlet;
import net.caprazzi.minima.servlet.MinimaWebsocketServlet;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class MinimaServer {

	private final MinimaService minimaService;
	private final MinimaWebsocketServlet websocketServlet;
	private final MinimaIndexServlet indexServlet;
	private final MinimaCometServlet cometServlet;

	public MinimaServer(MinimaService minimaService, MinimaWebsocketServlet websocketServlet, MinimaCometServlet cometServlet, MinimaIndexServlet indexServlet) {
		this.minimaService = minimaService;
		this.websocketServlet = websocketServlet;
		this.cometServlet = cometServlet;
		this.indexServlet = indexServlet;
	}

	public void start(int port) throws Exception {
		Server server = new Server(port);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
        
        MinimaServlet minimaServlet = new MinimaServlet(minimaService);
                
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")),"/");
        context.addServlet(new ServletHolder(indexServlet),"/index");
        context.addServlet(new ServletHolder(minimaServlet), "/data/*");
        ServletHolder websocketholder = new ServletHolder(websocketServlet);
        context.addServlet(websocketholder, "/websocket");
        
        context.addServlet(new ServletHolder(cometServlet), "/comet");
        
        server.start();
        System.out.println("Minima ready at http://localhost:8989/index");
        server.join();
	}
}
