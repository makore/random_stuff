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
	<h2>Mailing list</h2>

	<table id="hor-minimalist-b" summary="Mailing list">
		<thead>
			<tr>
				<th scope="col">Customer name</th>
				<th scope="col">E-mail</th>
			</tr>
		</thead>
		<tfoot>
			<tr>
				<td>
					<?php
					if ($page > 0)
					{
						$prevPage = $page - 1;
						?>
						<a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) . '?view=list&page=' . strval($prevPage) ?>">Previous page</a>
						<?php
					}
					else
					{
						?>
						Previous page
						<?php
					}
					?>

				</td>
				<td class="right_next">
					<?php
					if (isset($hasNextPage))
					{
						$nextPage = $page + 1;
						?>
						<a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) . '?view=list&page=' . strval($nextPage) ?>">Next page</a>
						<?php
					}
					else
					{
						?>
						Next page
						<?php
					}
					?>
				</td>
			</tr>
		</tfoot>
		<tbody>
			<?=$html?>
		</tbody>
	</table>

	<p>[<a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">Back home</a>]</p>

</div>
<script src="js/main.js"></script>
<script src="js/vendor/jquery-1.8.0.min.js"></script>
</body>
</html>

