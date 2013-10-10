<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Daily finance report system</title>

	<link rel="stylesheet" href="css/normalize.css" type="text/css" />
	<link rel="stylesheet" href="css/main.css" type="text/css" />
</head>
<body>
<div id="main">
	<h1>The daily finance report system</h1>
	<p>Please enter your details below to register in the email distribution list</p>


	<form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF'] . '?view=register'); ?>"
	      name="registerform" id="registerform">
		<fieldset>
			<label for="username">Your name:</label>
			<input type="text" name="username" id="username" required="required" autofocus="autofocus" maxlength="50" /><br />
			<label for="email">Your email:</label>
			<input type="email" name="email" id="email" /><br />
			<input type="submit" name="register" id="register" value="Register" required="required" maxlength="50" />
			<input type="hidden" name="submitted" value="1"/>
		</fieldset>
	</form>

	<?php
	if (isset($bad_input))
	{
		?>
		<p style="color:red; font-weight: bold;">The user name field cannot be empty and the email must be a valid address.</p>
		<?php
	}
	if (isset($user_repeated))
	{
		?>
		<p style="color:red; font-weight: bold;">Choose a different email address.</p>
		<?php
	}
	?>

	<p>[<a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">Back home</a>]</p>

</div>

<script src="js/vendor/jquery-1.8.0.min.js"></script>
</body>
</html>

