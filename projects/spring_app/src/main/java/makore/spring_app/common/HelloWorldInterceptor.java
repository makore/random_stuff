package makore.spring_app.common;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloWorldInterceptor implements HandlerInterceptor {

	private final static Logger logger = Logger.getLogger("controller");

	@Override
	public boolean preHandle(final HttpServletRequest httpServletRequest,
	                         final HttpServletResponse httpServletResponse,
	                         final Object o) throws Exception {
		logger.info("Pre-handle interceptor");
		return false;
	}

	@Override
	public void postHandle(final HttpServletRequest httpServletRequest,
	                       final HttpServletResponse httpServletResponse,
	                       final Object o,
	                       final ModelAndView modelAndView) throws Exception {
		// TODO postHandle
	}

	@Override
	public void afterCompletion(final HttpServletRequest httpServletRequest,
	                            final HttpServletResponse httpServletResponse,
	                            final Object o,
	                            final Exception e) throws Exception {
		// TODO afterCompletion
	}
}
