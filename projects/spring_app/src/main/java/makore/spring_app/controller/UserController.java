package makore.spring_app.controller;

import java.util.List;
import java.util.Map;
import java.io.*;

import javax.validation.Valid;
import javax.servlet.http.HttpServletRequest;

import makore.spring_app.common.SpringAppException;
import makore.spring_app.model.User;
import makore.spring_app.model.UserForm;
import makore.spring_app.service.UserPersistenceService;
import makore.spring_app.service.UserSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.*;

@Controller
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserPersistenceService userPersistenceService;
	@Autowired
	private UserSessionService userSessionService;

	// Handle GET requests for /user/email
	@RequestMapping(value = "/email", method = RequestMethod.GET)
	public String getUserMail(@RequestParam("user") String userName, Map<String, Object> model) {
		List<User> users = this.userPersistenceService.getAllUsers();
		for (User user : users) {
			if (userName.equals(user.getName())) {
				model.put("email", user.getMail());
			}
		}
		return "viewUserMail";
	}

	// Handle GET requests for /user/{userId}
	@RequestMapping(value = "/{userId}", method = RequestMethod.GET)
	public String getUser(@PathVariable String userId,
	                      Map<String, Object> model) {
		model.put("user", userPersistenceService.findUser(new Long(userId)));
		return "viewUser";
	}

	// Creating a form
	@RequestMapping(method = RequestMethod.GET, params = "new")
	public String createUser(Map<String, Object> model) {
		User user = new User();
		model.put("user", user);
		return "user";
	}

	// To trigger validation of a @Controller input, simply annotate the input
	// argument as @Valid:
	@RequestMapping(method = RequestMethod.POST)
	public String addUserFromForm(@Valid User user,
	                              BindingResult result) {
		// We can bind additional fields using the UserForm bean

		if (result.hasErrors()) {
			return "user";
		}
		try {
			userPersistenceService.save(user);
			// Redirect after POST (always, prevent refresh submitting)
			return "redirect:/user/" + user.getId();
		} catch (SpringAppException e) {
			// TODO The user already exists
			return "user";
		}
	}

	@RequestMapping(method = RequestMethod.POST)
	public String addUserFromMultipartForm(@Valid User user,
	                                       BindingResult result,
	                                       @RequestParam(value = "image", required = true)
	                                       MultipartFile image,
	                                       HttpServletRequest request) {
		if (result.hasErrors()) {
			return "user";
		}
		try {
			userPersistenceService.save(user);
			if (!image.isEmpty()) {
				validateImage(image);
				saveImage(request, user.getName(), image);
			}
		} catch (SpringAppException e) {
			result.reject(e.getMessage());
			return "user";
		}
		return "redirect:/user/" + user.getName();
	}

	private void validateImage(MultipartFile image) throws SpringAppException {
		if (!image.getContentType().equals("image/jpeg")) {
			throw new SpringAppException("Only JPG images accepted");
		}
	}

	private void saveImage(HttpServletRequest request, String fileName, MultipartFile image) throws SpringAppException {
		try {
			File file = new File(request.getSession().getServletContext().getRealPath("/") +
					File.separator + fileName);
			FileUtils.writeByteArrayToFile(file, image.getBytes());
		} catch (IOException e) {
			throw new SpringAppException("Unable to save image.");
		}
	}

//	@InitBinder
//	protected void initBinder(WebDataBinder binder) {
//		binder.setValidator(new MyImplValidator());
//	}

}
