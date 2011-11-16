package net.caprazzi.minima;

import java.io.File;
import java.util.EnumSet;

import javax.servlet.DispatcherType;

import net.caprazzi.minima.service.PushService;
import net.caprazzi.minima.servlet.AppServlet;
import net.caprazzi.minima.servlet.ClasspathFilesServlet;
import net.caprazzi.minima.servlet.CometServlet;
import net.caprazzi.minima.servlet.DataServlet;
import net.caprazzi.minima.servlet.IndexServlet;
import net.caprazzi.minima.servlet.LoginServlet;
import net.caprazzi.minima.servlet.PrivacyFilter;
import net.caprazzi.minima.servlet.WebsocketServlet;
import net.caprazzi.slabs.Slabs;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.session.HashSessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class MinimaServer {

	private final WebsocketServlet websocketServlet;
	private final IndexServlet indexServlet;
	private final CometServlet cometServlet;
	private final LoginServlet loginServlet;
	private final PrivacyFilter privacyFilter;
	private Server server;
	private final AppServlet appServlet;
	private final Slabs db;
	private final PushService pushService;

	public MinimaServer(Slabs db, PushService pushService, WebsocketServlet websocketServlet, CometServlet cometServlet, IndexServlet indexServlet, LoginServlet loginServlet, PrivacyFilter privacyFilter, AppServlet appServlet) {
		this.db = db;
		this.pushService = pushService;
		this.websocketServlet = websocketServlet;
		this.cometServlet = cometServlet;
		this.indexServlet = indexServlet;
		this.loginServlet = loginServlet;
		this.privacyFilter = privacyFilter;
		this.appServlet = appServlet;
	}

	public void start(String webroot, int port) throws Exception {
		server = new Server(port);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        
        HashSessionManager manager = new HashSessionManager();
        manager.setStoreDirectory(new File("sessions"));
        manager.setSavePeriod(30);
		context.setSessionHandler(new SessionHandler(manager));
        
        context.setContextPath((webroot == "") ? "/" : webroot);
        context.getSessionHandler().getSessionManager().setMaxInactiveInterval(Integer.MAX_VALUE);                        
        	
        server.setHandler(context);
        
        if (privacyFilter != null) {
        	context.addFilter(new FilterHolder(privacyFilter), "*", EnumSet.of(DispatcherType.REQUEST));
        }
        if (loginServlet != null) {
        	context.addServlet(new ServletHolder(loginServlet), "/login");
        	context.addServlet(new ServletHolder(loginServlet), "/logout");
        }
        
        DataServlet minimaServlet = new DataServlet(webroot, db, pushService);
        context.addServlet(new ServletHolder(minimaServlet), "/data/*");
        ServletHolder websocketholder = new ServletHolder(websocketServlet);
        context.addServlet(websocketholder, "/websocket");
        
        context.addServlet(new ServletHolder(cometServlet), "/comet");
		
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")), "/css/*");
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")), "/test.html");
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")), "/js/*");
        context.addServlet(new ServletHolder(new ClasspathFilesServlet("/htdocs")), "/favicon.ico");
        
        context.addServlet(new ServletHolder(indexServlet), "/index");
        context.addServlet(new ServletHolder(indexServlet), "/");
        
        context.addServlet(new ServletHolder(appServlet), "/app/*");
        
        server.start();
        System.out.println("Minima ready at http://localhost:" + port + webroot + "/index");
        server.join();
	}

	public void shutdown() throws Exception {
		server.stop();
	}
}
