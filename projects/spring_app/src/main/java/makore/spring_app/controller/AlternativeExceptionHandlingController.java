package makore.spring_app.controller;

import makore.spring_app.common.SpringAppException;
import makore.spring_app.model.UserForm;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/handlerExceptionResolverExample")
public class AlternativeExceptionHandlingController implements HandlerExceptionResolver {

	private final static Logger logger = Logger.getLogger("controller");

	@RequestMapping(value = "/upload", method = RequestMethod.GET)
	public String getUserForm(Model model) {
		model.addAttribute("userForm", new UserForm());
		return "user";
	}

	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public String create(UserForm userForm,
	                     BindingResult result,
	                     HttpServletRequest request) throws SpringAppException {

		if (result.hasErrors()) {
			return "user";
		}

		// Do something with the file
		final String path = request.getSession().getServletContext().getRealPath("/");
		final String fileName = userForm.getFile().getOriginalFilename();

		try {
			File file = new File(path + File.separator + fileName);
			FileUtils.writeByteArrayToFile(file, userForm.getFile().getBytes());
			logger.info("Uploaded file with name: " + fileName);
		} catch (IOException e) {
			throw new SpringAppException("Unable to save image.");
		}

		return "redirect:/";
	}

	@Override
	public ModelAndView resolveException(final HttpServletRequest httpServletRequest,
	                                     final HttpServletResponse httpServletResponse,
	                                     final Object o,
	                                     final Exception e) {
		Map<String, Object> model = new HashMap<>();
		if (e instanceof MaxUploadSizeExceededException) {
			model.put("error", e.getMessage());
		} else {
			model.put("error", "Unexpected error: " + e.getMessage());
		}
		return new ModelAndView("/upload", model);
	}
}
