package makore.spring_app.model;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Message {
	private long id;
	private String message;
	private User user;

	@javax.persistence.Column(name = "id", nullable = false, insertable = true, updatable = true, length = 10, precision = 0)
	@Id
	public long getId() {
		return this.id;
	}

	public void setId(final long id) {
		this.id = id;
	}

	@javax.persistence.Column(name = "message", nullable = true, insertable = true, updatable = true, length = 200, precision = 0)
	@Basic
	public String getMessage() {
		return this.message;
	}

	public void setMessage(final String message) {
		this.message = message;
	}

	@Override
	public boolean equals(final Object o) {
		if (this == o) {
			return true;
		}
		if ((o == null) || (getClass() != o.getClass())) {
			return false;
		}

		final Message message1 = (Message) o;

		if (this.id != message1.id) {
			return false;
		}
		if (this.message != null ? !this.message.equals(message1.message) : message1.message != null) {
			return false;
		}

		return true;
	}

	@Override
	public int hashCode() {
		int result = (int) (this.id ^ (this.id >>> 32));
		result = (31 * result) + (this.message != null ? this.message.hashCode() : 0);
		return result;
	}

	@ManyToOne
	@javax.persistence.JoinColumn(name = "user", referencedColumnName = "id")
	public User getUser() {
		return this.user;
	}

	public void setUser(final User user) {
		this.user = user;
	}
}
