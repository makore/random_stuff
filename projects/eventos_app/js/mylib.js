var lib = window.lib || {};
lib.Ejemplos = window.lib.Ejemplos || {};

/*
 * Utilidades para los objetos nativos
 */
lib.Util = function() {
	if ( typeof String.prototype.replaceAt !== 'function' ) {
		// añade a todos las variables de tipo String el método 'replaceAt'
		String.prototype.replaceAt = function ( index, character ) {
			return this.substr( 0, index ) + character + this.substr( index + character.length );
		};
	}
	if ( typeof String.prototype.replaceAll !== 'function' ) {
		String.prototype.replaceAll = function( character1, character2 ) {
			var text = this.toString();
			while ( text.indexOf( character1 ) != -1 ) {
				text = text.replace( character1, character2 );
			}
			return text;
		};
	}
//	if ( typeof Object.prototype.toType !== 'function' ) {
//		Object.prototype.toType = function() {
//			return ({}).toString.call( this ).match( /\s([a-z|A-Z]+)/ )[1].toLowerCase();
//		};
//	}
}();

/*
 * Clase para instanciar peticiones AJAX
 */
lib.Ajax = function() {
	var request = null;

	// Instanciar el objeto que conecta con el servidor
	var init = function() {
		try {
			request = new XMLHttpRequest();
		} catch( e ) {
			try {
				request = new ActiveXObject( "Msxml2.XMLHTTP" );
			} catch( e ) {
				try {
					request = new ActiveXObject( "Microsoft.XMLHTTP" );
				} catch( e ) {
					console.log( "A newer browser is needed." );
				}
			}
		}
	};

	this.open = function( method /*GET|POST|HEAD*/, url, isAsync, callback, params /*num1=2&num2=2*/ ) {
		init();
		params = params || null;
		// incluimos los parametros a la url
		if ( params != null ) {
			url += '?';
			for ( var key in params ) {
				url += key + '=' + params[key] + '&';
			}
			// url += 'nocache=' + Math.random();
		}
		// realizamos la petición
		request.open( method, url, isAsync );
		//request.open( method, encodeURIComponent(url) + "&nocache=" + Math.random(), isAsync );

		if ( method === 'POST' ) {
			request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
			request.send( encodeURIComponent( params ) );
		} else {
			request.send( null );
		}
		if ( isAsync ) {
			if ( callback && typeof callback === 'function' ) {
				request.onreadystatechange = callback;
			} else {
				request.onreadystatechange = function() {
					if ( request.readyState === 4 ) {
						// el servidor dice OK
						if ( request.status === 200 ) {
							// procesamos la petición
							var parseFn = JSON.parse || eval;
							var response = parseFn( "(" + request.responseText + ")" );
							//console.log(request.getAllResponseHeaders());
							//console.log(request.responseXML);
							return response;
						} else {
							// console.log(request.statusText);
							throw ([ "Response error: ", request.status ]);
						}
					}
				}
			}
		} else {
			return request;
		}
	};

};

/*
 * Libería que encapsula algunas utilidades con eventos
 */
