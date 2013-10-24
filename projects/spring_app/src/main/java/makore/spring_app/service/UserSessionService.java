package makore.spring_app.service;

import makore.spring_app.model.User;

public interface UserSessionService {
	User getUser();

	void setUser(User user);

	void addUserMessage(String message);
}
