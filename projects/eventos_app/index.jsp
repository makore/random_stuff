<%@page contentType="text/html" pageEncoding="utf-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Prácticas de TW 2011-12 - Inicio</title>
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
		<p id="presentacion">
			Bienvenido a las prácticas de Tecnologías Web.
		</p>

		<div id="caja1">
			<form id="formAcceso" class="formAcceso" action="login" method="post">
				<fieldset>
					<legend align="center">Acceso</legend>

					<label for="login">Usuario <sup>*</sup></label>
					<input type="text" id="login" name="login" maxlength="30" value="" placeholder="Tu usuario"
					       required="required" autofocus="autofocus"/>
					<span id="eLogin" class="error">${errores.login}</span>

					<label for="password">Contrase&ntilde;a <sup>*</sup></label>
					<input type="password" id="password" name="password" maxlength="30" value="" placeholder=""
					       required="required"/>
					<span id="ePw" class="error"></span>

					<div id="submitBtn">
						<input type="submit" name="enviar" value="Entrar" class="awesome"/>
					</div>
					<p>¿No tienes cuenta? <a href="registro.jsp">¡Regístrate!</a></p>
				</fieldset>
			</form>
			<p class="smaller"><sup>*</sup> significa campo obligatorio.</p>
		</div>
		<div id="caja2">
			<div id="eventosCercanos">
				<h2>Eventos cercanos</h2>

				<div id="mapa" class="googleMap"></div>

				<form id="formBusqueda" action="" method="get">
					<fieldset>
						<legend align="center" class="oculto">Búsqueda</legend>
						<label for="buscarEventos">Distancia máxima</label>
						<input type="text" id="buscarEventos" name="buscarEventos" maxlength="30" value=""
						       placeholder="Kms. de distancia"/>
						<span id="eDist" class="error"></span>

						<div id="searchBtn">
							<input type="submit" name="buscar" value="Buscar" class="awesome"/>
						</div>
					</fieldset>
				</form>

				<div id="listaEventos">
					<h3 id="resultados" class="oculto">Resultados</h3>
					<dl id="eventos">
						<!--visibilidad
						   <dt>Evento 1 (fecha 1)</dt>
						   <dd class="indent"><button class="awesome" name="btnMap1" type="button">Ver en mapa</button></dd>
						   <dd><button class="awesome" name="btnDet1" type="button">Ver detalles</button></dd>
						   <dt>Evento 2 (fecha 2)</dt>
						   <dd class="indent"><button class="awesome" name="btnMap2" type="button">Ver en mapa</button></dd>
						   <dd><button class="awesome" name="btnDet2" type="button">Ver detalles</button></dd>
						   -->
					</dl>
				</div>

			</div>
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
<script type="text/javascript" src="js/mylib.js"></script>
<script type="text/javascript" src="js/script.js"></script>
</body>
</html>

