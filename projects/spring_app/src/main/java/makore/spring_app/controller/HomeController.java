package makore.spring_app.controller;

import java.util.Map;

import makore.spring_app.service.UserPersistenceService;
import makore.spring_app.service.UserSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	@Autowired
	private UserPersistenceService userPersistenceService;
	@Autowired
	private UserSessionService userSessionService;

	@RequestMapping({ "/", "/home" })
	public String showHomePage(Map<String, Object> model) {
		model.put("hello", "world");
		return "home";
	}
}
