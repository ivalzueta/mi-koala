// Casa del koala: verlo, cuidarlo, jugar con él y ver cuánto le falta para crecer.
(function () {
  var COSTE = 5;
  var SUBIDA = 25;
  var raiz, reloj, charla, frase, cara = {}, cosquillas = [], tCara;

  var CUIDADOS = [
    { clave: 'hambre', nombre: 'Comer', icono: function () { return K.ico.hoja(34); }, son: 'nam', chorro: function () { return K.ico.hoja(26); }, cara: { risa: true },
      frases: ['¡Ñam, ñam! Qué ricas están las hojas.', '¡Mmm! Eucalipto, mi favorito.', '¡Qué rico! ¿Me das otra?'] },
    { clave: 'sueno', nombre: 'Dormir', icono: function () { return K.ico.luna; }, son: 'dormir', chorro: function () { return '<b class="zeta">Z</b>'; }, cara: { dormido: true },
      frases: ['Zzz... qué siesta más buena.', 'Zzz... estaba soñando con hojas gigantes.', 'Zzz... ¡ya tengo energía!'] },
    { clave: 'diversion', nombre: 'Divertirse', icono: function () { return K.ico.pelota; }, son: 'risa', chorro: function () { return K.ico.pelota; }, cara: { salto: true },
      frases: ['¡Otra vez, otra vez!', '¡Yupiii! ¡Qué divertido!', '¡Me encanta jugar contigo!'] },
    { clave: 'limpieza', nombre: 'Bañar', icono: function () { return K.ico.gota; }, son: 'agua', chorro: function () { return K.ico.burbuja; }, cara: { risa: true },
      frases: ['¡Qué limpito me he quedado!', '¡Burbujas! ¡Plof, plof!', 'Ahora huelo a eucalipto.'] }
  ];

  // Cosas que dice el koala solo, de vez en cuando.
  var CHARLA = [
    '¿Sabías que los koalas dormimos hasta 20 horas al día?',
    '¿Sabías que casi nunca bebemos agua? Las hojas nos la dan.',
    '¿Sabías que las crías de koala se llaman «joeys»?',
    '¿Sabías que tenemos huellas dactilares como las tuyas?',
    'Un koala bebé vive 6 meses en la bolsa de su mamá.',
    '¿Qué le dice un 3 a un 30? «Para ser como yo, tienes que ser sincero».',
    '¿Por qué el libro de mates está triste? Porque tiene muchos problemas.',
    '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
    '¿Cuánto es 7 × 8? ¡56! Me lo sé de memoria.',
    'Si resuelves acertijos, crezco más rápido.',
    'Hoy me apetece un juego sorpresa. ¿Y a ti?',
    'Tócame la barriga, que me da la risa.',
    '¿Te sabes la tabla del 9? 9, 18, 27, 36...',
    '¿Qué pesa más, un kilo de hojas o un kilo de piedras? ¡Lo mismo!',
    '¡Me gusta mucho que vengas a verme!'
  ];

  function hoy() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  function saludo() {
    var n = K.estado.nec;
    var peor = 'hambre';
    for (var k in n) if (n[k] < n[peor]) peor = k;
    if (n[peor] >= 60) return K.elige(['¡Hola! Qué bien estoy contigo.', '¡Hola! ¿Qué hacemos hoy?', '¡Qué alegría verte!']);
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
    var o = { animo: K.animo(), puesto: K.estado.puesto };
    for (var k in cara) o[k] = cara[k];
    return '<svg x="' + (153 - ancho / 2) + '" y="' + (387 - alto) + '" width="' + ancho + '" height="' + alto + '" viewBox="0 0 240 250">' +
      K.koalaInterior(o) + '</svg>';
  }

  function escena() {
    return '<svg class="fondo" viewBox="0 0 358 420" preserveAspectRatio="xMidYMax slice">' +
      '<g stroke="#3B2A20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' +
      '<circle class="sol" cx="56" cy="64" r="32" fill="#FFD86B"/>' +
      '<g class="nube"><path d="M96 130c-14 0-14-20 2-20 2-16 28-16 32-2 16-4 22 22 4 22Z" fill="#FFFFFF"/></g>' +
      '<g class="nube lenta"><path d="M170 70c-10 0-10-15 2-15 2-12 20-12 24-2 12-3 16 17 3 17Z" fill="#FFFFFF"/></g>' +
      '<path d="M-10 424V330c40-34 90-34 130-6 40-30 110-36 250 6v94Z" fill="#8CCB8A"/>' +
      '<path d="M262 428C272 300 268 140 286 -6h66c-14 150-6 300 6 434Z" fill="#B5825A"/>' +
      '<path d="M298 60c6 30 4 60 0 90M322 190c-4 40-2 80 4 120" fill="none" stroke-width="3"/>' +
      '<path d="M276 362C200 380 110 374 22 368c-12-1-12 22 0 24 90 10 180 14 256 0Z" fill="#B5825A"/>' +
      '<ellipse cx="30" cy="352" rx="26" ry="12" fill="#5DB075" transform="rotate(-28 30 352)"/>' +
      '<ellipse cx="40" cy="404" rx="26" ry="12" fill="#5DB075" transform="rotate(24 40 404)"/>' +
      '<g class="rama"><ellipse cx="250" cy="40" rx="34" ry="15" fill="#5DB075" transform="rotate(20 250 40)"/>' +
      '<ellipse cx="232" cy="84" rx="30" ry="13" fill="#3E9B5F" transform="rotate(-14 232 84)"/>' +
      '<ellipse cx="330" cy="24" rx="34" ry="15" fill="#3E9B5F" transform="rotate(-30 330 24)"/></g>' +
      '<g class="mariposa"><g class="alas"><path d="M0 0C-14-16-22 0-10 6Z" fill="#F7A8B8" stroke-width="2.5"/><path d="M0 0C14-16 22 0 10 6Z" fill="#F7A8B8" stroke-width="2.5"/></g><path d="M0-6v12" stroke-width="3"/></g>' +
      '</g>' +
      '<g class="koala-g" id="koala" role="img" aria-label="' + K.h(K.estado.nombre) + ', tu koala. Tócalo para hacerle cosquillas.">' + koalaEnEscena() + '</g>' +
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
    cara = {};
    K.desgaste();
    frase = saludo();
    var et = K.etapa();
    var p = progreso();
    var h = '<section class="pantalla">';
    h += '<header class="cab"><div><h1 class="nombre">' + K.h(K.estado.nombre) + '</h1><span class="sub">' + et.actual.nombre + '</span></div>';
    h += '<div class="fila">' + K.pastillaHojas() + '<div class="pastilla">' + K.ico.estrella() + '<span data-estrellas>' + K.estado.estrellas + '</span></div>' +
      '<button class="circulo" data-mudo aria-label="Sonido">' + K.ico.altavoz(!K.estado.mudo) + '</button></div></header>';
    h += '<div class="tarjeta progreso"><div class="fila-entre"><span>' + p.texto + '</span><span>' + p.cuenta + '</span></div><div class="barra"><i style="width:' + p.ancho + '%"></i></div></div>';
    h += '<div class="escena">' + escena() + '<div class="bocadillo" aria-live="polite" data-frase>' + frase + '</div>';
    if (K.estado.regalo !== hoy()) h += '<button class="regalo-dia" data-regalo aria-label="Regalo del día">' + K.ico.regalo + '<span>¡Regalo!</span></button>';
    h += '</div>';
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
    app.querySelector('#koala').addEventListener('click', hacerCosquillas);
    app.querySelector('[data-mudo]').addEventListener('click', function (e) {
      K.estado.mudo = !K.estado.mudo; K.guardar();
      e.currentTarget.innerHTML = K.ico.altavoz(!K.estado.mudo);
      if (!K.estado.mudo) K.son('bien');
    });
    var r = app.querySelector('[data-regalo]');
    if (r) r.addEventListener('click', abrirRegalo);

    reloj = setInterval(function () { K.desgaste(); refrescar(); }, 60000);
    charla = setInterval(function () { if (!cara.dormido) { decir(K.elige(CHARLA)); botar(); } }, 11000);
    if (K.estado.celebrar) celebrar();
  }

  function ponerCara(o, ms) {
    cara = o;
    raiz.querySelector('#koala').innerHTML = koalaEnEscena();
    clearTimeout(tCara);
    tCara = setTimeout(function () {
      cara = {};
      var k = raiz && raiz.querySelector('#koala');
      if (k) k.innerHTML = koalaEnEscena();
    }, ms || 1200);
  }

  function animar(clase) {
    var g = raiz.querySelector('#koala');
    g.classList.remove('bote', 'gira', 'tiembla');
    void g.getBoundingClientRect();
    g.classList.add(clase);
  }
  function botar() { animar('bote'); }

  function hacerCosquillas() {
    var ahora = Date.now();
    cosquillas = cosquillas.filter(function (t) { return ahora - t < 2000; });
    cosquillas.push(ahora);
    var g = raiz.querySelector('#koala');
    if (cosquillas.length >= 5) {
      cosquillas = [];
      animar('gira');
      K.son('fanfarria');
      ponerCara({ salto: true }, 1500);
      decir('¡Uaaa! ¡Me has hecho dar una vuelta! Estoy mareado.');
      K.chorro(g, K.ico.estrella(26), 6);
      return;
    }
    animar('bote');
    K.son('risa');
    ponerCara({ risa: true }, 900);
    K.chorro(g, K.ico.corazon, 3);
    decir(K.elige(['¡Ji, ji, ji! ¡Cosquillas no!', '¡Ja, ja! ¡Para, para!', '¡Hola, hola!', 'Me gusta estar contigo.', '¡Otra vez! ¡Ji, ji!', 'Si me tocas muchas veces seguidas... ¡pasa algo!']));
  }

  function decir(texto) {
    frase = texto;
    var b = raiz.querySelector('[data-frase]');
    b.textContent = texto;
    b.classList.remove('nuevo'); void b.offsetWidth; b.classList.add('nuevo');
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
    if (K.estado.nec[clave] >= 100) { decir('¡Ahora no me hace falta, gracias!'); animar('tiembla'); return; }
    if (K.estado.hojas < COSTE) { decir('Nos faltan hojas. ¡Vamos a jugar para conseguir más!'); animar('tiembla'); K.son('mal'); return; }
    K.sumarHojas(-COSTE);
    K.subirNecesidad(clave, SUBIDA);
    refrescar();
    K.son(c.son);
    decir(K.elige(c.frases));
    ponerCara(c.cara, clave === 'sueno' ? 2500 : 1200);
    if (clave !== 'sueno') botar();
    K.chorro(raiz.querySelector('#koala'), c.chorro(), 5);
  }

  function abrirRegalo() {
    var premio = K.al(5, 15);
    K.estado.regalo = hoy();
    K.guardar();
    var b = raiz.querySelector('[data-regalo]');
    b.classList.add('abierto');
    K.son('regalo');
    setTimeout(function () {
      b.remove();
      K.confeti(70);
      K.sumarHojas(premio);
      ponerCara({ salto: true }, 1500);
      botar();
      decir('¡Un regalo! ¡' + premio + ' hojas para ti! Vuelve mañana, que habrá otro.');
    }, 600);
  }

  function celebrar() {
    var nombre = K.estado.celebrar;
    K.estado.celebrar = null;
    K.guardar();
    var velo = document.createElement('div');
    velo.className = 'velo';
    velo.innerHTML = '<div class="tarjeta columna centro aparece" role="dialog" aria-label="Tu koala ha crecido">' +
      K.koalaSVG({ ancho: 150, salto: true, puesto: K.estado.puesto }) +
      '<h2 class="titulo-grande">¡' + K.h(K.estado.nombre) + ' ha crecido!</h2>' +
      '<p>Gracias a todo lo que has resuelto, ahora es: ' + nombre + '.</p>' +
      '<button class="boton" style="width:100%">¡Qué bien!</button></div>';
    raiz.appendChild(velo);
    K.confeti(150);
    K.son('fanfarria');
    velo.querySelector('button').addEventListener('click', function () { velo.remove(); });
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.casa = {
    pintar: pintar,
    salir: function () { clearInterval(reloj); clearInterval(charla); clearTimeout(tCara); }
  };
})();
