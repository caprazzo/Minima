package net.caprazzi.minima;

import net.caprazzi.keez.simpleFileDb.KeezFileDb;
import net.caprazzi.minima.framework.BuildDescriptor;
import net.caprazzi.minima.framework.BuildServices;
import net.caprazzi.minima.service.DataService;
import net.caprazzi.minima.service.DbHelper;
import net.caprazzi.minima.service.PushService;
import net.caprazzi.minima.servlet.AppServlet;
import net.caprazzi.minima.servlet.CometServlet;
import net.caprazzi.minima.servlet.IndexServlet;
import net.caprazzi.minima.servlet.LoginServlet;
import net.caprazzi.minima.servlet.PrivacyFilter;
import net.caprazzi.minima.servlet.WebsocketServlet;

public class MiniMain {

	public static void main(String[] args) throws Exception {
		
		int port = Integer.parseInt(System.getProperty("minima.port", "8989"));		
		String dbDir = System.getProperty("minima.db.dir", "./minima-db");
		String dbPrefix = System.getProperty("minima.db.prefix", "minimav0");
		String boardTitle = System.getProperty("minima.board.default.title", "Minima");
		String password = System.getProperty("minima.password");
		String publicView = System.getProperty("minima.readonly", "false");
		String websocketLocation = System.getProperty("minima.websocket.location", "auto");
		String webroot = System.getProperty("minima.webroot", "");
		
		boolean requireSessionToEdit = (password != null && password.length() > 0);
		boolean requireSessionToView = requireSessionToEdit && !publicView.equalsIgnoreCase("true");
		
		KeezFileDb db = new KeezFileDb(dbDir, dbPrefix, true);
		db.setAutoPurge(true);
		
		BuildDescriptor descriptor = BuildDescriptor.fromFile("build.js");		
		BuildServices appService = new BuildServices(descriptor);
		
		IndexServlet indexServlet = new IndexServlet(websocketLocation, appService);
		indexServlet.setTitle(boardTitle);
		
		WebsocketServlet websocketServlet = new WebsocketServlet();
		CometServlet cometServlet = new CometServlet();		
		PushService pushService = new PushService(websocketServlet, cometServlet);		
		PrivacyFilter privacyFilter = new PrivacyFilter(requireSessionToView, requireSessionToEdit);
		
		LoginServlet loginServlet = (requireSessionToEdit)
				? new LoginServlet(password)
				: null;
				
		AppServlet appServlet = new AppServlet(appService);
		
		DbHelper minimaDbHelper = new DbHelper(db);
		minimaDbHelper.init();
		
		DataService minimaService = new DataService(db, pushService);
		final MinimaServer minimaServer = new MinimaServer(
				minimaService,
				websocketServlet, 
				cometServlet, 
				indexServlet,
				loginServlet,
				privacyFilter,
				appServlet);
		
		Runtime.getRuntime().addShutdownHook(new Thread() {
			@Override
			public void run() {
				System.out.println("Shutdown hook");
				try {
					minimaServer.shutdown();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
		
		minimaServer.start(webroot, port);
	}

}