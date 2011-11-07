package net.caprazzi.minima.service;

import static junit.framework.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;

import net.caprazzi.minima.framework.ImportsDescriptor;

import org.junit.Before;
import org.junit.Test;

import com.sun.xml.internal.messaging.saaj.util.ByteOutputStream;
public class MinimaAppServiceTest {

	private MinimaAppService service;
	private ImportsDescriptor descriptor;


	@Before
	public void setup() {
		descriptor = mock(ImportsDescriptor.class);
		service = new MinimaAppService(descriptor);
		
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
		String link = service.getDevelCssHtmlLink("xxxx/");
		assertEquals(link, 
			"<link href=\"xxxx/css/a.css\" rel=\"stylesheet\" type=\"text/css\"/>\n" +
			"<link href=\"xxxx/css/b.css\" rel=\"stylesheet\" type=\"text/css\"/>\n" +
			"<link href=\"xxxx/css/c.css\" rel=\"stylesheet\" type=\"text/css\"/>\n");
	}

	@Test
	public void test_should_return_devel_lib_html_links() {
		String link = service.getDevelLibsHtmlLink("xxxx/");
		assertEquals(link, 
			"<script src=\"xxxx/js/lib/a.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/lib/b.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/lib/c.js\" type=\"text/javascript\"></script>\n");
	}
	
	@Test
	public void test_should_return_devel_main_html_links() {
		String link = service.getDevelMainHtmlLink("xxxx/");
		assertEquals(link, 
			"<script src=\"xxxx/js/main/a.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/main/b.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/js/main/c.js\" type=\"text/javascript\"></script>\n");
	}
	
	@Test
	public void test_should_return_compact_css_html_link() {
		String link = service.getProductionCssHtmlLink("xxxx/");
		assertEquals(link, 
			"<link href=\"xxxx/app/css\" rel=\"stylesheet\" type=\"text/css\"/>");
	}
	
	@Test
	public void test_should_return_compact_libs_html_link() {
		String link = service.getProductionLibsHtmlLink("xxxx/");
		assertEquals(link, "<script src=\"xxxx/app/libs\" type=\"text/javascript\"></script>");
	}
	
	@Test
	public void test_should_Return_compact_main_html_link() {
		String link = service.getProductionMainHtmlLink("xxxx/");
		assertEquals(link, "<script src=\"xxxx/app/main\" type=\"text/javascript\"></script>");
	}
	
	@Test
	public void test_should_return_all_css_in_one_go() throws IOException {
		when(descriptor.getData("css/a.css")).thenReturn("a.css".getBytes());
		when(descriptor.getData("css/b.css")).thenReturn("b.css".getBytes());
		when(descriptor.getData("css/c.css")).thenReturn("c.css".getBytes());
		
		ByteOutputStream baos = new ByteOutputStream();
		service.writeProductionCssData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.css\nb.css\nc.css\n");		
	}
	
	@Test
	public void test_should_return_all_libs_in_one_go() throws IOException {
		when(descriptor.getData("js/lib/a.js")).thenReturn("a.js".getBytes());
		when(descriptor.getData("js/lib/b.js")).thenReturn("b.js".getBytes());
		when(descriptor.getData("js/lib/c.js")).thenReturn("c.js".getBytes());
		
		ByteOutputStream baos = new ByteOutputStream();
		service.writeProductionLibsData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.js\nb.js\nc.js\n");
	}
	
	@Test
	public void test_should_return_all_main_in_one_go() throws IOException {
		when(descriptor.getData("js/main/a.js")).thenReturn("a.js".getBytes());
		when(descriptor.getData("js/main/b.js")).thenReturn("b.js".getBytes());
		when(descriptor.getData("js/main/c.js")).thenReturn("c.js".getBytes());
		
		ByteOutputStream baos = new ByteOutputStream();
		service.writeProductionMainData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.js\nb.js\nc.js\n");
	}
	
	
}
