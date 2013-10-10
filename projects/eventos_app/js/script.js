var ns = ns || {};
//jQuery.noConflict();
ns.App = function() {
	/*
	 * variables privadas
	 */
	var _ajaxOkResponse = false;
	var _lat = 0, _lng = 0;
	var _map = null;
	var _myMarker = null;
	var _selectedIcon = null;
	var _infoWindow = null;

	/*
	 * función constructora/inicializadora que invoca los eventos y métodos
	 * dependiendo de la página visualizada
	 */
	var init = function() {
		if ( arguments.callee.done ) return;
		arguments.callee.done = true;
		if ( window.google ) {
			initGoogleMaps();
		}
		changeCssStyle();

		var formRegistro = document.getElementById( 'formRegistro' );
		if ( formRegistro ) {
			lib.Eventos.addEventHandler( formRegistro, lib.Eventos.eventActions.onsubmit, showErrorsFormRegistro );
			var login = document.getElementById( 'login' );
			if ( login ) {
				lib.Eventos.addEventHandler( login, lib.Eventos.eventActions.onkeyup, checkAvailableLogin );
			}
		}

		var formNuevoEvento = document.getElementById( 'formNuevoEvento' );
		if ( formNuevoEvento ) {
			lib.Eventos.addEventHandler( formNuevoEvento, lib.Eventos.eventActions.onsubmit,
					showErrorsFormNuevoEvento );
			var txtArea = document.getElementById( 'descripcion' );
			if ( txtArea ) {
				// Capturamos los eventos necesarios para hacer posible el contador estilo twitter
				lib.Eventos.addEventHandler( txtArea, lib.Eventos.eventActions.onfocus, makeCounterVisible );
				lib.Eventos.addEventHandler( txtArea, lib.Eventos.eventActions.onkeydown, characterCounter );
				lib.Eventos.addEventHandler( txtArea, lib.Eventos.eventActions.onfocus, characterCounter );
				lib.Eventos.addEventHandler( txtArea, lib.Eventos.eventActions.onkeyup, characterCounter );
				lib.Eventos.addEventHandler( txtArea, lib.Eventos.eventActions.onkeypress, limitCounter );
			}
			var btnBuscar = document.getElementById( 'buscarDireccionBtn' );
			if ( btnBuscar ) {
				lib.Eventos.addEventHandler( btnBuscar, lib.Eventos.eventActions.onclick, searchGooglePlace );
			}

			// widget para introducir la fecha de nuevos eventos
			Calendar.setup( {
				inputField: "fecha",
				ifFormat:   "%d-%m-%Y",
				weekNumbers: false
			} );

			// Capturamos el icono del marker seleccionado por el usuario en nuevo evento
			lib.DOM.$$( '#elegirIcono td' ).forEach( function( e ) {
				e.style.cursor = "pointer";
				lib.Eventos.addEventHandler( e, lib.Eventos.eventActions.onclick, function( mouseEvent ) {
					lib.DOM.$$( '#elegirIcono td' ).forEach( function( ee ) {
						ee.style.backgroundColor = "rgba( 255, 255, 255, 0.0 )";
					} );
					this.style.backgroundColor = "rgba( 255, 255, 255, 0.5 )";
					_selectedIcon = this.getElementsByTagName( 'img' )[0].src.split( '\/' )[5];
					lib.DOM.$( '#icono' ).value = _selectedIcon;
				} )
			} );
		}

		var formBusqueda = document.getElementById( 'formBusqueda' );
		if ( formBusqueda ) {
			lib.Eventos.addEventHandler( formBusqueda, lib.Eventos.eventActions.onsubmit, searchEvents );
		}

		var formBusquedaSus = document.getElementById( 'formBusquedaSus' );
		if ( formBusquedaSus ) {
			showSuscriptions();
			jQuery( '#abrirBusqueda' ).click( function( e ) {
				//jQuery( '#showBusqueda' ).slideDown( 'normal' );
				jQuery( '#showBusqueda' ).animate( {
					height: 'show',
					opacity: 'show'
				}, 1000, "easeOutSine" );

				jQuery( this ).hide();
				e.preventDefault();
			} );
			jQuery( '#formBusquedaSus' ).submit( function( e ) {
				searchSuscriptions();
				e.preventDefault();
			} );
		}
	};

	function enableSuscribe () {
		jQuery( "#resultados button" ).each( function( index, elem ) {
			var btn = jQuery( this );
			btn.click( function( e ) {
				if ( btn.data( 'suscrito' ) === 0 ) {
					jQuery.ajax( {
						url: urlAJAX.suscribir,
						dataType: 'text',
						data: {
							id: btn.data( 'idEvento' )
						},
						success: function( data ) {
							tooltip( btn, 'Te has suscrito al evento' );
							btn.removeClass( 'awesome' );
							btn.addClass( 'awesomeDisabled' );
							btn.text( 'Suscrito' );
							showSuscriptions();
						},
						error: function() {
							tooltip( btn, 'Algo salió mal...' );
						}
					} );
				}
			} );
		} );
	}

	function tooltip ( elem, text ) {
		var _left = elem.position().left + 80;
		var _top = elem.position().top;
		var tt = jQuery( '<span/>', {
			html: text,
			class: 'tooltip'
		} ).css( {
					top: _top,
					left: _left
				} ).appendTo( "#main" );
		setTimeout( function() {
			tt.slideUp( 'slow' );
		}, 3000 );
		setTimeout( function() {
			tt.remove();
		}, 4000 );
	}

	function tooltipComentario ( elem, text, bgComm, wrpComm ) {
		var _left = elem.position().left + 140;
		var _top = elem.position().top - 100;
		var tt = jQuery( '<span/>', {
			html: text,
			class: 'tooltipComentario'
		} ).css( {
					bottom: _top,
					left: _left
				} ).appendTo( wrpComm );
		setTimeout( function() {
			tt.hide( 'normal' );
		}, 3000 );
		setTimeout( function() {
			bgComm.remove();
			wrpComm.remove();
			$( "body" ).css( "overflow", "auto" );
			tt.remove();
			window.location = "suscritos.jsp";
		}, 3400 );
	}

	function searchSuscriptions () {
		var params = {};
		params['texto'] = jQuery( '#buscarEventosSus' ).val();
		if ( jQuery( '#useMax' ).is( ':checked' ) ) {
			params['lat'] = _lat;
			params['lng'] = _lng;
			params['dist'] = jQuery( '#distMax' ).val();
		}
		jQuery.getJSON( urlAJAX.buscarEventos, params, function( data ) {
			jQuery( '#resultados > table' ).remove();
			jQuery( '#resultados > h2' ).remove();
			jQuery( '<h2>', {
				html: 'Resultados'
			} ).appendTo( '#resultados' );
			jQuery( '<table>', {
				class: 'tableResults'
			} ).appendTo( '#resultados' );
			jQuery( '<thead>', {
				html: '<tr><th>Título</th><th>Fecha</th><th>Acción</th></tr>'
			} ).appendTo( '#resultados > table' );
			jQuery( '<tbody>' ).appendTo( '#resultados > table' );

			if ( data === null || data.length == 0 ) {
				jQuery( '#resultados tbody' ).append( '<tr><td>No hay resultados</td></tr>' );
			} else {
				jQuery.each( data, function( index, elem ) {
					if ( elem.suscrito == 0 && jQuery( '#modalidad2' ).is( ':checked' ) ) {
						var mom = new Date( elem.momento );
						jQuery( '#resultados tbody' ).append(
								'<tr><td>' + elem.titulo + '</td><td>' + mom.getDate() + '/' +
										new Number( mom.getMonth() + 1 ) + '/' + mom.getFullYear() + '</td>' +
										'<td></td></tr>' );
						jQuery( '<button/>', {
							class: "awesome",
							html: "Suscribirse"
						} ).data( {
									idEvento: elem.id,
									suscrito: elem.suscrito
								} ).appendTo( '#resultados tbody td:last' );
					} else if ( elem.suscrito == 1 ) {
						var mom = new Date( elem.momento );
						jQuery( '#resultados tbody' ).append(
								'<tr><td>' + elem.titulo + '</td><td>' + mom.getDate() + '/' +
										new Number( mom.getMonth() + 1 ) + '/' + mom.getFullYear() + '</td>' +
										'<td></td></tr>' );
						jQuery( '<button/>', {
							class: "awesomeDisabled",
							html: "Suscrito"
						} ).data( {
									idEvento: elem.id,
									suscrito: elem.suscrito
								} ).appendTo( '#resultados tbody td:last' );
					}
				} );
			}
			jQuery( '#resultados' ).slideDown( 'normal' );
			enableSuscribe();
		} );
	}

	var errorMessages = {
		campoVacio : 'El campo no puede estar vacío',
		longitudPassword : 'El password debe tener más de 6 caracteres',
		passwordIguales : 'Los dos password deben ser iguales',
		emailIncorrecto : 'El email debe tener un formato adecuado',
		formatoFechaIncorrecto : 'El formato de la fecha es incorrecto',
		formatoHoraIncorrecto : 'El formato de la hora es incorrecto',
		fechaNoValida : 'La fecha no es válida',
		fechaAnteriorALaActual: 'La fecha es anterior al día de hoy'
	};

	var urlAJAX = {
		loginDisponible : 'AJAX/usuarios/loginDisponible',
		eventosCercanos : 'AJAX/eventos/cercanos',
		eventos : 'AJAX/eventos',
		suscritos : 'AJAX/eventos/suscritos',
		buscarEventos : 'AJAX/eventos/buscar',
		suscribir : 'AJAX/eventos/suscribir',
		comentarios : 'AJAX/comentarios/ultimos',
		enviarComentario : 'AJAX/comentarios/enviar'
	};

	// mostramos el mensaje de error de un campo al usuario al enviar un formulario
	function setMessage ( divName, divNameMsg, msg, cssClassInput, cssClassMsg ) {
		var elem = document.getElementById( divNameMsg );
		elem.innerHTML = msg;
		document.getElementById( divName ).className = cssClassInput || '';
		document.getElementById( divNameMsg ).className = cssClassMsg || 'error';
	}

	// limpiamos el mensaje de error de un campo al usuario al enviar un formulario
	function clearMessage ( divName, divNameMsg ) {
		var elem = document.getElementById( divNameMsg );
		elem.innerHTML = '';
		document.getElementById( divName ).className = '';
	}

	// Cambiamos el estilo de la página al seleccionar un nuevo estilo
	function changeCssStyle () {
		var idCss = document.getElementById( 'cssSelected' );
		if ( idCss != null ) {
			lib.Eventos.addEventHandler( idCss, lib.Eventos.eventActions.onchange, function( e ) {
				var selected = lib.Eventos.event( e, false, false ).target.value;
				var stylesheet = document.getElementById( "css" );
				if ( selected == 1 ) {
					stylesheet.setAttribute( 'href', 'css/style.css' );
				} else if ( selected == 2 ) {
					stylesheet.setAttribute( 'href', 'css/alternative.css' );
				} else if ( selected == 3 ) {
					stylesheet.setAttribute( 'href', 'css/print.css' );
				}
			}, false );
		}
	}

	// tratamos los errores del formulario de nuevo usuario
	function showErrorsFormRegistro ( e ) {
		var okLogin = checkLoginFldRegistro();
		var okPw = checkPwFldRegistro();
		var okPw2 = checkPw2FldRegistro();
		var okNombre = checkNombreFldRegistro();
		var okApellidos = checkApellidosFldRegistro();
		var okEmail = checkEmailFldRegistro();

		if ( !okLogin || !okPw || !okPw2 || !okNombre || !okApellidos || !okEmail ) {
			// cancelamos el evento de submit, existen errores
			lib.Eventos.event( e, true, true );
			return false;
		} else {
			return true;
		}
	}

	function showErrorsFormNuevoEvento ( e ) {
		var okTitulo = checkTituloFldNuevoEvento();
		var okInfo = checkInformacionFldNuevoEvento();
		var okFecha = checkFechaFldNuevoEvento();
		//var okHora = checkHoraFldNuevoEvento();
		var okDir = checkDireccionFldNuevoEvento();
		var okLoc = checkLocalidadFldNuevoEvento();
		var okLat = checkLatitudFldNuevoEvento();
		var okLng = checkLongidtudFldNuevoEvento();
		setHourFld();

		if ( !okTitulo || !okInfo || !okFecha || !okDir || !okLoc || !okLat || !okLng ) {
			// cancelamos el evento de submit, existen errores
			lib.Eventos.event( e, true, true );
			return false;
		} else {
			return true;
		}
	}

	// formateamos e introducimos la hora en el campo 'hora'
	// de los campos de las horas y minutos
	function setHourFld () {
		var mins = parseInt( $( '#horaM' ).value );
		if ( mins < 10 ) {
			mins = '0';
		} else {
			mins = '';
		}
		mins += $( '#horaM' ).value;
		$( '#hora' ).value = $( '#horaH' ).value + ":" + mins;
	}

	// Comprobamos si el campo está vacío y esperamos a obtener una respuesta del servidor
	// para comprobar que el nombre de usuario está disponible
	function checkLoginFldRegistro () {
		return checkEmptyFld( 'login', 'eLogin' ) && _ajaxOkResponse;
	}

	function checkPwFldRegistro () {
		return checkEmptyFld( 'password', 'ePw' ) && checkLengthPwFldRegistro();
	}

	function checkPw2FldRegistro () {
		return checkEmptyFld( 'password2', 'ePw2' ) && checkRepeatedPwRegistro();
	}

	function checkNombreFldRegistro () {
		return checkEmptyFld( 'nombre', 'eNombre' );
	}

	function checkApellidosFldRegistro () {
		return checkEmptyFld( 'apellidos', 'eApellidos' );
	}

	function checkEmailFldRegistro () {
		return checkEmptyFld( 'email', 'eEmail' ) && checkEmail();
	}

	// Comprobamos si el campo está vacío
	function checkEmptyFld ( divName, divNameErr ) {
		var ok = true;
		var v = document.getElementById( divName ).value;
		if ( v !== null ) {
			v = v.trim();
			if ( v === "" /* && v.charAt( 0 ) === ' '*/ ) {
				setMessage( divName, divNameErr, errorMessages.campoVacio, 'invalid' );
				ok = false;
			} else {
				clearMessage( divName, divNameErr );
			}
		} else {
			ok = false;
		}
		return ok;
	}

	// Comprobamos la longitud del texto introducido
	function checkLengthPwFldRegistro () {
		var ok = true;
		var elem = document.getElementById( 'password' ).value;
		if ( elem.length < 7 ) {
			setMessage( 'password', 'ePw', errorMessages.longitudPassword, 'invalid' );
			ok = false;
		} else {
			clearMessage( 'password', 'ePw' );
		}
		return ok;
	}

	// Comprobamos si los campos son iguales
	function checkRepeatedPwRegistro () {
		var ok = true;
		var pw = document.getElementById( 'password' ).value;
		var pw2 = document.getElementById( 'password2' ).value;
		var ePw = document.getElementById( 'ePw2' );

		if ( pw !== pw2 ) {
			setMessage( 'password2', 'ePw2', errorMessages.passwordIguales, 'invalid' );
			ok = false;
		} else {
			clearMessage( 'password2', 'ePw2' );
		}
		return ok;
	}

	// Comprobamos si el email introducido es correcto
	function checkEmail () {
		var email = document.getElementById( 'email' ).value;
		var ok = /^[0-9a-zA-Z]+([._]?[0-9a-zA-Z])*@[0-9a-zA-Z]+([._-]?[0-9a-zA-Z])*[.]{1}[0-9a-zA-Z]{2,3}$/.test( email );
		if ( !ok ) {
			setMessage( 'email', 'eEmail', errorMessages.emailIncorrecto, 'invalid' );
		} else {
			clearMessage( 'email', 'eEmail' );
		}
		return ok;
	}

	// Comprobamos si el nombre de usuario está disponible en el servidor
	function checkAvailableLogin () {
		_ajaxOkResponse = false;
		var login = document.getElementById( 'login' ).value;
		if ( checkEmptyFld( 'login', 'eLogin' ) ) {
			// instanciamos el objeto ajax de nuestra clase, a la url indicada, indicando que es
			// una petición asíncrona, con el manejador correspondiente, y con el parámetro 'login'
			var ajax = new lib.Ajax();
			ajax.open( 'GET', urlAJAX.loginDisponible, true, function() {
				if ( this.readyState === 4 ) {
					if ( this.status === 200 ) {
						if ( this.responseText === 'OK' ) {
							_ajaxOkResponse = true;
							clearMessage( 'login', 'eLogin' );
							setMessage( 'login', 'eLogin', 'Nombre de usuario disponible', '', 'disponible' );
						} else {
							_ajaxOkResponse = false;
							clearMessage( 'login', 'eLogin' );
							setMessage( 'login', 'eLogin', 'Nombre de usuario no disponible', '', 'noDisponible' );
						}
					} else {
						throw ([ "Response error: ", this.status ]);
					}
				}
			}, { 'login' : login } );
		}
	}

	function checkTituloFldNuevoEvento () {
		return checkEmptyFld( 'titulo', 'eTitulo' );
	}

	function checkInformacionFldNuevoEvento () {
		return checkEmptyFld( 'descripcion', 'eDesc' );
	}

	function checkFechaFldNuevoEvento () {
		return checkEmptyFld( 'fecha', 'eFecha' ) && checkFecha();
	}

//	function checkHoraFldNuevoEvento () {
//		return checkEmptyFld( 'hora', 'eHora' ) && checkHora();
//	}

	function checkDireccionFldNuevoEvento () {
		return checkEmptyFld( 'direccion', 'eDir' );
	}

	function checkLocalidadFldNuevoEvento () {
		return checkEmptyFld( 'localidad', 'eLocalidad' );
	}

	function checkLatitudFldNuevoEvento () {
		return checkEmptyFld( 'lat', 'eLat' );
	}

	function checkLongidtudFldNuevoEvento () {
		return checkEmptyFld( 'lng', 'eLng' );
	}

	// comprobamos la validez de la fecha
	function checkFecha () {
		var fecha = document.getElementById( 'fecha' ).value;
		var ok = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-([0-9]{4})$/.test( fecha );
		var dia, mes, anyo;
		fecha = fecha.split( '-' );
		clearMessage( 'fecha', 'eFecha' );
		if ( ok && fecha.length == 3 ) {
			dia = parseInt( fecha[0] );
			mes = parseInt( fecha[1] );
			anyo = parseInt( fecha[2] );
			var date = new Date( anyo, mes - 1, dia );

			if ( dia != date.getDate() || mes - 1 != date.getMonth() || anyo != date.getFullYear() ) {
				setMessage( 'fecha', 'eFecha', errorMessages.fechaNoValida, 'invalid' );
				ok = false;
			}
			var actual = new Date();
			if ( ok && date < actual ) {
				setMessage( 'fecha', 'eFecha', errorMessages.fechaAnteriorALaActual, 'invalid' );
				ok = false;
			}
		} else {
			setMessage( 'fecha', 'eFecha', errorMessages.formatoFechaIncorrecto, 'invalid' );
			ok = false;
		}
		if ( ok ) {
			clearMessage( 'fecha', 'eFecha' );
		}
		return ok;
	}

	// comprobamos la validez de la hora
	function checkHora () {
		var hora = document.getElementById( 'hora' ).value;
		var ok = /^(0?[0-9]|[1][0-9]|2[0-3]):([0-9]{2})$/.test( hora );
		if ( !ok ) {
			setMessage( 'hora', 'eHora', errorMessages.formatoHoraIncorrecto, 'invalid' );
		} else {
			clearMessage( 'hora', 'eHora' );
		}
		return ok;
	}

	// hacemos el contador de carácteres visible de la caja de texto estilo 'twitter'
	function makeCounterVisible () {
		var counter = document.getElementById( 'counter' );
		counter.className = 'visible';
	}

	// actualizamos el contador de carácteres
	function characterCounter () {
		var limit = 200;
		var counter = document.getElementById( 'counter' );
		var txtArea = document.getElementById( 'descripcion' );
		if ( txtArea.value.length < limit ) {
			counter.innerHTML = limit - txtArea.value.length;
		} else {
			counter.innerHTML = 0;
		}
	}

	// inhabilitamos la opción de introducir texto cuando se ha rebasado el límite
	function limitCounter ( e ) {
		var limit = 200;
		var txtArea = document.getElementById( 'descripcion' );
		var key = lib.Eventos.event( e, false, false ).keyCode;

		// Permitir utilizar las teclas con flecha horizontal
		if ( key == 37 || key == 39 ) {
			return true;
		}
		// Permitir borrar con la tecla Backspace y con la tecla Supr.
		if ( key == 8 || key == 46 ) {
			return true;
		} else if ( txtArea.value.length >= limit ) {
			lib.Eventos.event( e, true, true );
			return false;
		} else {
			return true;
		}
	}

	// creamos el mapa de google maps, obtenemos nuestra posición por geolocalización e introducimos
	// nuestro marker en el mapa
	function initGoogleMaps () {
		var myOptions = {
			zoom: 7,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		_map = new google.maps.Map( document.getElementById( "mapa" ), myOptions );
		if ( _map ) {
			navigator.geolocation.getCurrentPosition( function( e ) {
				// Obtener posicion
				_lat = e.coords.latitude;
				_lng = e.coords.longitude;
				var latLng = new google.maps.LatLng( _lat, _lng ); //.accuracy
				_map.setCenter( latLng );
				var image = 'icons/_0014_Pin.png';
				_myMarker = new google.maps.Marker( {
					position: latLng,
					map: _map,
					icon: image,
					title: 'Usted está aquí'
				} );
				var formNuevoEvento = document.getElementById( 'formNuevoEvento' );
				// obtenemos las coordenadas cuando el usuario arrastre el marker en el formulario
				// de nuevo evento
				if ( formNuevoEvento ) {
					_myMarker.setDraggable( true );
					google.maps.event.addListener( _myMarker, 'dragend', function( e ) {
						$( '#lat' ).value = _lat = _myMarker.getPosition().lat();
						$( '#lng' ).value = _lng = _myMarker.getPosition().lng();
					} );
				}
			}, function( e ) {
				// Comprobar si hay error
				alert( "Error de geolocalización: " + e.code );
			}, { enableHighAccuracy: true } )
		}
	}

	// comprobamos si el número introducido es positivo
	function isPositiveNumber ( divName, divNameErr ) {
		var distMax = document.getElementById( 'buscarEventos' ).value;
		var ok = /^[0-9]+$/.test( distMax );
		if ( ok ) {
			clearMessage( 'buscarEventos', 'eDist' );
		} else {
			setMessage( 'buscarEventos', 'eDist', 'La distancia debe ser un número positivo' );
		}
		return ok;
	}

	function createComment ( comment, nameDivContent ) {
		return '<div class="' + nameDivContent + '"><img class="imgPost" src="perfiles/' + comment.login +
				'.jpg" alt="Imagen de usuario"></div>' +
				'<ul><li><b>Usuario:</b> ' + comment.login + '</li>' +
				'<li><b>Fecha: </b>' +
				(new Date( comment.fecha )).toLocaleDateString() +
				' ' + (new Date( comment.fecha )).toLocaleTimeString() + '</li>' +
				'<li><b>Mensaje: </b>' + comment.texto + '</li></ul>'
	}

	// creamos dinámicamente los markers de los eventos suscritos y sus botones asociados
	function makeButtonsAndMarkers ( response, isSuscription ) {
		var lista = document.getElementById( 'eventos' );
		lib.DOM.removeChildren( lista );

		// cerramos el tooltip del marker al hacer click en otro lado del mapa
		google.maps.event.addListener( _map, 'click', function() {
			if ( _infoWindow != null ) {
				_infoWindow.close();
			}
		} );

		// recorremos todos los eventos
		for ( var i = 0, l = response.length; i < l; i++ ) {
			// añadimos el nuevo marker al mapa
			var latLng = new google.maps.LatLng( response[i].lat, response[i].lng );
			var marker = new google.maps.Marker( {
				position: latLng,
				map: _map,
				title: response[i].titulo
			} );
			// le ponemos el icono personalizado (si tiene)
			if ( response[i].icono ) {
				marker.setIcon( "icons/" + response[i].icono );
			}
			// creamos el tooltip del marker
			google.maps.event.addListener( marker, 'click', function( indexEvent, m ) {
				return function() {
					var date = new Date( response[indexEvent].momento );
					var minutes = "";
					if ( date.getMinutes() < 10 ) {
						minutes = '0';
					}
					minutes += date.getMinutes();
					var contentString = '<div class="reset"><ul><li><b>Evento: </b>' +
							response[indexEvent].titulo + '</li><li><b>Fecha: </b>' +
							date.toDateString() + '</li><li><b>Hora: </b>' +
							date.getHours() + ':' + minutes +
							'</li></ul></div>';
					// cerramos el anterior tooltip al abrir uno nuevo
					if ( _infoWindow != null ) {
						_infoWindow.close();
					}
					_infoWindow = new google.maps.InfoWindow( {
						content: contentString
					} );
					_infoWindow.open( _map, m );
				}
			}( i, marker ) );

			// creamos los eventos de 'ver en mapa' y 'detalles'
			var dt = document.createElement( 'dt' );
			var dd1 = document.createElement( 'dd' );
			var dd2 = document.createElement( 'dd' );
			var dd3 = document.createElement( 'dd' );
			var btn1 = document.createElement( 'button' );
			var btn2 = document.createElement( 'button' );
			var btn3 = document.createElement( 'button' );

			btn1.innerHTML = 'Ver en mapa';
			btn1.className = 'awesome';
			btn1.name = 'btnMap';
			btn1.type = 'button';
			dd1.className = 'indent';
			dd1.appendChild( btn1 );

			btn2.innerHTML = 'Ver detalles';
			btn2.className = 'awesome';
			btn2.name = 'btnDet';
			btn2.type = 'button';
			dd2.appendChild( btn2 );

			btn3.innerHTML = 'Ver comentarios';
			btn3.className = 'awesome';
			btn3.name = 'btnCom';
			btn3.type = 'button';
			if ( isSuscription ) {
				dd3.appendChild( btn3 );
			}

			var div = document.createElement( 'div' );
			div.id = 'info-' + i;

			dt.innerHTML = response[i].titulo;
			lista.appendChild( dt );
			lista.appendChild( dd1 );
			lista.appendChild( dd2 );
			lista.appendChild( dd3 );
			lista.appendChild( div );

			jQuery( btn3 ).click( function( index ) {
				return function( e ) {
					comments( response, index );
				};
			}( i ) );

			// centramos el mapa al hacer click en el botón 'ver mapa'
			lib.Eventos.addEventHandler(
					btn1, lib.Eventos.eventActions.onclick, function( indexEvent ) {
						return function() {
							var latLng = new google.maps.LatLng(
									response[indexEvent].lat, response[indexEvent].lng );
							_map.setCenter( latLng );
						}
					}( i ) );

			// mostramos la información asociada al hacer click en el botón 'detalles'
			lib.Eventos.addEventHandler( btn2, lib.Eventos.eventActions.onclick, function( indexEvent ) {
				return function() {
					for ( var i = 0, l = response.length; i < l; i++ ) {
						var d = document.getElementById( 'info-' + i );
						if ( d ) {
							lib.DOM.removeChildren( d );
						}
					}

					var id = response[indexEvent].id;
					var ajax = new lib.Ajax();
					ajax.open( 'GET', urlAJAX.eventos, true, function() {
						if ( this.readyState === 4 ) {
							if ( this.status === 200 ) {
								var parseFn = JSON.parse || eval;
								var response = parseFn( this.responseText );
								var div = document.getElementById( 'info-' + indexEvent );
								var table = document.createElement( 'table' );
								table.className = 'mytable';
								var thead = document.createElement( 'thead' );
								var tbody = document.createElement( 'tbody' );
								var tr1 = document.createElement( 'tr' );
								var tr2 = document.createElement( 'tr' );

								var th1 = document.createElement( 'th' );
								th1.appendChild( document.createTextNode( 'Descripción' ) );
								var th2 = document.createElement( 'th' );
								th2.appendChild( document.createTextNode( 'Dirección' ) );
								var th3 = document.createElement( 'th' );
								th3.appendChild( document.createTextNode( 'Localidad' ) );
								var th4 = document.createElement( 'th' );
								th4.appendChild( document.createTextNode( 'Usuario' ) );
								var th5 = document.createElement( 'th' );
								th5.appendChild( document.createTextNode( 'Fecha' ) );

								tr1.appendChild( th1 );
								tr1.appendChild( th2 );
								tr1.appendChild( th3 );
								tr1.appendChild( th4 );
								tr1.appendChild( th5 );

								var td1 = document.createElement( 'td' );
								var desc = new String( response.descripcion );
								desc = desc.split( '\n' );
								for ( var i = 0, l = desc.length; i < l; i++ ) {
									var p = document.createElement( 'p' );
									p.appendChild( document.createTextNode( desc[i] ) );
									td1.appendChild( p );
								}
								var td2 = document.createElement( 'td' );
								td2.appendChild( document.createTextNode( response.direccion ) );
								var td3 = document.createElement( 'td' );
								td3.appendChild( document.createTextNode( response.localidad ) );
								var td4 = document.createElement( 'td' );
								td4.appendChild( document.createTextNode( response.login ) );
								var td5 = document.createElement( 'td' );
								var mom = new Date( response.momento );

								var pDate1 = document.createElement( 'p' );
								var pDate2 = document.createElement( 'p' );

								pDate1.appendChild( document.createTextNode(
										mom.getDate() + '/' + new Number( mom.getMonth() + 1 ) +
												'/' + mom.getFullYear() ) );

								var minutes = "";
								if ( mom.getMinutes() < 10 ) {
									minutes = '0';
								}
								minutes += mom.getMinutes();

								pDate2.appendChild( document.createTextNode(
										mom.getHours() + ':' + minutes ) );
								td5.appendChild( pDate1 );
								td5.appendChild( pDate2 );

								tr2.appendChild( td1 );
								tr2.appendChild( td2 );
								tr2.appendChild( td3 );
								tr2.appendChild( td4 );
								tr2.appendChild( td5 );

								thead.appendChild( tr1 );
								tbody.appendChild( tr2 );
								table.appendChild( thead );
								table.appendChild( tbody );

								div.appendChild( table );

							} else {
								throw ([ "Response error: ", this.status ]);
							}
						}
					}, { 'id' : id } );
				}
			}( i ) );
		}
	}

	function comments ( response, index ) {
		var idEvento = response[index].id;
		jQuery.getJSON( urlAJAX.comentarios, {
			"idEvento" : idEvento
		}, function( data ) {
			if ( data.lista === undefined ) {
				var contenedor = jQuery( '#info-' + index );
				contenedor.empty();
				contenedor.css( 'display', 'none' );
				var post = jQuery( '<div/>', {
					class: 'post'
				} ).appendTo( contenedor );
				jQuery( '<div/>', {
					class: 'postEmpty',
					html: 'No hay comentarios'
				} ).appendTo( post );
				contenedor.slideDown( 1200 );
				var btnEnviarComentario = jQuery( '<button/>', {
					class: 'awesomeECEmpty',
					html: 'Crear nuevo hilo'
				} ).click(
						function( e ) {
							btnEnviarComentario.hide();
							var taNuevoHilo = jQuery( '<textarea/>', {
								class: 'nuevoHilo'
							} ).appendTo( divTa );
							var btnEnviarNuevoHilo = jQuery( '<button/>', {
								class: 'awesome',
								html: 'Enviar comentario'
							} ).click(
									function( e ) {

										jQuery.ajax( {
											type: "POST",
											url: urlAJAX.enviarComentario,
											dataType: 'text',
											data: {
												"texto": taNuevoHilo.val(),
												"idHilo": 0,
												"idEvento": idEvento
											},
											success: function( data ) {
												var _left = btnEnviarNuevoHilo.position().left + 180;
												var _top = btnEnviarNuevoHilo.position().top;
												var tt = jQuery( '<span/>', {
													html: 'Comentario enviado',
													class: 'tooltip'
												} ).css( {
															top: _top,
															left: _left
														} ).appendTo( "#main" );
												setTimeout( function() {
													tt.slideUp( 'slow' );
												}, 3000 );
												setTimeout( function() {
													tt.remove();
													window.location = 'suscritos.jsp';
												}, 4000 );
											},
											error: function() {
												var _left = btnEnviarNuevoHilo.position().left + 180;
												var _top = btnEnviarNuevoHilo.position().top;
												var tt = jQuery( '<span/>', {
													html: 'Error al enviar el comentario',
													class: 'tooltip'
												} ).css( {
															top: _top,
															left: _left
														} ).appendTo( "#main" );
												setTimeout( function() {
													tt.slideUp( 'slow' );
												}, 3000 );
											}
										} );


									} ).appendTo( divTa );
							taNuevoHilo.slideDown( 'normal' );
						} ).appendTo( contenedor );
				var divTa = jQuery( '<div/>' ).appendTo( contenedor );
			}
			jQuery.each( data, function( key, value ) {
				// key: idEvento, lista
				if ( key === 'lista' ) {
					var contenedor = jQuery( '#info-' + index );
					contenedor.empty();
					contenedor.css( 'display', 'none' );
					for ( var hilo in value ) {
						var idHilo = value[hilo].idHilo;
						var comentarios = value[hilo].comentarios;
						var respuestas = [];
						for ( var i = 1, l = comentarios.length; i < l; i++ ) {
							respuestas.push( createComment( comentarios[i], 'divImgPostB' ) );
						}
						if ( respuestas.length == 0 ) {
							respuestas.push( 'No hay respuestas' );
						}
						var post = jQuery( '<div/>', {
							class: 'post'
						} ).appendTo( contenedor );

						var autor = comentarios[0];
						jQuery( '<div/>', {
							class: 'postHead',
							html: createComment( autor, 'divImgPostH' )
						} ).appendTo( post );
						for ( var r in respuestas ) {
							jQuery( '<div/>', {
								class: 'postBody',
								html: respuestas[r]
							} ).appendTo( post );
						}
						var btnResponder = jQuery( '<button/>', {
							class: 'awesome',
							html: 'Responder'
						} ).css( {
									marginBottom: "20px",
									marginTop: "-10px"
								} ).click(
								function( idHilo ) {
									return function( e ) {
										var x = jQuery( window ).scrollTop() + 150;
										var y = (jQuery( document.body ).width() / 2) - 250;
										//jQuery( this ).hide();
										var bgComm = jQuery( '<div/>', {
											class: 'responderBg'
										} ).appendTo( document.body );
										var wrpComm = jQuery( '<div/>', {
											class: 'responderWrp'
										} ).css( {
													left: y, top: x
												} ).appendTo( document.body );
										var ta = jQuery( '<textarea/>', {
											class: 'responderTa'
										} ).appendTo( wrpComm );

										var btnNuevoComentario = jQuery( '<button/>', {
											class: 'awesome',
											html: 'Enviar comentario'
										} ).css( {
													position: 'relative',
													left: 10,
													bottom: 90,
													fontSize: "1.4em"
												} ).click(
												function( e ) {
													jQuery.ajax( {
														type: "POST",
														url: urlAJAX.enviarComentario,
														dataType: 'text',
														data: {
															"texto": ta.val(),
															"idHilo": idHilo,
															"idEvento": idEvento
														},
														success: function( data ) {
															tooltipComentario( btnNuevoComentario,
																	'Tu comentario ha sido enviado',
																	bgComm, wrpComm );
														},
														error: function() {
															tooltipComentario( btnNuevoComentario,
																	'Ocurrió un error al enviar el comentario',
																	bgComm, wrpComm );
														}
													} );
												} ).appendTo( wrpComm );
										var btnCancelarComentario = jQuery( '<button/>', {
											class: 'awesome',
											html: 'Cancelar'
										} ).css( {
													position: 'relative',
													left: 20,
													bottom: 90,
													fontSize: "1.4em"
												} ).click(
												function( e ) {
													console.log( 'click' );
													bgComm.remove();
													wrpComm.remove();
													$( "body" ).css( "overflow", "auto" );
												} ).appendTo( wrpComm );
										$( "body" ).css( "overflow", "hidden" );
									}
								}( idHilo ) ).appendTo( contenedor );
					}
					contenedor.slideDown( 1200 );
					var btnNuevoHilo = jQuery( '<button/>', {
						class: 'awesomeEC',
						html: 'Crear nuevo hilo'
					} ).click(
							function( e ) {
								btnNuevoHilo.hide();
								var taNuevoHilo = jQuery( '<textarea/>', {
									class: 'nuevoHilo'
								} ).appendTo( divTa );
								var btnEnviarNuevoHilo = jQuery( '<button/>', {
									class: 'awesome',
									html: 'Enviar comentario'
								} ).click(
										function( e ) {
											jQuery.ajax( {
												type: "POST",
												url: urlAJAX.enviarComentario,
												dataType: 'text',
												data: {
													"texto": taNuevoHilo.val(),
													"idHilo": 0,
													"idEvento": idEvento
												},
												success: function( data ) {
													var _left = btnEnviarNuevoHilo.position().left + 180;
													var _top = btnEnviarNuevoHilo.position().top;
													var tt = jQuery( '<span/>', {
														html: 'Comentario enviado',
														class: 'tooltip'
													} ).css( {
																top: _top,
																left: _left
															} ).appendTo( "#main" );
													setTimeout( function() {
														tt.slideUp( 'slow' );
													}, 3000 );
													setTimeout( function() {
														tt.remove();
														window.location = 'suscritos.jsp';
													}, 4000 );
												},
												error: function() {
													var _left = btnEnviarNuevoHilo.position().left + 180;
													var _top = btnEnviarNuevoHilo.position().top;
													var tt = jQuery( '<span/>', {
														html: 'Error al enviar el comentario',
														class: 'tooltip'
													} ).css( {
																top: _top,
																left: _left
															} ).appendTo( "#main" );
													setTimeout( function() {
														tt.slideUp( 'slow' );
													}, 3000 );
												}
											} );
										} ).appendTo( divTa );
								taNuevoHilo.slideDown( 'normal' );
							} ).appendTo( contenedor );
					var divTa = jQuery( '<div/>' ).appendTo( contenedor );
				}
			} );
		} );
	}

	// Busca los eventos cercanos
	function searchEvents ( e ) {
		lib.Eventos.event( e, true, true );
		var distMax = document.getElementById( 'buscarEventos' ).value;

		if ( checkEmptyFld( 'buscarEventos', 'eDist' ) && isPositiveNumber( 'buscarEventos', 'eDist' ) ) {
			var ajax = new lib.Ajax();
			ajax.open( 'GET', urlAJAX.eventosCercanos, true, function() {
				if ( this.readyState === 4 ) {
					if ( this.status === 200 ) {
						var parseFn = JSON.parse || eval;
						var response = parseFn( this.responseText );

						document.getElementById( 'resultados' ).className = 'nooculto';
						makeButtonsAndMarkers( response, false );

					} else {
						throw ([ "Response error: ", this.status ]);
					}
				}
			}, { 'lat' : _lat, 'lng' : _lng, 'dist' : distMax } );
		}
	}

	function showSuscriptions () {
		var ajax = new lib.Ajax();
		ajax.open( 'GET', urlAJAX.suscritos, true, function() {
			if ( this.readyState === 4 ) {
				if ( this.status === 200 ) {
					var parseFn = JSON.parse || eval;
					var response = parseFn( this.responseText );
					makeButtonsAndMarkers( response, true );
				} else {
					throw ([ "Response error: ", this.status ]);
				}
			}
		} );
	}

	// Buscamos las coordenadas de un lugar con geocoder
	function searchGooglePlace () {
		var geocoder = new google.maps.Geocoder();
		var address = document.getElementById( 'buscarDireccion' ).value;
		if ( geocoder ) {
			geocoder.geocode( { 'address': address }, function( results, status ) {
				if ( status == google.maps.GeocoderStatus.OK ) {
					_map.setCenter( results[0].geometry.location );
					_myMarker.setMap( _map );
					_myMarker.setPosition( results[0].geometry.location );

					$( '#lat' ).value = _lat = results[0].geometry.location.lat();
					$( '#lng' ).value = _lng = results[0].geometry.location.lng();
				} else {
					alert( "No fue posible encontrar la ubicación: " + status );
				}
			} );
		}
	}

	this.load = function() {
		lib.DOM.addDOMContentLoadedHandler( init );
	};
};

var fv = new ns.App();
fv.load();
