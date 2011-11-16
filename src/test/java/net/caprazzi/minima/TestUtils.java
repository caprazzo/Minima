package net.caprazzi.minima;

import java.util.Arrays;

import net.caprazzi.keez.Keez.Delete;
import net.caprazzi.keez.Keez.Entry;
import net.caprazzi.keez.Keez.Get;
import net.caprazzi.keez.Keez.List;
import net.caprazzi.keez.Keez.Put;
import net.caprazzi.minima.model.Entity;
import net.caprazzi.minima.service.DataService.Update;

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
	
	public final static Update updateStoryNoop = new Update() {
		@Override
		public void error(String string, Exception e) {
			throw new RuntimeException(string, e);
		}
		
		@Override
		public void collision(String key, int yourRev, int foundRev) {}

		@Override
		public void success(String key, int revision, Entity updated) {
			// TODO Auto-generated method stub
			
		}

	};
	
	public static class TestUpdateStory extends Update {
		@Override
		public void error(String string, Exception e) {
			throw new RuntimeException("unexpected error", e);
		}

		@Override
		public void collision(String key, int yourRev, int foundRev) {
			throw new RuntimeException("unexpected collision");
		}

		@Override
		public void success(String key, int revision, Entity updated) {
			// TODO Auto-generated method stub
			
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
	
	
	public static class PutTestHelp extends Put {

		@Override
		public void ok(String key, int revision) {
			throw new RuntimeException("unexpected put success");
		}

		@Override
		public void collision(String key, int yourRev, int foundRev) {
			throw new RuntimeException("unexpected put collision");			
		}
		
		@Override
		public void error(String key, Exception e) {
			throw new RuntimeException("unexpected put error", e);
		}
		
	}
	
	public static class DeleteTestHelp extends Delete {

		@Override
		public void deleted(String key, byte[] data) {
			throw new RuntimeException("unexpected delete success");
		}

		@Override
		public void notFound(String key) {
			throw new RuntimeException("unexpected not found");			
		}
		
		@Override
		public void error(String key, Exception e) {
			throw new RuntimeException("unexpected error", e);
		}		
	}
	
	public static class GetTestHelp extends Get {

		@Override
		public void found(String key, int rev, byte[] data) {
			throw new RuntimeException("unexpected found");
		}

		@Override
		public void notFound(String key) {
			throw new RuntimeException("unexpected not found");
		}
		
		@Override
		public void error(String key, Exception e) {
			throw new RuntimeException("unexpected error", e);
		}
		
	}
	
	public static class ListTestHelp extends List {
		@Override
		public void entries(Iterable<Entry> entries) {
			throw new RuntimeException("unexpected entries call");
		}

		@Override
		public void notFound() {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void error(Exception ex) {
			// TODO Auto-generated method stub
			
		}
	}
	
}
