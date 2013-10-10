<?php

class Controller {
	private $load;
	private $model;

	const PAGE_SIZE = 30;

	function __construct()
	{
		$this->load = new Load();
		$this->model = new Model();
	}

	public function dispatch_event()
	{
		var $view_name = '';
		if (array_key_exists('view', $_GET))
		{
			$view_name = $_GET['view'];
		}

		if ($_POST)
		{
			switch ($view_name)
			{
				case 'register':
					$this->register_customer();
					break;
				default:
					$this->home();
			}
		}
		else if ($_GET)
		{
			switch ($view_name)
			{
				case 'register':
					$this->register_customer();
					break;
				case 'list':
					$this->mailing_list();
					break;
				case 'report':
					$this->report();
					break;
				default:
					$this->home();
			}
		}
		else
		{
			$this->home();
		}
	}
	
	private function home()
	{
		$this->load->view('home_view.php');
	}

	private function register_customer()
	{
		if (!isset($_POST['submitted']))
		{
			$this->load->view('register_view.php');
		}
		else
		{
			$user_name = (isset($_POST['username'])) ? $_POST['username'] : '';
			$email = (isset($_POST['email'])) ? $_POST['email'] : '';
			$user_name = stripslashes($user_name);

			if (filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($user_name))
			{
				$array_email = $this->model->get($email);
				if (count($array_email) > 0)
				{
					$data = array('user_repeated' => true);
					$this->load->view('register_view.php', $data);
				}
				else
				{
					$this->model->add($user_name, $email);
					$this->home();
				}
			}
			else
			{
				$data = array('bad_input' => true);
				$this->load->view('register_view.php', $data);
			}
		}
	}

	private function mailing_list()
	{
		$page = 0;
		if (isset($_GET['page']))
		{
			$page = intval($_GET['page']);
			if ($page < 0)
			{
				$page = 0;
			}
		}
		$data['page'] = $page;

		$users = $this->model->get();

		if (Controller::PAGE_SIZE * ($page + 1) < count($users))
		{
			$data['hasNextPage'] = true;
		}

		$data['html'] = $this->generate_customers_html($users, $page);
		$this->load->view('mailing_list_view.php', $data);
	}

	private function report()
	{
		$data = array();
		$stock = new StockQuotes();

		$stock->fetch_stock_data();
		$data_market_cap = $stock->get_sorted_data_by_mark_cap();
		$data['html_market_cap'] = $this->generate_html_report_market_cap($data_market_cap);

		$stock->calculate_estimations();
		$data_higher_risk_estimation = $stock->get_higher_risk_companies_data_estimation();
		$data_lower_risk_estimation = $stock->get_lower_risk_companies_data_estimation();
		$data['html_higher_risk'] = $this->generate_html_report_estimations($data_higher_risk_estimation);
		$data['html_lower_risk'] = $this->generate_html_report_estimations($data_lower_risk_estimation);

		$this->load->view('report_view.php', $data);
	}

	private function generate_customers_html($data, $page)
	{
		$html = null;
		if (is_array($data))
		{
			ob_start();
			$counter = 0;
			$start = Controller::PAGE_SIZE * $page;
			$end = Controller::PAGE_SIZE * ($page + 1);
			foreach ($data as $key => $val)
			{
				if ($counter >= $start && $counter < $end)
				{
					?>
				<tr>
					<td><?=$val['username']?></td>
					<td><?=$val['email']?></td>
				</tr>
				<?php
				}
				$counter++;
			}
			$html = ob_get_clean();
		}
		return $html;
	}

	private function generate_html_report_estimations($data)
	{
		$html = null;
		if (is_array($data))
		{
			ob_start();
			foreach ($data as $key => $val)
			{
				?>
			<tr>
				<th rowspan="10" bgcolor="#ddd"  style="text-align: center;"><?=$key?></th>
				<td>Cash earning with investment of $1000 next 5 days</td>
				<td>&#36;<?=number_format($val['1000m-5d'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $1000 next 30 days</td>
				<td>&#36;<?=number_format($val['1000m-30d'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $1000 in 1 year</td>
				<td>&#36;<?=number_format($val['1000m-1y'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $10000 next 5 days</td>
				<td>&#36;<?=number_format($val['10000m-5d'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $10000 next 30 days</td>
				<td>&#36;<?=number_format($val['10000m-30d'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $10000 in 1 year</td>
				<td>&#36;<?=number_format($val['10000m-1y'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $100000 next 5 days</td>
				<td>&#36;<?=number_format($val['100000m-5d'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $100000 next 30 days</td>
				<td>&#36;<?=number_format($val['100000m-30d'], 2)?></td>
			</tr>
			<tr>
				<td>Cash earning with investment of $100000 in 1 year</td>
				<td>&#36;<?=number_format($val['100000m-1y'], 2)?></td>
			</tr>
			<tr>
				<td>Interest</td>
				<td><?=number_format($val['interest'], 2)?>&#32;&#37;</td>
			</tr>
			<?php
			}
			$html = ob_get_clean();
		}
		return $html;
	}

	private function generate_html_report_market_cap($data)
	{
		$html = null;
		if (is_array($data))
		{
			ob_start();
			foreach ($data as $key => $val)
			{
				?>
			<tr>
				<td><?=$val['comany_name']?></td>
				<td><?=$val['symbol']?></td>
				<td style="font-size: 0.7em;"><?=$val['state']?></td>
				<td>&#36;<?=$val['price']?></td>
				<td><?=$val['beta']?></td>
				<td><?=$val['change']?>&#32;&#37;</td>
				<td>&#36;<?=$val['capm_based_estimation']?></td>
			</tr>
			<?php
			}
			$html = ob_get_clean();
		}
		return $html;
	}

}