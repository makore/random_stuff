package makore.spring_app.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import makore.spring_app.common.SpringAppException;
import makore.spring_app.model.User;
import makore.spring_app.service.UserPersistenceService;
import makore.spring_app.service.UserSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserPersistenceService userPersistenceService;
	@Autowired
	private UserSessionService userSessionService;

	@Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters long.")
	@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must be alphanumeric with no spaces")
	private String userName;
	@NotNull
	private String userEmail;

	// Handle GET requests for /user/email
	@RequestMapping(value = "/email", method = RequestMethod.GET)
	public String getUserMail(@RequestParam("user") String userName, Map<String, Object> model) {
		List<User> users = userPersistenceService.getAllUsers();
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
		return "editUser";
	}

	// To trigger validation of a @Controller input, simply annotate the input
	// argument as @Valid:
	@RequestMapping(method = RequestMethod.POST)
	public String addUserFromForm(@Valid User user,
			BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return "editUser";
		}
		try {
			userPersistenceService.save(user);
			// Redirect after POST (always, prevent refresh submitting)
			return "redirect:/user/" + user.getId();
		} catch (SpringAppException e) {
			// TODO The user already exists
			return "editUser";
		}
	}

	@RequestMapping(method = RequestMethod.POST)
	public String addUserFromMultipartForm(@Valid User user,
			BindingResult bindingResult,
			@RequestParam(value = "image", required = false)
			MultipartFile image) {
        if (bindingResult.hasErrors()) {
            return "editUser";
        }
        try {
			userPersistenceService.save(user);
            if (!image.isEmpty()) {
                validateImage(image);
				// TODO save image
            }
		} catch (SpringAppException e) {
            bindingResult.reject(e.getMessage());
            return "editUser";
        }
        return "redirect:/user/" + user.getName();
	}

	private void validateImage(MultipartFile image) throws SpringAppException {
        if (!image.getContentType().equals("image/jpeg")) {
			throw new SpringAppException("Only JPG images accepted");
        }
    }
}
