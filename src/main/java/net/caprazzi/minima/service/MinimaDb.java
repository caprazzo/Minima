package net.caprazzi.minima.service;

import java.math.BigDecimal;
import java.util.ArrayList;

import net.caprazzi.keez.Keez.Db;
import net.caprazzi.keez.Keez.Delete;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.Get;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.model.MasterRecord;
import net.caprazzi.minima.model.Meta;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.model.StoryList;

public class MinimaDb {

	public static final String MASTER_KEY = "minimaster";

	public static final String ID_LIST_TODO = "keylisttodo";
	public static final String ID_LIST_DOING = "keylistdoing";
	public static final String ID_LIST_DONE = "keylistdone";

	private static final String DB_VERSION = "1";	
	
	private final Db db;

	public MinimaDb(Db db) {
		this.db = db;
	}
	
	public void init() {
		db.get(MASTER_KEY, new Get() {
			
			@Override
			public void error(String key, Exception e) {
				throw new RuntimeException("Error while loading masterkey " + key, e);
			}
			
			@Override
			public void notFound(String key) {
				
				// trigger update from database v0 to current version
				try {
					upgradeFrom0to1();
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
				
				db.put(MASTER_KEY, 0, getMasterRecord(), new Put() {

					@Override
					public void ok(String key, int rev) {}

					@Override
					public void collision(String key, int yourRev, int foundRev) {
						throw new RuntimeException("Collision while storing masterkey " + key + " " + yourRev + " " + foundRev);
					}

					@Override
					public void error(String key, Exception e) {
						 throw new RuntimeException("Error while storing masterkey" + key, e);
					} 
					
				});
			}

			@Override
			public void found(String key, int rev, byte[] data) {				
			}
			
		});
	}
	
	void upgradeFrom0to1() throws Exception {
		try {
			upgradeStories();
			installLists(); 
		}
		catch (Exception e) {
			rollbackLists();
			throw new Exception(e);
		}
	}

	private void rollbackLists() {
		rollbackInstallList(ID_LIST_TODO);
		rollbackInstallList(ID_LIST_DOING);
		rollbackInstallList(ID_LIST_DONE);
	}

	private void installLists() throws Exception {
		createList(ID_LIST_TODO, "todo", 65536);
		createList(ID_LIST_DOING, "doing", 65536 * 2);
		createList(ID_LIST_DONE, "done", 65536 * 3);
	}

	byte[] getMasterRecord() {
		MasterRecord record = new MasterRecord();
		record.setDbVersion(DB_VERSION);
		return Meta.wrap("master_record", record).toJson();
	}
	
	public void upgradeEntry(Entry entry) throws Exception {
		
		System.out.println("upgrading " + entry);
		
		Story story = Story.fromJson(entry.getData());
		
		story.setId(entry.getKey() + "rx");
		story.setRevision(1);
		
		if (story.getList().equals("todo"))
			story.setList(ID_LIST_TODO);
		
		else if (story.getList().equals("doing"))
			story.setList(ID_LIST_DOING);
		
		else if (story.getList().equals("done"))
			story.setList(ID_LIST_DONE);
		
		
		Meta<Story> meta = Meta.wrap("story", story);
		
		System.out.println(new String(meta.toJson()));
		db.put(entry.getKey() + "rx", 0, meta.toJson(), new Put() {

			@Override
			public void ok(String key, int rev) {
				// TODO Auto-generated method stub
				System.out.println("OK");
			}

			@Override
			public void collision(String key, int yourRev, int foundRev) {
				throw new RuntimeException("collision " + yourRev + " " + foundRev);
			}

			@Override
			public void error(String key, Exception e) {
				throw new RuntimeException("error " + key, e);				
			}
			
		});
	}

	public void rollbackUpgradeEntry(Entry entry) throws Exception {
		db.delete(entry.getKey() + "rx", new Delete() {
			@Override
			public void deleted(String key, byte[] data) {}

			@Override
			public void notFound(String key) {
			}
		});
	}

	public void createList(String id, String name, int pos) throws Exception {
		Meta<StoryList> wrap = Meta.wrap("list", new StoryList(id, name, new BigDecimal(pos)));
		byte[] json = wrap.toJson();
		db.put(id, 0, json, new Put() {

			@Override
			public void ok(String key, int rev) {
				// TODO Auto-generated method stub
			}

			@Override
			public void collision(String key, int yourRev, int foundRev) {
				throw new RuntimeException("error while creating story " + key + " " + yourRev + " " + foundRev);
			}

			@Override
			public void error(String key, Exception e) {
				throw new RuntimeException("error while creating story " + key, e);
			}
		});
	}
	
	public void rollbackInstallList(String idListTodo) {
		db.delete(idListTodo, new Delete() {
			@Override
			public void notFound(String key) {}
			
			@Override
			public void deleted(String key, byte[] data) {}
		});
	}

	public void upgradeStories() throws Exception {
		
		try {
			db.list(new List() {
	
				@Override
				public void entries(Iterable<Entry> entries) {
					
					ArrayList<Entry> seen = new ArrayList<Entry>();
					
					for (Entry e : entries) {
						seen.add(e);
						try {
							upgradeEntry(e);
						} catch (Exception e1) {
							for (Entry s : seen) {
								try {
									rollbackUpgradeEntry(s);
								} catch (Exception ex) {
									// keep the rollback going...
									ex.printStackTrace();
								}
							}
							throw new RuntimeException(e1);
						}
					}
					
					// creating all stories wen well
					// now delete old stories
					for (Entry e : entries) {
						db.delete(e.getKey(), new Delete() {
							@Override
							public void notFound(String key) {}
							
							@Override
							public void deleted(String key, byte[] data) {}
						});
					}
					
				}
			});
		}
		catch (RuntimeException e) {
			throw new Exception(e);
		}
	}
}
