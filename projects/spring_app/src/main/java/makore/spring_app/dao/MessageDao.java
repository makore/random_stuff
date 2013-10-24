package makore.spring_app.dao;

import java.util.List;

import makore.spring_app.model.Message;

public interface MessageDao {
	List<Message> getUserMessages(long userId);
}
