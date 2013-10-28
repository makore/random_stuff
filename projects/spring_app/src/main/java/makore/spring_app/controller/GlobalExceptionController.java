package makore.spring_app.controller;

import makore.spring_app.common.SpringAppException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class GlobalExceptionController {

	@ExceptionHandler({ SpringAppException.class })
	public ModelAndView handleSpringAppException(SpringAppException e) {

		ModelAndView model = new ModelAndView("404");
		model.addObject("errMsg", e.getMessage());

		return model;
	}
}
