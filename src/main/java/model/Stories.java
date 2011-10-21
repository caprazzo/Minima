package model;

import java.util.ArrayList;
import java.util.List;



public class Stories {

	List<Story> stories = new ArrayList<Story>();
	
	public Stories() {}
	
	public Stories(Story story) {
		stories.add(story);
	}

	public List<Story> getStories() {
		return stories;
	}
	
	public void setStories(List<Story> stories) {
		this.stories = stories;
	}
	
}
