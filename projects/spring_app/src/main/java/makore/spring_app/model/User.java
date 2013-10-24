package makore.spring_app.model;

import java.util.Collection;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
public class User {
	private long id;
	private String name;
	private String mail;
	private Collection<Message> messages;

	@javax.persistence.Column(name = "id", nullable = false, insertable = true, updatable = true, length = 10, precision = 0)
	@Id
	public long getId() {
		return this.id;
	}

	public void setId(final long id) {
		this.id = id;
	}

	@javax.persistence.Column(name = "name", nullable = true, insertable = true, updatable = true, length = 45, precision = 0)
	@Basic
	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	@javax.persistence.Column(name = "mail", nullable = true, insertable = true, updatable = true, length = 45, precision = 0)
	@Basic
	public String getMail() {
		return this.mail;
	}

	public void setMail(final String mail) {
		this.mail = mail;
	}

	@Override
	public boolean equals(final Object o) {
		if (this == o) {
			return true;
		}
		if ((o == null) || (getClass() != o.getClass())) {
			return false;
		}

		final User user = (User) o;

		if (this.id != user.id) {
			return false;
		}
		if (this.mail != null ? !this.mail.equals(user.mail) : user.mail != null) {
			return false;
		}
		if (this.name != null ? !this.name.equals(user.name) : user.name != null) {
			return false;
		}

		return true;
	}

	@Override
	public int hashCode() {
		int result = (int) (this.id ^ (this.id >>> 32));
		result = (31 * result) + (this.name != null ? this.name.hashCode() : 0);
		result = (31 * result) + (this.mail != null ? this.mail.hashCode() : 0);
		return result;
	}

	@OneToMany(mappedBy = "user")
	@Fetch(FetchMode.SELECT)
	@BatchSize(size = 10)
	public Collection<Message> getMessages() {
		return this.messages;
	}

	public void setMessages(final Collection<Message> messages) {
		this.messages = messages;
	}
}
