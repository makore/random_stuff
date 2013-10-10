<?php
	include("Mail.php");

	class MyMail
	{
		public static function send_mail($subject, $mailmsg, $from_email, $to_email, $from_name, $to_name)
		{
			$from = "From: " . $from_name . " <" . $from_email . ">";
			$to = "To: " . $to_name . " <" . $to_email . ">";
			$recipients = $to_email;
			$headers["From"] = $from;
			$headers["To"] = $to;
			$headers["Subject"] = $subject;
			$headers["Content-Type"] = "text/plain; charset=ISO-2022-JP";

			$smtpinfo["host"] = "smtp.googlemail.com";
			$smtpinfo["port"] = "25";
			$smtpinfo["auth"] = true;
			$smtpinfo["username"] = "makore";
			$smtpinfo["password"] = "";

			$mail_object =& Mail::factory("smtp", $smtpinfo);

			$mail_object->send($recipients, $headers, $mailmsg);
		}
	}
