<?php
	class Util
	{
		public static function get_http_header()
		{
			if (isset($_GET['token']))
			{
				$token  = $_GET['token'];
				print "El token: " . $token . "<br/>";
			}

			$h = apache_request_headers();

			foreach ($h as $header => $value)
			{
				echo "$header: $value <br />\n";
			}
		}

		public static function feed()
		{
			$ch = curl_init();

			$headers = array(
				"Content-Type: application/x-www-form-urlencoded",
				"Authorization: AuthSub token=\"1/RBWzM5r-uhp5vo0IdK0_9flACxFYNeTN0-otZywIJdw\"",
				"GData-Version: 2",
				"Host: finance.google.com",
				"Connection: keep-alive",
				"Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2"
			);

			curl_setopt($ch, CURLOPT_URL, "http://finance.google.com/finance/feeds/default/portfolios/1/positions/NASDAQ:AAPL");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

			$output = curl_exec($ch);

			if (curl_errno($ch))
			{
				print "Error: " . curl_error($ch);
			}
			else
			{
				echo "The result: " . $output;
				curl_close($ch);
			}
		}
	}
