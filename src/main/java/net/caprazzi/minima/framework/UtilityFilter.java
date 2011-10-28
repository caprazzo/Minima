package net.caprazzi.minima.framework;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * This filter measures the performance of all servlet calls and logs
 * a line for each call including full query and return code.
 * 
 * HttpServletResponse is wrapped in TaggableHttpResponse so that
 * servlets have a way to add "tags" to responses. Tags will be shown
 * in logs along with all other request information.
 * 
 * The filter also injects a request key in output headers that can
 * be used to make debugging a bit easier.
 */
public class UtilityFilter implements Filter {

	private Logger logger = LoggerFactory.getLogger("REQUEST");
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		logger.info("Init");
	}

	@Override
	public void doFilter(ServletRequest srvReq, ServletResponse srvResp,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest)srvReq;
		HttpServletResponse resp = (HttpServletResponse)srvResp;		
		resp.addHeader("X-Im-Runtime-Request-Key", Thread.currentThread().getName());
		
		TaggableHttpResponse taggableHttpResponse = new TaggableHttpResponse(resp);
		
		long start = System.nanoTime();			
		try {
			chain.doFilter(srvReq, taggableHttpResponse);
		}
		catch(Exception e) {
			taggableHttpResponse.tag("EXCEPTION: " + e.getMessage());
		}
		finally {			
			long elapsed_micro = (System.nanoTime() - start) / 1000000;
			logger.info(logFilterRequest(req, resp, elapsed_micro, taggableHttpResponse.getTag()));
		}
	}
	
	public static String logFilterRequest(HttpServletRequest req, HttpServletResponse resp,
			long elapsed_micro, String notes) {
		
		return String.format("%sms, %s %s %s?%s, app-key:%s -- %s",
			elapsed_micro,
			resp.getStatus(),
			req.getMethod(), 
			req.getRequestURI(), 
			req.getQueryString(),
			req.getHeader("X-IM-APP-KEY"),
			notes
		);
	}

	@Override
	public void destroy() {
		logger.info("Destroy");		
	};

}
