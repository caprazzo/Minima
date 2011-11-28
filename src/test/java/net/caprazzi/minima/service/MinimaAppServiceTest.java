package net.caprazzi.minima.service;

import static junit.framework.Assert.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

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
		descriptor = spy(new BuildDescriptor());
		service = new BuildServices(descriptor);

		descriptor.setCss(new String[] {
			"/css/a.css", "/css/b.css", "/css/c.css"
		});
		
		descriptor.setLibs(new String[] {
			"/js/lib/a.js", "/js/lib/b.js", "/js/lib/c.js"	
		});
		
		descriptor.setMain(new String[] {
			"/js/main/a.js", "/js/main/b.js", "/js/main/c.js"	
		});
	}
	
	@Test
	public void test_should_return_devel_css_html_links() {
		String link = service.getDevelCssTags("xxxx/");
		assertEquals(link,
			"<link href=\"xxxx/app/css/a.css\" rel=\"stylesheet\" type=\"text/css\"/>\n" +
			"<link href=\"xxxx/app/css/b.css\" rel=\"stylesheet\" type=\"text/css\"/>\n" +
			"<link href=\"xxxx/app/css/c.css\" rel=\"stylesheet\" type=\"text/css\"/>\n");
	}

	@Test
	public void test_should_return_devel_lib_html_links() {
		String link = service.getDevelLibsTags("xxxx/");
		assertEquals(link,
			"<script src=\"xxxx/app/js/lib/a.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/app/js/lib/b.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/app/js/lib/c.js\" type=\"text/javascript\"></script>\n");
	}
	
	@Test
	public void test_should_return_devel_main_html_links() {
		String link = service.getDevelMainTags("xxxx/");
		assertEquals(link,
			"<script src=\"xxxx/app/js/main/a.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/app/js/main/b.js\" type=\"text/javascript\"></script>\n" +
			"<script src=\"xxxx/app/js/main/c.js\" type=\"text/javascript\"></script>\n");
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
		doReturn("a.css".getBytes()).when(descriptor).getData("/css/a.css");
		doReturn("b.css".getBytes()).when(descriptor).getData("/css/b.css");
		doReturn("c.css".getBytes()).when(descriptor).getData("/css/c.css");
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		service.writeProductionCssData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.css\nb.css\nc.css\n");		
	}
	
	@Test
	public void test_should_return_all_libs_in_one_go() throws IOException {
		doReturn("a.js".getBytes()).when(descriptor).getData("/js/lib/a.js");
		doReturn("b.js".getBytes()).when(descriptor).getData("/js/lib/b.js");
		doReturn("c.js".getBytes()).when(descriptor).getData("/js/lib/c.js");
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		service.writeProductionLibsData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.js\nb.js\nc.js\n");
	}
	
	@Test
	public void test_should_return_all_main_in_one_go() throws IOException {
		doReturn("a.js".getBytes()).when(descriptor).getData("/js/main/a.js");
		doReturn("b.js".getBytes()).when(descriptor).getData("/js/main/b.js");
		doReturn("c.js".getBytes()).when(descriptor).getData("/js/main/c.js");
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		service.writeProductionMainData(baos);
		
		assertEquals(new String(baos.toByteArray()), "a.js\nb.js\nc.js\n");
	}
	
	
}
