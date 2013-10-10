<?php

	// Use: php -f send_mail.php subject="the subject", from_email="An@email.com", to_email="another@email.com", from_name="A name", to_name="Another name"

	parse_str(implode('&', array_slice($argv, 1)), $_GET);

	require 'my_mail.php';
	require 'stock_quotes.php';
	require 'model.php';

	$subject = $_GET['subject'];
	$from_email = $_GET['from_email'];
	$to_email = $_GET['to_email'];
	$from_name = $_GET['from_name'];
	$to_name = $_GET['to_name'];

	$MIN_TIME_UNTIL_ANOTHER_EMAIL_SENDING = 60 * 60 * 12; // 12 hours
	$model = new Model();
	$user = $model->get($to_email);
	if (count($user) > 0)
	{
		$timestamp = 0;
		foreach ($user as $key => $val)
		{
			$timestamp = $val['timestamp'];
		}

		if (time() - $timestamp > $MIN_TIME_UNTIL_ANOTHER_EMAIL_SENDING)
		{
			$stock = new StockQuotes();
			$stock->fetch_stock_data();
			$stock->calculate_estimations();
			$data1 = $stock->get_sorted_data_by_mark_cap();
			$data2 = $stock->get_higher_risk_companies_data_estimation();
			$data3 = $stock->get_lower_risk_companies_data_estimation();
			$txt_report = generate_txt_report($data1, $data2, $data3);
			$mail = new MyMail();
			$mail->send_mail($subject, $txt_report, $from_email, $to_email, $from_name, $to_name);
			echo 'The email was sent successfully.\n\r';
		}
		else
		{
			echo 'The email cannot be sent yet. Try it later.\n\r';
		}
	}
	else
	{
		echo 'The user is not registered in the system.';
		die();
	}

	function generate_txt_report($data_market, $data_estimation_high_risk, $data_estimation_low_risk)
	{
		$txt = 'Market report:\n\n';
		foreach ($data_market as $key => $val)
		{
			$txt .= 'Company name: ' . $val['comany_name'] . ', symbol: ' . $val['symbol'] .
				', state: ' . $val['state'] . ', price: ' . $val['price'] . ', beta: ' .
				$val['beta'] . ', change: ' . $val['change'] . ', CAPM: ' .	$val['capm'] . '.\n';
		}

		$txt .= '\n\nEstimation report:\n\n';
		$txt .= '\n3 companies with bigger investment risk (less predictables)\n';

		foreach ($data_estimation_high_risk as $key => $val)
		{
			$txt .= 'Company name: ' . $key . '.\n';
			$txt .= 'Cash earning with investment of $1000 next 5 days: $' . number_format($val['1000m-5d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $1000 next 30 days: $' . number_format($val['1000m-30d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $1000 in 1 year: $' . number_format($val['1000m-1y'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $10000 next 5 days: $' . number_format($val['10000m-5d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $10000 next 30 days: $' . number_format($val['10000m-30d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $10000 in 1 year: $' . number_format($val['10000m-1y'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $100000 next 5 days: $' . number_format($val['100000m-5d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $100000 next 30 days: $' . number_format($val['100000m-30d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $100000 in 1 year: $' . number_format($val['100000m-1y'], 2) . '.\n';
			$txt .= 'Interest: ' . number_format($val['interest'], 2) . ' %.\n';
		}

		$txt .= '\n3 companies with lower investment risk (more stables)\n';

		foreach ($data_estimation_low_risk as $key => $val)
		{
			$txt .= 'Company name: ' . $key . '.\n';
			$txt .= 'Cash earning with investment of $1000 next 5 days: $' . number_format($val['1000m-5d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $1000 next 30 days: $' . number_format($val['1000m-30d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $1000 in 1 year: $' . number_format($val['1000m-1y'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $10000 next 5 days: $' . number_format($val['10000m-5d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $10000 next 30 days: $' . number_format($val['10000m-30d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $10000 in 1 year: $' . number_format($val['10000m-1y'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $100000 next 5 days: $' . number_format($val['100000m-5d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $100000 next 30 days: $' . number_format($val['100000m-30d'], 2) . '.\n';
			$txt .= 'Cash earning with investment of $100000 in 1 year: $' . number_format($val['100000m-1y'], 2) . '.\n';
			$txt .= 'Interest: ' . number_format($val['interest'], 2) . ' %.\n';
		}
		return $txt;
	}

