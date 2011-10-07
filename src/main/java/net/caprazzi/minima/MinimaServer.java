package net.caprazzi.minima;

import net.caprazzi.minima.service.MinimaService;
import net.caprazzi.minima.servlet.ClasspathFilesServlet;
import net.caprazzi.minima.servlet.MinimaServlet;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class MinimaServer {

	private final MinimaService minimaService;

	public MinimaServer(MinimaService minimaService) {
		this.minimaService = minimaService;
	}

	public void start(int port) throws Exception {
		Server server = new Server(port);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
        
        MinimaServlet minimaServlet = new MinimaServlet(minimaService);
                
        // use /uuid to get a fresh id
        // context.addServlet(new ServletHolder(new UUIDServlet()), "/uuid");
        
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")),"/");
        context.addServlet(new ServletHolder(minimaServlet), "/data/*");
        
        server.start();
        server.join();
        
	}
}