lib.Eventos = {
	// suscribirse a un evento cross-browser
	addEventHandler : function( elem, eventType, handler ) {
		if ( elem.addEventListener ) {
			elem.addEventListener( eventType, handler, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( 'on' + eventType, handler );
		} else {
			elem['on' + eventType] = handler;
		}
	},

	// desuscribirse a un evento cross-browser
	removeEventHandler : function( elem, eventType, handler ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( eventType, handler, false );
		} else if ( elem.detachEvent ) {
			elem.detachEvent( 'on' + eventType, handler );
		} else {
			elem['on' + eventType] = null;
		}
	},

	// suscribirse a los eventos de un conjunto de elementos del mismo tipo
	addEventHandlerToNodeList : function( elem, eventType, handler ) {
		var i, len;
		if ( document.addEventListener ) {
			if ( (elem && !(elem instanceof Array) && !elem.length && !lib.DOM.isNodeList( elem )) ||
					elem === window ) {
				elem.addEventListener( eventType, handler, false );
			} else if ( elem && typeof elem[0] !== 'undefined' ) {
				for ( i = 0,len = elem.length; i < len; i++ ) {
					lib.Eventos.addEventHandlerToNodeList( elem[i], eventType, handler );
				}
			}
		} else if ( document.attachEvent ) {
			if ( (elem && !(elem instanceof Array) && !elem.length && !lib.DOM.isNodeList( elem )) ||
					elem === window ) {
				elem.attachEvent( 'on' + eventType, function() {
					return handler.call( elem, window.event );
				} );
			} else if ( elem && typeof elem[0] !== 'undefined' ) {
				for ( i = 0,len = elem.length; i < len; i++ ) {
					lib.Eventos.addEventHandlerToNodeList( elem[i], eventType, handler );
				}
			}
		}
	},

	// desuscribirse a los eventos de un conjunto de elementos del mismo tipo
	removeEventHandlerToNodeList : function( elem, eventType, handler ) {
		var i, len;
		if ( elem.removeEventListener ) {
			if ( (elem && !(elem instanceof Array) && !elem.length && !lib.DOM.isNodeList( elem )) ||
					elem === window ) {
				elem.removeEventListener( eventType, handler, false );
			} else if ( elem && typeof elem[0] !== 'undefined' ) {
				for ( i = 0,len = elem.length; i < len; i++ ) {
					lib.Eventos.removeEventHandlerToNodeList( elem[i], eventType, handler );
				}
			}
		} else if ( elem.detachEvent() ) {
			if ( (elem && !(elem instanceof Array) && !elem.length && !lib.DOM.isNodeList( elem )) ||
					elem === window ) {
				elem.detachEvent( 'on' + eventType, function() {
					return handler.call( elem, window.event );
				} );
			} else if ( elem && typeof elem[0] !== 'undefined' ) {
				for ( i = 0,len = elem.length; i < len; i++ ) {
					lib.Eventos.removeEventHandlerToNodeList( elem[i], eventType, handler );
				}
			}
		}
	},

	// modificamos el comportamiento por defecto del navegador al enviar formularios a servidor
	event : function( event, preventDefault, stopPropagation ) {
		var e, target, keyCode;
		if ( window.event ) { // para internet explorer
			e = window.event;
			target = e.srcElement;
			keyCode = e.keyCode;
			if ( preventDefault ) {
				e.returnValue = false;
				// a false evita el comportamiento por defecto al
				// llamar al evento por el navegador
			}
			if ( stopPropagation ) {
				e.cancelBubble = true;
				// a true evita que el evento sea manejado
				// por iguales manejadores de niveles superiores
			}
		} else if ( event ) {
			e = event;
			target = e.target;
			// lo mismo para el resto de navegadores
			keyCode = e.which;
			if ( preventDefault ) {
				e.preventDefault();
			}
			if ( stopPropagation ) {
				e.stopPropagation();
			}
		}
		var parent;
		if ( target.nodeType == 3 ) {
			target = target.parentNode;
		}
		return ({
			'event' : e, /* instancia del evento */
			'keyCode' : keyCode, /* tecla pulsada al capturar el evento (si la hubiera) */
			'type' : e.type, /* tipo de evento */
			'target' : target, /* objeto del documento contenedor del evento */
			'parent' : parent /* objeto padre del objeto del documento contenedor del evento */
		});
	},

	eventActions : {
		'onblur' : 'blur',				/* An element loses focus */
		'onchange' : 'change',			/* The content of a field changes */
		'onclick' : 'click',			/* Mouse clicks an object */
		'ondblclick' : 'dblclick',		/* Mouse double-clicks an object */
		'onerror' : 'error',			/* An error occurs when loading a document or an image */
		'onfocus' : 'focus',			/* An element gets focus */
		'onkeydown' : 'keydown',		/* A keyboard key is pressed */
		'onkeypress' : 'keypress',		/* A keyboard key is pressed or held down */
		'onkeyup' : 'keyup',			/* A keyboard key is released */
		'onload' : 'load',				/* A page or image is finished loading */
		'onmousedown' :	'mousedown',	/* A mouse button is pressed */
		'onmousemove' :	'mousemove',	/* The mouse is moved */
		'onmouseout' : 'mouseout',		/* The mouse is moved off an element */
		'onmouseover' :	'mouseover',	/* The mouse is moved over an element */
		'onmouseup' : 'mouseup',		/* A mouse button is released */
		'onreset' : 'reset',			/* The user reset the object, usually a form. */
		'onresize' : 'resize',			/* A window or frame is resized */
		'onselect' : 'select',			/* Text is selected */
		'onsubmit' : 'submit',			/* The user submitted an object, usually a form. */
		'onunload' :'unload'			/* The user exits the page */
	}
};

