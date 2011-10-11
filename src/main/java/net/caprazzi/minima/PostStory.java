package net.caprazzi.minima;
import java.util.ArrayList;
import java.util.List;



public class PostStory {

	private List<Story> stories = new ArrayList<Story>();
	
	public PostStory() {
	}
	
	public PostStory(Story story) {
		stories.add(story);
	}

	public List<Story> getStories() {
		return stories;
	}
	
	public void setStories(List<Story> stories) {
		this.stories = stories;
	}
	
}
