package net.caprazzi.minima;

import java.util.Arrays;

import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.Get;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.model.Story;
import net.caprazzi.minima.service.MinimaService.CreateStory;
import net.caprazzi.minima.service.MinimaService.UpdateStory;

import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

public class TestUtils {
	
	public final static Put putNoop = new Put() {

		@Override
		public void ok(String key, int rev) {}

		@Override
		public void collision(String key, int yourRev, int foundRev) {
			throw new RuntimeException("collision");
		}

		@Override
		public void error(String key, Exception e) {
			throw new RuntimeException(key, e);			
		}
		
	};
	
	public final static CreateStory createStoryNoop = new CreateStory() {
		@Override
		public void error(String string, Exception e) {
			System.out.println("CreateStory error: " + string + " ex:" + e);
			throw new RuntimeException(string, e);
		}
		
		@Override
		public void success(Story story) {}
	};
	
	public final static UpdateStory updateStoryNoop = new UpdateStory() {
		@Override
		public void error(String string, Exception e) {
			throw new RuntimeException(string, e);
		}
		
		@Override
		public void success(String key, int rev, byte[] data) {}

		@Override
		public void collision(String key, int yourRev, int foundRev) {}
	};
	
	public static class TestCreateStory extends CreateStory {

		@Override
		public void error(String string, Exception e) {			
			throw new RuntimeException("unexpected error: " + string, e);
		}

		@Override
		public void success(Story story) {
			throw new RuntimeException("unexpected success");
		}
	}
	
	public static class TestUpdateStory extends UpdateStory {
		@Override
		public void error(String string, Exception e) {
			throw new RuntimeException("unexpected error");
		}

		@Override
		public void success(String key, int rev, byte[] data) {
			throw new RuntimeException("unexpected success");
		}

		@Override
		public void collision(String key, int yourRev, int foundRev) {
			throw new RuntimeException("unexpected collision");
		}
	}
	
	public static class GetNotFound implements Answer<Object> {
		@Override
		public Object answer(InvocationOnMock invocation) throws Throwable {
			String key = (String)invocation.getArguments()[0];
			Get cb = (Get) invocation.getArguments()[1];
			cb.notFound(key);
			return null;
		}
	}
	
	public static class GetFound implements Answer<Object> {
		
		private final byte[] data;
		private final int rev;

		public GetFound(int rev, byte[] data) {
			this.rev = rev;
			this.data = data;
		}
		
		@Override
		public Object answer(InvocationOnMock invocation) throws Throwable {
			String key = (String)invocation.getArguments()[0];
			Get cb = (Get) invocation.getArguments()[1];
			cb.found(key, rev, data);
			return null;
		}
	}
	
	public static class ListFound implements Answer<Object> {

		private Iterable<Entry> entries;

		public ListFound(Entry[] entries) {
			this.entries = Arrays.asList(entries);
		}
		
		@Override
		public Object answer(InvocationOnMock invocation) throws Throwable {
			List cb = (List) invocation.getArguments()[0];
			cb.entries(entries);
			return null;
		}
		
	}
	
	public static GetNotFound getNotFound = new GetNotFound();

	public static GetFound getFound(int rev, byte[] data) {
		return new GetFound(rev, data);
	}
	
	public static ListFound listFound(Entry[] entries) {
		return new ListFound(entries);
	}
	
}