lib.DOM = {
	/*
	 * Obtiene la posición del ratón relativa al documento
	 */
	getMousePosition : function( event ) {
		var posx = 0;
		var posy = 0;
		if ( !event ) event = window.event;
		if ( event.pageX || event.pageY ) {
			posx = event.pageX;
			posy = event.pageY;
		}
		else if ( event.clientX || event.clientY ) {
			posx = event.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
			posy = event.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
		}
		return ({
			'posX' : posx,
			'posY' : posy
		});
	},

	/*
	 * Escuchador cross-browser que nos dice cuando el documento DOM se ha terminado de cargar
	 * en el navegador del usuario.
	 */
	addDOMContentLoadedHandler : function( initFn ) {
		(function( i ) {
			var u = navigator.userAgent;
			var e = /*@cc_on!@*/false;
			if ( /webkit/i.test( u ) ) {
				setTimeout( function() {
					var dr = document.readyState;
					if ( dr == "loaded" || dr == "complete" ) {
						i()
					} else {
						setTimeout( arguments.callee, 10 );
					}
				}, 10 );
			} else if ( (/mozilla/i.test( u ) && !/(compati)/.test( u )) || (/opera/i.test( u )) ) {
				document.addEventListener( "DOMContentLoaded", i, false );
			} else if ( e ) {
				(function() {
					var t = document.createElement( 'doc:rdy' );
					try {
						t.doScroll( 'left' );
						i();
						t = null;
					} catch( e ) {
						setTimeout( arguments.callee, 0 );
					}
				})();
			} else {
				window.onload = i;
			}
		})( initFn );
	},

	/* GetAttribute cross-browser
	 * http://stackoverflow.com/questions/3755227/cross-browser-javascript-getattribute-method */
	getAttribute : function( elem, attr ) {
		var result = (elem.getAttribute && elem.getAttribute( attr )) || null;
		if ( !result ) {
			var attrs = elem.attributes;
			var length = attrs.length;
			for ( var i = 0; i < length; i++ ) {
				if ( typeof attr[i] !== 'undefined' ) {
					if ( attr[i].nodeName === attr ) {
						result = attr[i].nodeValue;
					}
				}
			}
		}
		return result;
	},

	/* http://stackoverflow.com/questions/7238177/detect-htmlcollection-nodelist-in-javascript */
	isNodeList : function( nodes ) {
		var result = Object.prototype.toString.call( nodes );
		return ( typeof nodes === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test( result.toString() ) &&
				(nodes.length == 0 || (typeof nodes === "object" && nodes[0].nodeType > 0)) );
	},

	scrollToDiv : function( divName ) {
		document.getElementById( divName ).scrollIntoView( true );
	},

	xGetElementById : function( id ) {
		if ( typeof(id) != 'string' ) return id;
		if ( document.getElementById ) id = document.getElementById( id );
		else if ( document.all ) id = document.all[id];
		else id = null;
		return id;
	},

	/*
	 * InnerText cross-browser
	 */
	xInnerText : function ( elem ) {
		if ( document.all ) {
			return elem.innerText;
		} else {
			return elem.textContent;
		}
	},

	/*
	 * Elimina todos los nodos hijos del nodo actual
	 */
	removeChildren : function( parentNode ) {
		while ( parentNode.hasChildNodes() ) {
			parentNode.removeChild( parentNode.firstChild );
		}
		return true;
	},

	/*
	 * Elimina el nodo actual
	 */
	removeNode : function( node ) {
		return node && node.parentNode.removeChild( node );
	},

	/*
	 * Cargamos una imagen en segundo plano
	 */
	preloadImage : function( src, widthImage, heigthImage, handler ) {
		var pic = new Image( widthImage, heigthImage );
		pic.src = src;
		pic.onload = handler;
	},

	/*
	 * Obtenemos un elemento del DOM dado a partir de una consulta CSS
	 */
	$ : function( expr, con ) {
		return (con || document).querySelector( expr );
	},

	/*
	 * Obtenemos un conjunto de elementos del DOM dado a partir de una consulta CSS
	 * en forma de array
	 */
	$$ : function( expr, con ) {
		return [].slice.call( (con || document).querySelectorAll( expr ) );
	}
};

