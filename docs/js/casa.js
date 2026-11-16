// Casa del koala: verlo, cuidarlo y ver cuánto le falta para crecer.
(function () {
  var COSTE = 5;
  var SUBIDA = 25;
  var raiz, reloj, frase;

  var CUIDADOS = [
    { clave: 'hambre', nombre: 'Comer', icono: function () { return K.ico.hoja(34); }, frase: '¡Ñam! Qué ricas están las hojas.' },
    { clave: 'sueno', nombre: 'Dormir', icono: function () { return K.ico.luna; }, frase: 'Zzz... qué siesta más buena.' },
    { clave: 'diversion', nombre: 'Divertirse', icono: function () { return K.ico.pelota; }, frase: '¡Otra vez, otra vez!' },
    { clave: 'limpieza', nombre: 'Bañar', icono: function () { return K.ico.gota; }, frase: '¡Qué limpito me he quedado!' }
  ];

  function saludo() {
    var n = K.estado.nec;
    var peor = 'hambre';
    for (var k in n) if (n[k] < n[peor]) peor = k;
    if (n[peor] >= 60) return '¡Hola! Qué bien estoy contigo.';
    return {
      hambre: '¡Tengo hambre! ¿Me das unas hojas?',
      sueno: 'Aaah... tengo mucho sueño.',
      diversion: 'Me aburro. ¿Jugamos a algo?',
      limpieza: 'Creo que necesito un baño.'
    }[peor];
  }

  function koalaEnEscena() {
    var e = K.etapa().actual.escala;
    var ancho = 226 * e;
    var alto = ancho * 250 / 240;
    return '<svg x="' + (153 - ancho / 2) + '" y="' + (387 - alto) + '" width="' + ancho + '" height="' + alto + '" viewBox="0 0 240 250">' +
      K.koalaInterior({ animo: K.animo(), puesto: K.estado.puesto }) + '</svg>';
  }

  function escena() {
    return '<svg class="fondo" viewBox="0 0 358 420" preserveAspectRatio="xMidYMax slice">' +
      '<g stroke="#3B2A20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="56" cy="64" r="32" fill="#FFD86B"/>' +
      '<path d="M96 130c-14 0-14-20 2-20 2-16 28-16 32-2 16-4 22 22 4 22Z" fill="#FFFFFF"/>' +
      '<path d="M-10 424V330c40-34 90-34 130-6 40-30 110-36 250 6v94Z" fill="#8CCB8A"/>' +
      '<path d="M262 428C272 300 268 140 286 -6h66c-14 150-6 300 6 434Z" fill="#B5825A"/>' +
      '<path d="M298 60c6 30 4 60 0 90M322 190c-4 40-2 80 4 120" fill="none" stroke-width="3"/>' +
      '<path d="M276 362C200 380 110 374 22 368c-12-1-12 22 0 24 90 10 180 14 256 0Z" fill="#B5825A"/>' +
      '<ellipse cx="30" cy="352" rx="26" ry="12" fill="#5DB075" transform="rotate(-28 30 352)"/>' +
      '<ellipse cx="40" cy="404" rx="26" ry="12" fill="#5DB075" transform="rotate(24 40 404)"/>' +
      '<ellipse cx="250" cy="40" rx="34" ry="15" fill="#5DB075" transform="rotate(20 250 40)"/>' +
      '<ellipse cx="232" cy="84" rx="30" ry="13" fill="#3E9B5F" transform="rotate(-14 232 84)"/>' +
      '<ellipse cx="330" cy="24" rx="34" ry="15" fill="#3E9B5F" transform="rotate(-30 330 24)"/>' +
      '</g>' +
      '<g class="koala-g" id="koala" role="img" aria-label="' + K.h(K.estado.nombre) + ', tu koala. Tócalo para saludarlo.">' + koalaEnEscena() + '</g>' +
      '</svg>';
  }

  function progreso() {
    var et = K.etapa();
    if (!et.siguiente) return { texto: '¡Ha llegado a lo más alto!', cuenta: K.estado.estrellas + ' estrellas', ancho: 100 };
    var tramo = et.siguiente.min - et.actual.min;
    return {
      texto: 'Estrellas para crecer',
      cuenta: K.estado.estrellas + ' de ' + et.siguiente.min,
      ancho: Math.round((K.estado.estrellas - et.actual.min) / tramo * 100)
    };
  }

  function colorBarra(v) { return v < 40 ? '#D9502F' : '#3E9B5F'; }

  function pintar(app) {
    raiz = app;
    K.desgaste();
    frase = saludo();
    var et = K.etapa();
    var p = progreso();
    var h = '<section class="pantalla">';
    h += '<header class="cab"><div><h1 class="nombre">' + K.h(K.estado.nombre) + '</h1><span class="sub">' + et.actual.nombre + '</span></div>';
    h += '<div class="fila">' + K.pastillaHojas() + '<div class="pastilla">' + K.ico.estrella() + '<span data-estrellas>' + K.estado.estrellas + '</span></div></div></header>';
    h += '<div class="tarjeta progreso"><div class="fila-entre"><span>' + p.texto + '</span><span>' + p.cuenta + '</span></div><div class="barra"><i style="width:' + p.ancho + '%"></i></div></div>';
    h += '<div class="escena">' + escena() + '<div class="bocadillo" aria-live="polite" data-frase>' + frase + '</div></div>';
    h += '<div class="necesidades">';
    CUIDADOS.forEach(function (c) {
      var v = Math.round(K.estado.nec[c.clave]);
      h += '<button class="necesidad" data-cuidar="' + c.clave + '" aria-label="' + c.nombre + ', ' + v + ' por ciento. Cuesta ' + COSTE + ' hojas.">' + c.icono() +
        '<span class="datos"><span>' + c.nombre + '</span><span class="barra"><i data-barra="' + c.clave + '" style="width:' + v + '%;background:' + colorBarra(v) + '"></i></span></span></button>';
    });
    h += '</div>';
    h += '<nav class="fila"><a class="boton crece" href="#/juegos">Jugar y ganar hojas</a><a class="boton blanco" href="#/tienda">Tienda</a></nav>';
    h += '</section>';
    app.innerHTML = h;

    app.querySelectorAll('[data-cuidar]').forEach(function (b) {
      b.addEventListener('click', function () { cuidar(b.getAttribute('data-cuidar')); });
    });
    app.querySelector('#koala').addEventListener('click', function () {
      decir(K.elige(['¡Ji, ji! Me haces cosquillas.', '¡Hola, hola!', 'Me gusta estar contigo.', '¿Jugamos a algo?']));
      botar();
    });

    reloj = setInterval(function () { K.desgaste(); refrescar(); }, 60000);
    if (K.estado.celebrar) celebrar();
  }

  function botar() {
    var g = raiz.querySelector('#koala');
    g.classList.remove('bote');
    void g.getBoundingClientRect();
    g.classList.add('bote');
  }

  function decir(texto) {
    frase = texto;
    raiz.querySelector('[data-frase]').textContent = texto;
  }

  function refrescar() {
    raiz.querySelector('[data-hojas]').textContent = Math.floor(K.estado.hojas);
    CUIDADOS.forEach(function (c) {
      var v = Math.round(K.estado.nec[c.clave]);
      var barra = raiz.querySelector('[data-barra="' + c.clave + '"]');
      barra.style.width = v + '%';
      barra.style.background = colorBarra(v);
    });
    raiz.querySelector('#koala').innerHTML = koalaEnEscena();
  }

  function cuidar(clave) {
    var c = CUIDADOS.filter(function (x) { return x.clave === clave; })[0];
    if (K.estado.nec[clave] >= 100) { decir('¡Ahora no me hace falta, gracias!'); return; }
    if (K.estado.hojas < COSTE) { decir('Nos faltan hojas. ¡Vamos a jugar!'); return; }
    K.sumarHojas(-COSTE);
    K.subirNecesidad(clave, SUBIDA);
    refrescar();
    decir(c.frase);
    botar();
  }

  function celebrar() {
    var nombre = K.estado.celebrar;
    K.estado.celebrar = null;
    K.guardar();
    var velo = document.createElement('div');
    velo.className = 'velo';
    velo.innerHTML = '<div class="tarjeta columna centro" role="dialog" aria-label="Tu koala ha crecido">' +
      K.ico.estrella(64) +
      '<h2 class="titulo-grande">¡' + K.h(K.estado.nombre) + ' ha crecido!</h2>' +
      '<p>Gracias a todo lo que has resuelto, ahora es: ' + nombre + '.</p>' +
      '<button class="boton" style="width:100%">¡Qué bien!</button></div>';
    raiz.appendChild(velo);
    velo.querySelector('button').addEventListener('click', function () { velo.remove(); });
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.casa = {
    pintar: pintar,
    salir: function () { clearInterval(reloj); }
  };
})();
