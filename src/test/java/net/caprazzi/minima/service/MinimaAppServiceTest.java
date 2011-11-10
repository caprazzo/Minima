package net.caprazzi.minima.service;

import static junit.framework.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import net.caprazzi.minima.framework.BuildDescriptor;
import net.caprazzi.minima.framework.BuildServices;

import org.junit.Before;
import org.junit.Test;

public class MinimaAppServiceTest {

	private BuildServices service;
	private BuildDescriptor descriptor;


	@Before
	public void setup() {
		descriptor = mock(BuildDescriptor.class);
		service = new BuildServices(descriptor);
		
		when(descriptor.getCssPaths()).thenReturn(new String[] {
			"css/a.css", "css/b.css", "css/c.css"
		});
		
		when(descriptor.getLibsPaths()).thenReturn(new String[] {
			"js/lib/a.js", "js/lib/b.js", "js/lib/c.js"	
		});
		
		when(descriptor.getMainPaths()).thenReturn(new String[] {
			"js/main/a.js", "js/main/b.js", "js/main/c.js"	
		});
	}
	
	@Test
	public void test_should_return_devel_css_html_links() {
		String link = service.getDevelCssTags("xxxx/");
		assertEquals(link, 
			"<link href=\"xxxx/css/a.css\" rel=\"stylesheet\" type=\"text/css\"/>\n" +
			"<link href=\"xxxx/css/b.css\" rel=\"stylesheet\" type=\"text/css\"/>\n" +
			"<link href=\"xxxx/css/c.css\" rel=\"stylesheet\" type=\"text/css\"/>\n");
	}

	@Test
	public void test_should_return_devel_lib_html_links() {
		String link = service.getDevelLibsTags("xxxx/");
		assertEquals(link, 
			"<script src=\"xxxx/js/lib/a.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/lib/b.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/lib/c.js\" type=\"text/javascript\"></script>\n");
	}
	
	@Test
	public void test_should_return_devel_main_html_links() {
		String link = service.getDevelMainTags("xxxx/");
		assertEquals(link, 
			"<script src=\"xxxx/js/main/a.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/main/b.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/main/c.js\" type=\"text/javascript\"></script>\n");
	}
	
	@Test
	public void test_should_return_compact_css_html_link() {
		String link = service.getProductionCssTag("xxxx/");
		assertEquals(link, 
			"<link href=\"xxxx/app/css\" rel=\"stylesheet\" type=\"text/css\"/>");
	}
	
	@Test
	public void test_should_return_compact_libs_html_link() {
		String link = service.getProductionLibsTag("xxxx/");
		assertEquals(link, "<script src=\"xxxx/app/libs\" type=\"text/javascript\"></script>");
	}
	
	@Test
	public void test_should_Return_compact_main_html_link() {
		String link = service.getProductionMainTag("xxxx/");
		assertEquals(link, "<script src=\"xxxx/app/main\" type=\"text/javascript\"></script>");
	}
	
	@Test
	public void test_should_return_all_css_in_one_go() throws IOException {
		when(descriptor.getData("css/a.css")).thenReturn("a.css".getBytes());
		when(descriptor.getData("css/b.css")).thenReturn("b.css".getBytes());
		when(descriptor.getData("css/c.css")).thenReturn("c.css".getBytes());
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		service.writeProductionCssData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.css\nb.css\nc.css\n");		
	}
	
	@Test
	public void test_should_return_all_libs_in_one_go() throws IOException {
		when(descriptor.getData("js/lib/a.js")).thenReturn("a.js".getBytes());
		when(descriptor.getData("js/lib/b.js")).thenReturn("b.js".getBytes());
		when(descriptor.getData("js/lib/c.js")).thenReturn("c.js".getBytes());
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		service.writeProductionLibsData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.js\nb.js\nc.js\n");
	}
	
	@Test
	public void test_should_return_all_main_in_one_go() throws IOException {
		when(descriptor.getData("js/main/a.js")).thenReturn("a.js".getBytes());
		when(descriptor.getData("js/main/b.js")).thenReturn("b.js".getBytes());
		when(descriptor.getData("js/main/c.js")).thenReturn("c.js".getBytes());
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		service.writeProductionMainData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.js\nb.js\nc.js\n");
	}
	
	
}
