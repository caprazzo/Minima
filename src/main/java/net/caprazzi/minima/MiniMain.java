package net.caprazzi.minima;

import net.caprazzi.keez.simpleFileDb.KeezFileDb;
import net.caprazzi.minima.service.MinimaService;
import net.caprazzi.minima.servlet.MinimaPushServlet;

public class MiniMain {

	public static void main(String[] args) throws Exception {
		KeezFileDb db = new KeezFileDb("./db", "minimav0");
		db.setAutoPurge(true);
		MinimaPushServlet pushServlet = new MinimaPushServlet();	
		MinimaService minimaService = new MinimaService(db, pushServlet);
		MinimaServer minimaServer = new MinimaServer(minimaService, pushServlet);
		minimaServer.start(8989);
	}
}