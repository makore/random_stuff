package makore.spring_app.service;

import java.util.List;

import makore.spring_app.common.SpringAppException;
import makore.spring_app.model.User;

public interface UserPersistenceService {
	User findUser(Long id);

	List<User> getAllUsers();

	void save(User user) throws SpringAppException;
}
