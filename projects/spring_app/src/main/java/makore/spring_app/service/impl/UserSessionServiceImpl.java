package makore.spring_app.service.impl;

import makore.spring_app.dao.UserDao;
import makore.spring_app.model.Message;
import makore.spring_app.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Service
@Scope("session")
public class UserSessionServiceImpl {
	@Autowired
	private UserDao dao;
	private User user;

	public UserSessionServiceImpl(User user) {
		this.user = user;
	}

	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void addUserMessage(String message) {
		Message m = new Message();
		m.setUser(this.user);
		m.setMessage(message);
		this.user.getMessages().add(m);
	}
}
