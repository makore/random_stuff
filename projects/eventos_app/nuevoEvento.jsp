<%@page contentType="text/html" pageEncoding="utf-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Prácticas de TW 2011-12 - Nuevo evento</title>
	<meta name="description" content="Prácticas de Programación en Internet" lang="ES"/>
	<meta name="author" content="Juan Luis Carratal&aacute;"/>
	<meta name="keywords" content="pi, universidad, alicante, programacion, internet"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>


	<link rel="stylesheet" type="text/css" href="css/style.css" media="screen" id="css"/>
	<link rel="stylesheet" type="text/css" href="css/print.css" media="print"/>
	<link rel="alternate stylesheet" title="Estilo alternativo" type="text/css"
	      href="css/alternative.css" media="screen"/>
	<!--<script src="js/libs/modernizr-2.0.6.min.js"></script>-->
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>

	<link rel="stylesheet" type="text/css" media="all" href="css/calendar-estilo.css" />
	<script type="text/javascript" src="js/calendar.js"></script>
	<script type="text/javascript" src="js/calendar-es.js"></script>
	<script type="text/javascript" src="js/calendar-setup.js"></script>

</head>
<body>
<div id="container">
	<header id="header">
		<h1><span class="title2">Tecnologías Web</span> <span class="title1">2011-12</span></h1>
	</header>
	<nav>
		<ul>
			<li><a href="suscritos.jsp">Inicio</a></li>
		</ul>
	</nav>
	<div id="main">

		<form id="formNuevoEvento" action="nuevoEvento" method="post" novalidate="novalidate">
			<fieldset>
				<legend align="center">Nuevo evento</legend>
				<div id="caja1">
					<label id="lblNuevoEv" for="titulo">Título del evento</label>
					<input type="text" id="titulo" name="titulo" maxlength="30" required="required" value=""/>
					<span id="eTitulo" class="error">${errores.titulo}</span>

					<label id="descLbl" for="descripcion">Información adicional</label>
					<p id="counter" class="invisible">200</p>
					<textarea id="descripcion" name="descripcion" rows="8" cols="40"></textarea>
					<span id="eDesc" class="error">${errores.descripcion}</span>

					<label for="fecha">Fecha <span class="fecha">(dd-mm-aaaa)</span></label>
					<input type="text" id="fecha" name="fecha"/>
					<span id="eFecha" class="error">${errores.fecha_hora}</span>

					<label for="horaH">Hora <span class="hora">(hh:mm)</span></label>
					<div id="horas">
						<input type="number" id="horaH" min="0" max="23" value="0" /> Horas
						<input type="number" id="horaM" min="0" max="59" value="0" /> Minutos
						<span id="eHora" class="error"></span>
						<input type="hidden" id="hora" name="hora"/>
					</div>

					<label for="direccion">Dirección</label>
					<input type="text" id="direccion" name="direccion" value=""/>
					<span id="eDir" class="error">${errores.direccion}</span>

					<label for="localidad">Localidad</label>
					<input type="text" id="localidad" name="localidad" value=""/>
					<span id="eLocalidad" class="error">${errores.localidad}</span>

					<div class="oculto">
						<label for="lat">Latitud</label>
						<input type="hidden" id="lat" name="lat" value=""/>
						<span id="eLat" class="error">${errores.lat}</span>

						<label for="lng">Longitud</label>
						<input type="hidden" id="lng" name="lng" value=""/>
						<span id="eLng" class="error">${errores.lng}</span>
					</div>
				</div>
				<div id="caja2">
					<div id="mapa" class="googleMap"></div>
					<div id="buscarDirSus">
						<input type="text" id="buscarDireccion" placeholder="Buscar dirección"/>
						<button class="awesome" type="button" id="buscarDireccionBtn">Buscar dirección</button>
					</div>
					<div id="elegirIcono">
						<h3>Escoge un icono</h3>
						<table id="iconos">
							<tbody>
							<tr>
								<td><img src="icons/_0003_Home.png" alt="Home"></td>
								<td><img src="icons/_0046_User.png" alt="User"></td>
								<td><img src="icons/_0041_Medal-Gold.png" alt="Medal"></td>
								<td><img src="icons/_0037_Notepad.png" alt="Notepad"></td>
								<td><img src="icons/_0024_Bookmark.png" alt="Bookmark"></td>
								<td><img src="icons/_0042_Gift.png" alt="Gift"></td>
								<td><img src="icons/_0010_Alert.png" alt="Alert"></td>
								<td><img src="icons/_0029_Guitar.png" alt="Guitar"></td>
								<td><img src="icons/_0034_Mic.png" alt="Mic"></td>
								<td><img src="icons/_0004_Globe.png" alt="Globe"></td>
							</tr>
							</tbody>
						</table>
					</div>
					<input type="hidden" id="icono" name="icono" />
					<div id="submitBtn">
						<input type="submit" name="submit" value="Darse de alta" class="awesome"/>
					</div>
				</div>
			</fieldset>
		</form>

	</div>

	<footer class="small">
		<p>« Página escrita por Juan Luis Carratalá Castillo »</p>

<!--		<p>
			${errores.titulo}
			${errores.descripcion}
			${errores.fecha_hora}
			${errores.direccion}
			${errores.localidad}
			${errores.lat}
			${errores.lng}
		</p>
-->
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

