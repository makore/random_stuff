package makore.spring_app.model;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UserForm {
	@Valid
	private User user;

	@NotNull
	@Size(min = 3, max = 20)
	@Pattern(regexp = "^[a-zA-Z0-9]+$")
	private String anotherField;

	private CommonsMultipartFile file;

	public User getUser() {
		return user;
	}

	public void setUser(final User user) {
		this.user = user;
	}

	public String getAnotherField() {
		return anotherField;
	}

	public void setAnotherField(final String anotherField) {
		this.anotherField = anotherField;
	}

	public CommonsMultipartFile getFile() {
		return file;
	}

	public void setFile(CommonsMultipartFile file) {
		this.file = file;
	}
}
