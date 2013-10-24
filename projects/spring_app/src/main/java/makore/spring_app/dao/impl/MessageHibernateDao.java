package makore.spring_app.dao.impl;

import java.util.List;

import makore.spring_app.dao.CustomHibernateDaoSupport;
import makore.spring_app.dao.MessageDao;
import makore.spring_app.model.Message;
import makore.spring_app.model.User;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MessageHibernateDao extends CustomHibernateDaoSupport<Message>
		implements MessageDao {

	@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
	@Override
	public List<Message> getUserMessages(long userId) {
		User user = new User();
		user.setId(userId);
		Message example = new Message();
		example.setUser(user);
		return super.findByExample(example);
	}
}
