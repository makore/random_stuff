package makore.spring_app.dao.impl;

import java.util.List;

import makore.spring_app.dao.CustomHibernateDaoSupport;
import makore.spring_app.dao.UserDao;
import makore.spring_app.model.User;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class UserHibernateDao extends CustomHibernateDaoSupport<User>
		implements UserDao {

	@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
	@Override
	public User getUser(Long id) {
		User user = findById(id);
		if (!Hibernate.isInitialized(user.getMessages())) {
			Hibernate.initialize(user.getMessages());
		}
		return user;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	@Override
	public void save(User user) {
		attachDirty(user);
	}

	@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
	@Override
	public List<User> getUsers() {
		return findAll();
	}

	@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
	@Override
	public User findUserByEmail(String email) {
		// findByCriteria(Restrictions.eq("email", email));
		return find("from User where email = ?", email).get(0);
	}
}