lib.vanillaJS = {
	ready : function( fn ) {
		lib.DOM.addDOMContentLoadedHandler( fn );
	},
	query : function ( cssQuery, element ) {
		return [].slice.call( (element || document).querySelectorAll( cssQuery ) );	
	},
	create : function( element ) {
		return document.createElement( element );
	},
	addClass : function( className, element ) {
		element.classList.add( className );
	},
	toggleClass : function( className, element ) {
		element.classList.toggle( className );
	},
	click : function ( cssQuery, handler, element ) {
		[].slice.call( (element || document).querySelectorAll( cssQuery ) ).forEach( function( e ) {
			lib.Eventos.addEventHandler( e, lib.Eventos.eventActions.onclick, handler );
		} );
	},
	append : function( parent, child ) {
		parent.appendChild( child );
	},
	attr : function( cssQuery, attrName, value ) {
		document.querySelector( cssQuery ).setAttribute( attrName, value );
	},
	parent : function( idTag ) {
		return document.getElementById( idTag ).parentNode;	
	},
	clone : function( idTag ) {
		return document.getElementById( idTag ).cloneNode(true);	
	},
	empty : function( idTag ) {
		var wrap = document.getElementById( idTag );
		while ( wrap.firstChild ) wrap.removeChild( wrap.firstChild );
	},
	isEmpty : function( idTag ) {
		// $("#wrap").is(":empty") ...
		return !document.getElementById( idTag ).hasChildNodes();
	},
	next : function( idTag ) {
		return document.getElementById( idTag ).nextSibling;
	}
};

lib.CSS = {
	/*
	 * Obtenemos el conjunto de estilos aplicados a un elemento del DOM
	 */
	getCSS : function( currentDiv ) {
		if ( currentDiv.currentStyle ) {
			return currentDiv.currentStyle;
			//currentDiv.currentStyle[ "paddingTop" ];
		} else if ( window.getComputedStyle ) {
			// if DOM2
			return window.getComputedStyle( currentDiv, "" );
			//window.getComputedStyle( currentDiv, "" ).getPropertyValue( "padding-top" );
		}
	},

	/*
	 * Agregamos una definición de clase CCS
	 */
	addClassName : function( element, theClass ) {
		if ( typeof element === "string" ) {
			element = lib.DOM.xGetElementById( element );
		}
		//code to change and replace strings
		var ec = ' ' + element.className.replace( /^s*|s*$/g, '' ) + ' ';
		var nc = ec;
		theClass = theClass.replace( /^s*|s*$/g, '' );
		//check if not already there
		if ( ec.indexOf( ' ' + theClass + ' ' ) == -1 ) {
			//not found, add it
			nc = ec + theClass;
		}
		//return the changed text!
		element.className = nc.replace( /^s*|s*$/g, '' ); //trimmed whitespace
		return true;
	},

	/*
	 * Eliminamos una definición de clase CCS
	 */
	removeClassName : function( element, theClass ) {
		if ( typeof element === "string" ) {
			element = lib.DOM.xGetElementById( element );
		}
		//code to change and replace strings
		var ec = ' ' + element.className.replace( /^s*|s*$/g, '' ) + ' ';
		var nc = ec;
		theClass = theClass.replace( /^s*|s*$/g, '' );
		//check if not already there
		if ( ec.indexOf( ' ' + theClass + ' ' ) != -1 ) {
			//found, so lets remove it
			nc = ec.replace( ' ' + theClass.replace( /^s*|s*$/g, '' ) + ' ', ' ' );
		}
		//return the changed text!
		element.className = nc.replace( /^s*|s*$/g, '' ); //trimmed whitespace
		return true;
	}
};

