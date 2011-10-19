package net.caprazzi.minima;

import net.caprazzi.minima.service.MinimaService;
import net.caprazzi.minima.servlet.ClasspathFilesServlet;
import net.caprazzi.minima.servlet.IndexServlet;
import net.caprazzi.minima.servlet.MinimaPushServlet;
import net.caprazzi.minima.servlet.MinimaServlet;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class MinimaServer {

	private final MinimaService minimaService;
	private final MinimaPushServlet pushServlet;

	public MinimaServer(MinimaService minimaService, MinimaPushServlet pushServlet) {
		this.minimaService = minimaService;
		this.pushServlet = pushServlet;
	}

	public void start(int port) throws Exception {
		Server server = new Server(port);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
        
        MinimaServlet minimaServlet = new MinimaServlet(minimaService);
                
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")),"/");
        context.addServlet(new ServletHolder(new IndexServlet()),"/index");
        context.addServlet(new ServletHolder(minimaServlet), "/data/*");
        ServletHolder holder = new ServletHolder(pushServlet);
        holder.setName("socket");
        context.addServlet(holder, "/socket");
        
        server.start();
        System.out.println("Minima ready at http://localhost:8989/index");
        server.join();
	}
}
