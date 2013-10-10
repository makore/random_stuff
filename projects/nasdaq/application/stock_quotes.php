<?php

	class StockQuotes
	{
		/*
		 * companies which will use in the report
		 */
		private $companies = array();
		private $american_bond_rate; // 'rf' value in the CAPM wikipedia's article formula

		/*
		 * we store all companies data by market capitalization order and by beta value order
		 */
		private $sorted_data_by_mark_cap = array();
		private $sorted_data_by_beta = array();

		/*
		 * we store those 3 companies with higher beta value and lower beta value
		 */
		private $higher_risk_companies_data_estimation = array();
		private $lower_risk_companies_data_estimation = array();

		const USER_AGENT = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0';

		function __construct()
		{
			/*
			 * firstly, we load de php.ini file
			 */
			$this->load_companies();
		}

		private function load_companies()
		{
			$companies_ini = parse_ini_file('app.ini');
			$this->companies = $companies_ini['companies'];
			$this->american_bond_rate = $companies_ini['american_bond_rate'];
		}

		/*
		 * used to make the report of the block one
		 */
		public function fetch_stock_data()
		{
			/*
			 * the fetched data from www.google.com/finance from all the companies
			 */
			$data = array();

			/*
			 * helper array for let us reorder the fetched data by market cap. and beta values
			 */
			$sorted_data_keys_by_mark_cap = array();
			$sorted_data_keys_by_beta = array();

			$total_market_interest = 0;
			$number_stocks = 0;

			foreach ($this->companies as $symbol)
			{
				$raw_data = $this->get_company_data($symbol);

				//Remove CR's from ouput - make it one line
				$raw_data = str_replace("\n", "", $raw_data);

				//Remove //, [ and ] to build qualified string
				$raw_data = substr($raw_data, 4, strlen($raw_data) - 5);
				$raw_data = stripslashes($raw_data);

				//decode JSON data
				$json = json_decode($raw_data, true);

				// store the requested data
				$comany_name = $json['name'];
				$stock_price = $json['l'];
				$beta = $json['beta'];
				$eps = $json['eps'];
				$change = $json['c'];
				$profit_earning_capacity = ($eps / $stock_price) * 100;

				if (empty($beta) || !is_numeric($beta))
				{
					// beta = 1 represents an average risk (neither higher nor lower) in relation to the market
					// in this case, this company doesn't provide the beta value for unknown reasons, so beta = 1
					// represents the default value.
					$beta = 1;
				}
				$market_capitalization = $json['mc'];
				if (strpos($market_capitalization,'B') !== false)
				{
					// to let us get those companies which market capitalization is higher,
					// we must represent the money in Millions, not Billions
					$market_capitalization *= 1000;
				}

				// we get the state, zipcode and country
				$address = $json['summary'][0]['address'];
				$address_array = explode(",", $address);
				$state = trim($address_array[count($address_array) - 2]);
				$state .= ' - ' . trim($address_array[count($address_array) - 1]);

				// we need this to obtain the E(M)'s final value
				$number_stocks++;
				$total_market_interest += $profit_earning_capacity;

				$data_company = array(
					'comany_name' => $comany_name,
					'price' => $stock_price,
					'symbol' => $symbol,
					'state' => $state,
					'beta' => $beta,
					'eps' => $eps,
					'market_capitalizatinion' => $market_capitalization,
					'change' => $change,
					'interest' => $profit_earning_capacity,
					'capm' => 0,
					'capm_based_estimation' => 0);
				$data[$symbol] = $data_company;

				$sorted_data_keys_by_mark_cap[$symbol] =  $market_capitalization;
				$sorted_data_keys_by_beta[$symbol] =  $beta;
			}
			reset($this->companies);

			// finally, we store the E(M) value
			$market_interest = $total_market_interest / $number_stocks;

			// once we get all companies data, we must calculate the CAPM estimation
			// and the final stock value market CAPM bases
			foreach ($this->companies as $symbol)
			{
				$beta = $data[$symbol]['beta'];

				// http://es.wikipedia.org/wiki/Capital_asset_pricing_model
				$capm = $this->american_bond_rate + ($beta * ($market_interest - $this->american_bond_rate));
				$data[$symbol]['capm'] = number_format($capm, 2);

				$stock_price = $data[$symbol]['price'];
				$eps = $data[$symbol]['eps'];
				$capm_based_estimation = (($stock_price + $eps) / ($capm + 100)) * 100;
				$data[$symbol]['capm_based_estimation'] = number_format($capm_based_estimation, 2);
			}
			reset($this->companies);

			// store the processed data
			// we order the data in reverse way by market cap.
			arsort($sorted_data_keys_by_mark_cap);
			foreach ($sorted_data_keys_by_mark_cap as $key => $val)
			{
				$this->sorted_data_by_mark_cap[$key] = $data[$key];
			}
			// we order the data by beta risk
			asort($sorted_data_keys_by_beta);
			foreach ($sorted_data_keys_by_beta as $key => $val)
			{
				$this->sorted_data_by_beta[] = $data[$key];
			}
		}

		public function get_sorted_data_by_mark_cap()
		{
			return $this->sorted_data_by_mark_cap;
		}

		public function get_sorted_data_by_beta()
		{
			return $this->sorted_data_by_beta;
		}

		/*
		 * used to make the report of the block two
		 */
		public function calculate_estimations()
		{
			$cases = array(
				'1000m-5d',
				'1000m-30d',
				'1000m-1y',
				'10000m-5d',
				'10000m-30d',
				'10000m-1y',
				'100000m-5d',
				'100000m-30d',
				'100000m-1y'
			);

			$higher_risk_companies = array();
			$lower_risk_companies = array();
			for ($i = 0; $i < 3 && $i < count($this->sorted_data_by_beta); $i++)
			{
				$lower_risk_companies[] = $this->sorted_data_by_beta[$i];
				$higher_risk_companies[] = $this->sorted_data_by_beta[count($this->sorted_data_by_beta) - $i - 1];
			}

			foreach ($cases as $case)
			{
				$investment = 0;
				$days = 0;
				switch ($case)
				{
					case '1000m-5d':
						$investment = 1000;
						$days = 5;
						break;
					case '1000m-30d':
						$investment = 1000;
						$days = 30;
						break;
					case '1000m-1y';
						$investment = 1000;
						$days = 365;
						break;
					case '10000m-5d';
						$investment = 10000;
						$days = 5;
						break;
					case '10000m-30d':
						$investment = 10000;
						$days = 30;
						break;
					case '10000m-1y':
						$investment = 10000;
						$days = 365;
						break;
					case '100000m-5d':
						$investment = 100000;
						$days = 5;
						break;
					case '100000m-30d':
						$investment = 100000;
						$days = 30;
						break;
					case '100000m-1y':
						$investment = 100000;
						$days = 365;
						break;
				}

				// we calculate the gain for each market value, by investment and by time

				foreach ($higher_risk_companies as $c)
				{
					$result = $investment * (floatval($c['interest']) / 100) * ($days / 365);
					$this->higher_risk_companies_data_estimation[$c['comany_name']][$case] = $result;
					$this->higher_risk_companies_data_estimation[$c['comany_name']]['interest'] = $c['interest'];
				}

				foreach ($lower_risk_companies as $c)
				{
					$result = $investment * (floatval($c['interest']) / 100) * ($days / 365);
					$this->lower_risk_companies_data_estimation[$c['comany_name']][$case] = $result;
					$this->lower_risk_companies_data_estimation[$c['comany_name']]['interest'] = $c['interest'];
				}
			}
		}

		public function get_higher_risk_companies_data_estimation()
		{
			return $this->higher_risk_companies_data_estimation;
		}

		public function get_lower_risk_companies_data_estimation()
		{
			return $this->lower_risk_companies_data_estimation;
		}

		/*
		 * we fetch the raw data through cURL for each company
		 */
		private function get_company_data($company)
		{
			$channel = curl_init();

			$headers = array(
				'User-Agent: ' . StockQuotes::USER_AGENT
			);

			$url = "http://www.google.com/finance?q=$company&output=json";
			curl_setopt($channel, CURLOPT_URL, $url);
			curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($channel, CURLOPT_HTTPHEADER, $headers);

			$output = curl_exec($channel);

			if (curl_errno($channel)) {
				return "Error: " . curl_error($channel);
			} else {
				curl_close($channel);
				return $output;
			}
		}

	}