lib.Cookies = {
	set : function( name, value, days ) {
		var exdate = new Date();
		exdate.setDate( exdate.getDate() + days );
		value = encodeURIComponent( value ) + ((days == null) ? "" : "; expires=" + exdate.toUTCString());
		document.cookie = name + "=" + value;
	},
	get : function( name ) {
		var nameEQ = name + "=";
		var ca = document.cookie.split( ';' );
		for ( var i = 0; i < ca.length; i++ ) {
			var c = ca[i];
			while ( c.charAt( 0 ) == ' ' ) {
				c = c.substring( 1, c.length );
				c = decodeURIComponent( c );
			}
			if ( c.indexOf( nameEQ ) == 0 ) {
				return c.substring( nameEQ.length, c.length );
			}
		}
		return null;
	},
	erase : function( name ) {
		lib.Cookies.add( name, "", -1 );
	}
};

lib.Ejemplos.Eventos = {
	defaultButtonForm : function( e ) { // e: el manejador del evento (de teclado)
		// se recibe por parámetro
		var info = lib.Eventos.event( e, true, true );
		if ( info.keyCode == 13 ) {
			//...
			this.submit();
		}
	}
};

lib.Ejemplos.Herencia = function() {
	var ClasePadre = function( msg ) {
		this.first = msg || "Hello";
		this.second = new String( "World" );
		this.third = new String( "from ClasePadre" );
		this.contenedor = {
			var1 : "Miau",
			var2 : [ "Soy", "un", "gato" ]
		};
		this.sum = function( x, y ) {
			return x + y;
		};
	};

	var ClaseHija = function( msg ) {
		this.__proto__ = new ClasePadre();
		// var _super = ns.B.prototype;
		this.first = msg || "Hello";
		this.third = new String( "from ClaseHija" );
		this.difference = function( x, y ) {
			return x - y;
		};
		this.saluda = function() {
			return this.first + " " + this.second;
		};
		this.accesoaClasePadre = function() {
			// return _super.third.toString();
			return this.__proto__.third.toString();
		};
	};
};

