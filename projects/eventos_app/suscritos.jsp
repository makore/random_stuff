<%@page contentType="text/html" pageEncoding="utf-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Prácticas de TW 2011-12 - Suscritos</title>
	<meta name="description" content="Prácticas de Programación en Internet" lang="ES"/>
	<meta name="author" content="Juan Luis Carratal&aacute;"/>
	<meta name="keywords" content="pi, universidad, alicante, programacion, internet"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>

	<link rel="stylesheet" type="text/css" href="css/style.css" media="screen" id="css"/>
	<link rel="stylesheet" type="text/css" href="css/print.css" media="print"/>
	<link rel="alternate stylesheet" title="Estilo alternativo" type="text/css" href="css/alternative.css"
	      media="screen"/>
	<!--<script src="js/libs/modernizr-2.0.6.min.js"></script>-->
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
</head>
<body>
<div id="container">
	<header id="header">
		<h1><span class="title2">Tecnologías Web</span> <span class="title1">2011-12</span></h1>
	</header>
	<div id="main">
		<p class="bienvenido">Bienvenido, ${usuario.nombre} (<a href="logout">Logout</a>)</p>

		<p id="presentacion">Página de eventos a los que estamos suscritos.</p>

		<div id="caja1">
			<div id="eventosCercanos">
				<div id="listaEventos">
					<h2 id="suscritos">Eventos suscritos</h2>
					<dl id="eventos">
					</dl>
					<!--<dl>-->
					<!--<dt>Evento 1 (fecha 1)</dt>-->
					<!--<dd class="indent"><button class="awesome" name="btnMap1" type="button">Ver en mapa</button></dd>-->
					<!--<dd><button class="awesome" name="btnDet1" type="button">Ver detalles</button></dd>-->
					<!--<dt>Evento 2 (fecha 2)</dt>-->
					<!--<dd class="indent"><button class="awesome" name="btnMap2" type="button">Ver en mapa</button></dd>-->
					<!--<dd><button class="awesome" name="btnDet2" type="button">Ver detalles</button></dd>-->
					<!--</dl>-->
				</div>
				<div id="mapa" class="googleMap"></div>
				<div class="empty"></div>
			</div>
		</div>

		<div id="caja2">
			<div id="showBusqueda">
				<form id="formBusquedaSus" action="" method="get">
					<fieldset>
						<legend align="center">Búsqueda</legend>
						<div id="caja3">
							<label id="lblBusEv" for="buscarEventosSus">Buscar eventos</label>
							<input type="text" id="buscarEventosSus" name="buscarEventosSus" maxlength="30" value=""
							       placeholder="Palabras clave de búsqueda"/>
						</div>
						<div id="caja4">
							<div class="c_checkbox">
								<input type="checkbox" name="useMax" id="useMax" value="Usar distancia máxima"/>
								Usar distancia máxima
							</div>
						</div>
						<div id="caja5">
							<label id="lblDistMax" for="distMax">Distáncia máxima</label>
							<input type="text" id="distMax" name="distMax" maxlength="30" value=""
							       placeholder="Distáncia respecto a su posición actual"/>
						</div>
						<div id="caja6">
							<label id="lblMod" for="modalidad1">Elige una modalidad</label>
							<input type="radio" name="modalidad" id="modalidad1" value="Mostrar eventos suscritos"/>
							Mostrar eventos suscritos
							<input type="radio" name="modalidad" id="modalidad2" value="Buscar eventos"
							       checked="checked"/>
							Buscar eventos
						</div>
						<div id="caja7">
							<div id="searchBtn">
								<input type="submit" name="buscar" value="Buscar" class="awesome"/>
							</div>
						</div>
					</fieldset>
				</form>
				<div id="resultados"></div>
			</div>
			<a id="abrirBusqueda" href="">Realizar búsqueda</a>
			<a id="nuevoEvento" href="nuevoEvento.jsp">Nuevo evento</a>
		</div>

	</div>

	<footer class="small">
		<p>« Página escrita por Juan Luis Carratalá Castillo »</p>
	</footer>

	<div id="cambiaEstilos">
		<form>
			<fieldset>
				<select id="cssSelected">
					<option selected value="1">Estilo 1</option>
					<option value="2">Estilo 2</option>
					<option value="3">Estilo 3</option>
				</select>
			</fieldset>
		</form>
	</div>
</div>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.1/jquery-ui.js"></script>
<script type="text/javascript" src="js/mylib.js"></script>
<script type="text/javascript" src="js/script.js"></script>
</body>
</html>

