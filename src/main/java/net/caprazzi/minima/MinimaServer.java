package net.caprazzi.minima;

import java.util.EnumSet;

import javax.servlet.DispatcherType;

import net.caprazzi.minima.service.MinimaService;
import net.caprazzi.minima.servlet.ClasspathFilesServlet;
import net.caprazzi.minima.servlet.MinimaCometServlet;
import net.caprazzi.minima.servlet.MinimaIndexServlet;
import net.caprazzi.minima.servlet.MinimaLoginServlet;
import net.caprazzi.minima.servlet.MinimaServlet;
import net.caprazzi.minima.servlet.MinimaWebsocketServlet;
import net.caprazzi.minima.servlet.PrivacyFilter;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class MinimaServer {

	private final MinimaService minimaService;
	private final MinimaWebsocketServlet websocketServlet;
	private final MinimaIndexServlet indexServlet;
	private final MinimaCometServlet cometServlet;
	private final MinimaLoginServlet loginServlet;
	private final PrivacyFilter privacyFilter;

	public MinimaServer(MinimaService minimaService, MinimaWebsocketServlet websocketServlet, MinimaCometServlet cometServlet, MinimaIndexServlet indexServlet, MinimaLoginServlet loginServlet, PrivacyFilter privacyFilter) {
		this.minimaService = minimaService;
		this.websocketServlet = websocketServlet;
		this.cometServlet = cometServlet;
		this.indexServlet = indexServlet;
		this.loginServlet = loginServlet;
		this.privacyFilter = privacyFilter;
	}

	public void start(int port) throws Exception {
		Server server = new Server(port);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        context.getSessionHandler().getSessionManager().setMaxInactiveInterval(Integer.MAX_VALUE);
        server.setHandler(context);
        
        
        
        if (privacyFilter != null) {
        	context.addFilter(new FilterHolder(privacyFilter), "*", EnumSet.of(DispatcherType.REQUEST));
        }
        if (loginServlet != null) {
        	context.addServlet(new ServletHolder(loginServlet), "/login");
        }
		
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