lib.Ejemplos.Tipos = function() {
	var treintaYDos = new Number( 32 );
	var holaMundo = new String( "Hola mundo!" );
	var objeto = new Object();
	var exprReg = new RegExp( "^\\d+$" ); // /^\d+$/
	var test = exprReg.test( "222" );
	var boleano = new Boolean( true );
	var unVector = new Array( 3, 11, "diez" );
	var otroVector = [ "uno", "dos", "tres" ];
	otroVector[4] = "cuatro";
	otroVector.push( "cinco" );
	var pi = Math.PI;

	var unArrayDisperso = { p1: 1, p2: 2, p3: 3};
	var elresultadoes2 = unArrayDisperso['p' + 2];

	// variables no declaradas
	// if ( typeof myVar === 'undefined' ) { // myVar no existe }

	console.log( typeof 2 ); // number
	console.log( typeof 'Hello World' ); // string
	console.log( typeof [ 1, 2, 3 ] );
	// object
	console.log( typeof('foo',4) ); // number, la coma hace evaluación de izquierda a derecha

	console.log( ['foo', 'bar', 1].toString() ); // "foo, bar, 1""
	/a-z/.toString(); // "/a-z/"
	// Sin embargo
	Object.prototype.toString.call( [ 'foo', 'bar', 1 ] ); // [object Array]
	Object.prototype.toString.call( "Hello World" ); // [object String]
	Object.prototype.toString.call( /a-z/ ); // [object RegExp]

	Object.prototype.toType.call( {a: 4} ); // "object"
	Object.prototype.toType.call( [1, 2, 3] ); // "array"
	(function() {
		console.log( Object.prototype.toType.call( arguments ) )
	})(); // arguments
	Object.prototype.toType.call( new ReferenceError ); // "error"
	Object.prototype.toType.call( new Date ); // "date"
	Object.prototype.toType.call( /a-z/ ); // "regexp"
	Object.prototype.toType.call( Math ); // "math"
	Object.prototype.toType.call( JSON ); // "json"
	Object.prototype.toType.call( new Number( 4 ) ); // "number"
	Object.prototype.toType.call( new String( "abc" ) ); // "string"
	Object.prototype.toType.call( new Boolean( true ) ); // "boolean"

	// Comparando con typeof
	console.log( typeof {a: 4} ); // "object"
	console.log( typeof [1, 2, 3] ); // "object"
	(function() {
		console.log( typeof arguments )
	})(); // object
	console.log( typeof new ReferenceError ); // "object"
	console.log( typeof new Date ); // "object"
	console.log( typeof /a-z/ ); // "object"
	console.log( typeof Math ); // "object"
	console.log( typeof JSON ); // "object"
	console.log( typeof new Number( 4 ) ); // "object"
	console.log( typeof new String( "abc" ) ); // "object"
	console.log( typeof new Boolean( true ) ); // "object"

	// Si lo usamos a secas no previene de que salte excepción si le pasamos una
	// variable no definida
	// window.fff && console.log(toType(fff))
};

lib.Ejemplos.DOM = {
	settingStyle: function() {
		var parrafoVisible = document.getElementById( "div-name" );
		parrafoVisible.setAttribute( "style", "display: inline;" );
		var enlaceOculto = document.getElementById( "enlace" );
		enlaceOculto.className = "oculto";
	}
};

lib.Ejemplos.Closures = function() {
	// No hacer referencia a variables de ámbito superior dentro de funciones
	// anidadas, pasarlas por parámetro para tener un 'scope' limpio
	var imagesCollection = document.getElementsByTagName( 'img' );
	for ( var i = 0, l = imagesCollection.length; i < l; i++ ) {
		(function( currentImage ) {
			imagesCollection[i].addEventListener( 'mouseover', function( e ) {
				e.preventDefault();
				console.log( 'Image number: ', currentImage );
			}, 'false' );
		})( i ); // 'i' es 'currentImage' en el closure
	}
};

lib.Ejemplos.Animacion = function() {
	var id = setInterval( function() {
		// ...
	}, 10 ); // se ejecuta una y otra vez
	clearInterval( id );

	function work () {
		// ...
		setTimeout( work, 10 ); // se ejecuta una sola vez
	}
};

lib.Ejemplos.JSON = function() {
	var jsonHomer = {
		nombre : "Homer",
		apellido : "Simpson",
		tels : [ "555-123456", "555-654321" ],
		ocupacion : {
			puesto : "operario",
			lugar : "central nuclear de Springfield"
		}
	};
	var homer = eval( jsonHomer );

	function pruebaJSON () {
		var foo = 'Hello';
		var bar = 'World';
		var myObj = {
			foo : bar
		};// Las claves deben de ser cadenas según ECMA5
		console.log( myObj ); // foo: 'World' -> MAL
		myObj = {};
		myObj[foo] = bar;
		console.log( myObj ); // Hello: 'World'

		// Parseando JSON
		var json = '{"name" : "Cake"}';
		var parsed = eval( '(' + json + ')' );
		console.log( parsed.name ); // Cake

		// !!! En ECMA5 existen dos métodos nativos que sustituyen a 'eval' de manera segura
		// JSON.parse y JSON.stringify
	}
};

