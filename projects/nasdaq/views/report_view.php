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
	<h2>Stock quotes report</h2>

	<h3 class="header_block">Block one</h3>
	<table id="hor-minimalist-b" summary="30 more valuable comapnies">
		<thead>
		<tr>
			<th scope="col">Company name</th>
			<th scope="col">Symbol</th>
			<th scope="col">State</th>
			<th scope="col">Stock price</th>
			<th scope="col">Beta</th>
			<th scope="col">Change</th>
			<th scope="col">CAPM based est.</th>
		</tr>
		</thead>
		<tfoot>
		</tfoot>
		<tbody>
			<?=$html_market_cap?>
		</tbody>
	</table>

	<h3 class="header_block">Block two</h3>
	<p class="paragraph_block">3 companies with bigger investment risk (less predictables)</p>
	<table id="hor-minimalist-b" summary="Tree companies less predictables" style="text-align: left;">
		<tbody>
			<?=$html_higher_risk?>
		</tbody>
	</table>

	<p class="paragraph_block">3 companies with lower investment risk (more stables)</p>
	<table id="hor-minimalist-b" summary="Tree companies more predictables">
		<tbody>
			<?=$html_lower_risk?>
		</tbody>
	</table>

	<p>[<a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">Back home</a>]</p>

</div>
<script src="js/main.js"></script>
<script src="js/vendor/jquery-1.8.0.min.js"></script>
</body>
</html>
