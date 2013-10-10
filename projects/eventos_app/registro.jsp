<%@page contentType="text/html" pageEncoding="utf-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Prácticas de TW 2011-12 - Registro</title>
	<meta name="description" content="Prácticas de Programación en Internet" lang="ES"/>
	<meta name="author" content="Juan Luis Carratal&aacute;"/>
	<meta name="keywords" content="pi, universidad, alicante, programacion, internet"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>

	<link rel="stylesheet" type="text/css" href="css/style.css" media="screen" id="css"/>
	<link rel="stylesheet" type="text/css" href="css/print.css" media="print"/>
	<link rel="alternate stylesheet" title="Estilo alternativo" type="text/css" href="css/alternative.css"
	      media="screen"/>
	<script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>
<body>
<div id="container">
	<header id="header">
		<h1><span class="title2">Tecnologías Web</span> <span class="title1">2011-12</span></h1>
	</header>
	<nav>
		<ul>
			<li><a href="index.jsp">Inicio</a></li>
		</ul>
	</nav>
	<div id="main">
		<form id="formRegistro" action="registro" method="post" novalidate="novalidate"
		      enctype="multipart/form-data">
			<fieldset>
				<legend align="center">Registro</legend>
				<div id="caja1">
					<label for="login">Usuario</label>
					<input type="text" id="login" name="login" maxlength="30" placeholder="Nick nuevo usuario"
					       required="required" value="${usuario.login}"/>
					<span id="eLogin" class="error">${errores.login}</span>

					<label for="password">Contraseña</label>
					<input type="password" id="password" name="password" maxlength="30"
					       placeholder="Password nuevo usuario"
					       required="required" value="${usuario.password}"/>
					<span id="ePw" class="error">${errores.password}</span>

					<label id="lblPw2" for="password2">Repita la contraseña</label>
					<input type="password" id="password2" name="password2" maxlength="30"
					       placeholder="Repita el password"
					       required="required" value=""/>
					<span id="ePw2" class="error">${errores.login}</span>

					<label for="nombre">Nombre</label>
					<input type="text" id="nombre" name="nombre" maxlength="30" placeholder="Escriba su nombre"
					       required="required" value="${usuario.nombre}"/>
					<span id="eNombre" class="error">${errores.nombre}</span>
				</div>
				<div id="caja2">
					<label for="apellidos">Apellidos</label>
					<input type="text" id="apellidos" name="apellidos" maxlength="30"
					       placeholder="Escriba sus apellidos"
					       required="required" value="${usuario.apellidos}"/>
					<span id="eApellidos" class="error">${errores.apellidos}</span>

					<label for="email">E-mail</label>
					<input type="email" id="email" name="email" maxlength="30"
					       placeholder="Escriba su correo electrónico"
					       required="required" value="${usuario.email}"/>
					<span id="eEmail" class="error">${errores.email}</span>

					<label for="imagen">Imagen de usuario</label>
					<input type="file" id="imagen" name="imagen" />

					<div id="submitBtn">
						<input type="submit" name="submit" value="Darse de alta" class="awesome"/>
					</div>
				</div>
			</fieldset>
		</form>
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