lib.Ejemplos.Call = function() {
	// Uso de call y apply
	// permiten ejecutar una función como si fuera un método de otro objeto (no
	// ligado con prototype)
	function f ( x ) {
		return this.numero + x;
	}

	var o = new Object();
	o.numero = 5;
	var resultado = f.call( o, 4 ); // 9

	var arg1 = Array.prototype.slice.call( arguments, 0, 1 )[0];
	arg1 = arg1 || 'unNombre';
};

lib.Ejemplos.Ambitos = function() {
	var crearSaludo = function( mensaje ) {
		var saludo = function( porConsola ) {
			var mensajeSaludo = mensaje + " " + nombre;
			//...
		};
		mensaje = mensaje || "Hola";
		var nombre = "Juan";
		return saludo;
	};
	// No importa el orden con el que declaremos las variables cuando utilizamos
	// closures
};

lib.Ejemplos.ER = function() {
	// Ejemplos de expresiones regulares
	console.log( /our/.test( "courage" ) );
	console.log( "courage".search( /our/ ) == 1 ); // Letra detrás de our
	console.log( "recieve".replace( /ie/, "ei" ) == "receive" );
	console.log( /\d/.test( 9 ) );
	// \D non-digit; \s space; \S non-space; \w word; \W non-word; [ ] one of; [^ ] one not of; _-_ range;
	console.log( /^a/.test( "apple" ) ); // empieza con a ($ termina con a)
	console.log( "abc".replace( /(a)(b)(c)/, '$1,$2,$3' ) == "a.b.c" ); // subexpresiones
	console.log( "the the first man to to see".replace( /(\w+) \1/g, "$1 [$1]" ) == "the [the] first man to [to] see" );
	// insiste a que la subexpresion aparecida ocurra de nuevo
	console.log( "abc".replace( /ab(c)/, '-' ) == "-" );
	console.log( "abc".replace( /ab(?=c)/, '-' ) == "-c" ); // especifica que es lo siguiente pero dejandolo
	console.log( "abc".replace( /ab(?!d)/, '-' ) == "-c" ); // especifica que es lo que no debe ser pero dejandolo

	console.log( "Alan".replace( /a/, "A" ) == "Alan" );
	console.log( "Alan".replace( /a/, "e" ) == "elan" );
	console.log( "Alan".replace( /a/g, "e" ) == "elen" );

	console.log( "abcd".replace( /bc/, "$`" ) == "aad" ); // left context
	console.log( "abcd".replace( /bc/, "$'" ) == "add" ); // right context
	console.log( "abcd".replace( /bc/, "$&" ) == "abcd" ); // last match
	console.log( "abcd".replace( /bc/, "$_" ) == "aabcdd" ); // input
	console.log( "abcd".replace( /bc/, "$$" ) == "a$d" );
	console.log( "abcd".replace( /(b)(c)/, "$1" ) == "abd" );
	console.log( "abcd".replace( /(b)(c)/, "$2" ) == "acd" );
	console.log( "abcd".replace( /(b)(c)/, "$+" ) == "acd" ); // ultimo parentesis

	var s = "to be the *first* - that is the idea";
	var a = s.split( /\W+/, 4 );
	console.log( a.join( ',' ) === "to,be,the,first" );

	s = "calling b7 i20 n33, anynody win yet";
	var b = s.match( /[bingo]\d{1,2}/g );
	console.log( b.length == 3 );
	console.log( b[3] == 'n33' );
	console.log( b.input == s );

	// Dynamic regular expressions
	//var myReg = new RegExp('\\b' + variable + '\\b');

	/*
	 * Fechas: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{1,2}$/
	 * Emails: /^[0-9a-zA-Z]+([._]*[0-9a-zA-Z])*@[0-9a-zA-Z]+([._-]*[0-9a-zA-Z])*[.]{1}[0-9a-zA-Z]{2,3}$/
	 *
	 */
};


if ( !window.JS ) {
	window.JS = lib.vanillaJS;
}

