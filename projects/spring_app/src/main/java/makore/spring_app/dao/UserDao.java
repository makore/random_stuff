package makore.spring_app.dao;

import java.util.List;

import makore.spring_app.model.User;

public interface UserDao {
	User getUser(Long id);

	void save(User user);

	List<User> getUsers();

	User findUserByEmail(String email);
}
