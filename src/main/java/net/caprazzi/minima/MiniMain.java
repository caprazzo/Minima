package net.caprazzi.minima;

import net.caprazzi.keez.Keez;
import net.caprazzi.keez.simpleFileDb.KeezFileDb;

/**
 * Http Api
 * 	 POST /story/<revision>
 * 		body
 * 			content-type: json
 * 			
 *  		{ 
 *  			"id", <id>
 *  			"description": <description>,
 * 				"list": <"todo", "doing", "done">,
 * 				"pos": <position>
 * 			 }
 * 
 * 		returns:
 * 			201 if successful + full board
 * 			409 conflict if there have been un update since last post
 * 			500 any error
 * 
 * 	 GET /board
 * 		returns 200 if successful
 * 		500 any error
 * 
 * 		content-type: json
 * 		{
 * 			rev: 1,
 * 			stories: {
 * 				storyId: {
 * 					description: "",
 * 					list: "todo",
 * 					pos: 1
 * 				}
 * 			}
 * 		}
 * 
 * 	GET /index
 * 		
 * 		returns application html body
 * 			
 * 		returns:
 * 			200 if successful
 * 			500 any error
 * 
 * WebSocket api:
 * 		when there is a new version of the board,
 * 		it is sent over in websocket
 */
public class MiniMain {

	public static void main(String[] args) throws Exception {
		Keez.Db db = new KeezFileDb(".", "minimav0");
		MinimaService minimaService = new MinimaService(db);
		MinimaServer minimaServer = new MinimaServer(minimaService);
		minimaServer.start(8989);
	}
}
