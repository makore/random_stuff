package makore.spring_app.controller;

import makore.spring_app.common.SpringAppException;
import makore.spring_app.model.User;
import makore.spring_app.model.UserForm;
import makore.spring_app.service.UserPersistenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

@Controller
@RequestMapping("/users/{userId}/edit")
@SessionAttributes(types = UserForm.class)
public class EditUserController {

	@Autowired
	private UserPersistenceService service;

	// "allUsers" is available in the view
	@ModelAttribute("allUsers")
	public java.util.List<User> populatePetTypes() {
		return service.getAllUsers();
	}

	@RequestMapping(method = RequestMethod.POST)
	public String processSubmit(
			@ModelAttribute("user") UserForm userForm,
			BindingResult result, SessionStatus status) {

		//new UserValidator().validate(user, result);

		if (result.hasErrors()) {
			return "user";
		}
		try {
			service.save(userForm.getUser());
			// Redirect after POST (always, prevent refresh submitting)
			status.setComplete();
			return "redirect:/user/" + userForm.getUser().getId();
		} catch (SpringAppException e) {
			// TODO The user already exists
			return "user";
		}
	}

}
