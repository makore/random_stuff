package makore.spring_app.service.impl;

import java.util.List;

import makore.spring_app.common.SpringAppException;
import makore.spring_app.dao.UserDao;
import makore.spring_app.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPersistenceServiceImpl {
	@Autowired
	private UserDao dao;

	public UserPersistenceServiceImpl() {
	}

	public User findUser(Long id) {
		return this.dao.getUser(id);
	}

	public List<User> getAllUsers() {
		return this.dao.getUsers();
	}

	public void save(User user) throws SpringAppException {
		if (this.dao.getUser(new Long(user.getMail())) == null) {
			throw new SpringAppException("The email already exists.");
		}
		this.dao.save(user);
	}

}
