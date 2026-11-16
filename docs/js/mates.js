// Reto de mates: cinco preguntas variadas. La dificultad se adapta sola (niveles 1 a 4).
(function () {
  var NIVEL_MAX = 4;
  var POR_NIVEL = {
    1: ['suma', 'resta', 'multi', 'serie', 'hora'],
    2: ['suma', 'resta', 'multi', 'division', 'serie', 'cambio', 'hora', 'falta'],
    3: ['suma', 'resta', 'multi', 'division', 'serie', 'cambio', 'doble', 'falta', 'perimetro', 'dospasos', 'medida'],
    4: ['suma', 'resta', 'multi', 'division', 'serie', 'cambio', 'doble', 'fraccion', 'falta', 'perimetro', 'dospasos', 'medida', 'redondeo']
  };
  var TOPE = [0, 40, 100, 400, 1000];
  var TABLAS = [[], [2, 3, 5, 10], [2, 3, 4, 5, 6, 10], [2, 3, 4, 5, 6, 7, 8, 9], [3, 4, 6, 7, 8, 9]];
  var al = K.al;

  var GENERA = {
    suma: function (n) {
      var t = TOPE[n];
      var a = al(Math.floor(t * 0.2), Math.floor(t * 0.55));
      var b = al(Math.max(2, Math.floor(t * 0.1)), Math.min(t - a, Math.floor(t * 0.45)));
      return {
        texto: K.estado.nombre + ' tenía ' + a + ' hojas y encuentra ' + b + ' más. ¿Cuántas tiene ahora?',
        grande: a + ' + ' + b, bien: a + b,
        pista: 'Suma primero las decenas y después las unidades.'
      };
    },
    resta: function (n) {
      var t = TOPE[n];
      var a = al(Math.floor(t * 0.4), t);
      var b = al(Math.max(2, Math.floor(t * 0.1)), a - Math.max(1, Math.floor(t * 0.05)));
      return {
        texto: 'Había ' + a + ' hojas en la rama y el viento se lleva ' + b + '. ¿Cuántas quedan?',
        grande: a + ' − ' + b, bien: a - b,
        pista: 'Cuenta desde ' + b + ' hasta ' + a + ': ¿cuántos pasos hay?'
      };
    },
    multi: function (n) {
      var a = K.elige(TABLAS[n]);
      var b = al(2, n === 1 ? 5 : 10);
      return {
        texto: 'Cada rama tiene ' + a + ' hojas. ¿Cuántas hojas hay en ' + b + ' ramas?',
        grande: b + ' × ' + a, bien: a * b, extra: [a, -a, b, -b],
        pista: b + ' × ' + a + ' es lo mismo que ' + (b - 1) + ' × ' + a + ' y ' + a + ' más.'
      };
    },
    division: function (n) {
      var b = al(2, n <= 2 ? 5 : 9);
      var c = al(2, n <= 2 ? 6 : 10);
      return {
        texto: 'Reparte ' + (b * c) + ' hojas entre ' + b + ' koalas a partes iguales. ¿Cuántas le tocan a cada uno?',
        grande: (b * c) + ' ÷ ' + b, bien: c,
        pista: '¿Qué número multiplicado por ' + b + ' da ' + (b * c) + '?'
      };
    },
    serie: function (n) {
      var forma = n >= 3 ? K.elige(['mas', 'doble', 'menos']) : 'mas';
      var v = [], i, k, bien, pista;
      if (forma === 'doble') {
        v.push(al(1, 5));
        for (i = 1; i < 5; i++) v.push(v[i - 1] * 2);
        pista = 'Cada número es el doble del anterior.';
      } else if (forma === 'menos') {
        k = al(3, 9);
        v.push(al(50, 99));
        for (i = 1; i < 5; i++) v.push(v[i - 1] - k);
        pista = 'Cada número es ' + k + ' menos que el anterior.';
      } else {
        k = al(2, n * 3 + 1);
        v.push(al(1, 12));
        for (i = 1; i < 5; i++) v.push(v[i - 1] + k);
        pista = 'Cada número es ' + k + ' más que el anterior.';
      }
      bien = v.pop();
      return { texto: '¿Qué número sigue en la serie?', grande: v.join(', ') + ', ?', bien: bien, pista: pista };
    },
    cambio: function (n) {
      var billete = K.elige(n === 2 ? [20, 50] : n === 3 ? [50, 100] : [100, 200]);
      var precio = al(Math.floor(billete * 0.3), billete - 3);
      return {
        texto: 'Pagas ' + precio + ' monedas con un billete de ' + billete + '. ¿Cuánto te devuelven?',
        grande: billete + ' − ' + precio, bien: billete - precio,
        pista: 'Cuenta desde ' + precio + ' hasta ' + billete + ', primero hasta la decena siguiente.'
      };
    },
    doble: function (n) {
      var x = al(6, n === 3 ? 40 : 120);
      if (Math.random() < 0.5) {
        return { texto: '¿Cuánto es el doble?', grande: 'el doble de ' + x, bien: x * 2, pista: 'El doble es sumar el número consigo mismo: ' + x + ' + ' + x + '.' };
      }
      return { texto: '¿Cuánto es la mitad?', grande: 'la mitad de ' + (x * 2), bien: x, pista: 'Busca el número que sumado consigo mismo da ' + (x * 2) + '.' };
    },
    hora: function (n) {
      var h = al(1, 11), m = (n === 1 ? 15 : 5) * al(1, n === 1 ? 3 : 11);
      return {
        texto: 'Son las ' + h + ':' + (m < 10 ? '0' + m : m) + '. ¿Cuántos minutos faltan para las ' + (h + 1) + ' en punto?',
        grande: h + ':' + (m < 10 ? '0' + m : m), bien: 60 - m, extra: [15, -15],
        pista: 'Una hora tiene 60 minutos. Cuenta desde ' + m + ' hasta 60.'
      };
    },
    falta: function (n) {
      var a = K.elige(TABLAS[n]), b = al(2, 10);
      return {
        texto: '¿Qué número falta para que la multiplicación sea correcta?',
        grande: '? × ' + a + ' = ' + (a * b), bien: b,
        pista: 'Repasa la tabla del ' + a + ' hasta llegar a ' + (a * b) + '.'
      };
    },
    perimetro: function (n) {
      var a = al(3, n === 3 ? 12 : 25), b = al(2, n === 3 ? 9 : 18);
      return {
        texto: 'Un huerto rectangular mide ' + a + ' metros de largo y ' + b + ' de ancho. ¿Cuántos metros de valla hacen falta para rodearlo?',
        grande: a + ' m × ' + b + ' m', bien: 2 * (a + b), extra: [a, -a, b, -b],
        pista: 'La valla recorre los cuatro lados: dos largos y dos anchos.'
      };
    },
    dospasos: function (n) {
      var cuantos = al(2, 5), precio = al(2, n === 3 ? 6 : 9), billete = K.elige(n === 3 ? [20, 50] : [50, 100]);
      if (cuantos * precio >= billete) billete = 100;
      return {
        texto: 'Compras ' + cuantos + ' cuadernos de ' + precio + ' monedas cada uno y pagas con un billete de ' + billete + '. ¿Cuánto te devuelven?',
        grande: billete + ' − ' + cuantos + ' × ' + precio, bien: billete - cuantos * precio, extra: [precio, -precio],
        pista: 'Primero calcula cuánto cuestan todos los cuadernos y después réstalo de ' + billete + '.'
      };
    },
    medida: function () {
      var m = al(1, 9), cm = 5 * al(1, 19);
      if (Math.random() < 0.5) {
        return {
          texto: '¿Cuántos centímetros son ' + m + ' metros y ' + cm + ' centímetros?',
          grande: m + ' m y ' + cm + ' cm', bien: m * 100 + cm, extra: [100, -100, 50],
          pista: 'Un metro son 100 centímetros.'
        };
      }
      var kg = al(1, 5), g = 100 * al(1, 9);
      return {
        texto: '¿Cuántos gramos son ' + kg + ' kilos y ' + g + ' gramos?',
        grande: kg + ' kg y ' + g + ' g', bien: kg * 1000 + g, extra: [100, -100, 1000, -1000],
        pista: 'Un kilo son 1000 gramos.'
      };
    },
    redondeo: function () {
      var centena = Math.random() < 0.5;
      var x = centena ? al(110, 980) : al(12, 198);
      var paso = centena ? 100 : 10;
      if (x % paso === paso / 2) x += 1;
      return {
        texto: 'Redondea ' + x + ' a la ' + (centena ? 'centena' : 'decena') + ' más cercana.',
        grande: String(x), bien: Math.round(x / paso) * paso, extra: [paso, -paso, 2 * paso, -2 * paso],
        pista: 'Mira entre qué dos ' + (centena ? 'centenas' : 'decenas') + ' está y de cuál queda más cerca.'
      };
    },
    fraccion: function () {
      var d = K.elige([2, 3, 4, 5]);
      var r = al(2, 12);
      var nombre = { 2: 'la mitad', 3: 'un tercio', 4: 'un cuarto', 5: 'un quinto' }[d];
      return {
        texto: K.estado.nombre + ' se come ' + nombre + ' de sus ' + (d * r) + ' hojas. ¿Cuántas se come?',
        grande: nombre + ' de ' + (d * r), bien: r,
        pista: 'Reparte ' + (d * r) + ' en ' + d + ' partes iguales y quédate con una.'
      };
    }
  };

  function opciones(bien, extra) {
    var cambios = K.baraja([1, -1, 2, -2, 10, -10, 5, -5].concat(extra || []));
    var lista = [bien];
    for (var i = 0; i < cambios.length && lista.length < 4; i++) {
      var v = bien + cambios[i];
      if (v >= 0 && lista.indexOf(v) < 0) lista.push(v);
    }
    return lista.sort(function (a, b) { return a - b; });
  }

  function ronda(nivel) {
    var tipos = POR_NIVEL[nivel], lista = [], anterior = null;
    for (var i = 0; i < 5; i++) {
      var tipo;
      do { tipo = K.elige(tipos); } while (tipo === anterior);
      anterior = tipo;
      var q = GENERA[tipo](nivel);
      q.ops = opciones(q.bien, q.extra);
      lista.push(q);
    }
    return lista;
  }

  var raiz, s;

  function empezar() {
    s = { preguntas: ronda(K.estado.nivelMates), i: 0, mal: {}, ok: false, ganado: 0, hojas: 0, conFallo: 0, fin: false, resumen: null };
  }

  function elegir(n) {
    if (s.ok) return;
    var q = s.preguntas[s.i];
    var fallos = Object.keys(s.mal).length;
    if (n === q.bien) {
      s.ok = true;
      s.ganado = fallos ? 5 : 10;
      s.hojas += s.ganado;
      if (fallos) s.conFallo++;
      K.sumarHojas(s.ganado);
    } else {
      s.mal[n] = true;
    }
    dibujar();
  }

  function siguiente() {
    if (s.i < s.preguntas.length - 1) {
      s.i++; s.mal = {}; s.ok = false;
    } else {
      terminar();
    }
    dibujar();
  }

  function terminar() {
    var estrellas = s.conFallo === 0 ? 2 : 1;
    var aLaPrimera = 5 - s.conFallo;
    var nivel = K.estado.nivelMates, cambio = '';
    if (aLaPrimera >= 4 && nivel < NIVEL_MAX) { K.estado.nivelMates = nivel + 1; cambio = '¡Qué bien se te da! El próximo reto será un poco más difícil.'; }
    else if (aLaPrimera <= 1 && nivel > 1) { K.estado.nivelMates = nivel - 1; cambio = 'El próximo reto será un poco más fácil para practicar.'; }
    K.sumarEstrellas(estrellas);
    s.fin = true;
    s.resumen = { estrellas: estrellas, cambio: cambio };
  }

  function dibujar() {
    var q = s.preguntas[s.i];
    var fallos = Object.keys(s.mal).length > 0;
    var bocadillo = '¿A qué rama salto?';
    if (s.fin) bocadillo = '¡Gracias! Con tu ayuda me hago más grande.';
    else if (s.ok) bocadillo = '¡Bien! Salto a esa rama.';
    else if (fallos) bocadillo = '¡Casi! Mira la pista y prueba otra vez.';

    var h = '<section class="pantalla cielo">' + K.cabecera('Reto de mates', 'juegos', K.pastillaHojas('+' + s.hojas));
    h += '<div class="fila-entre"><div class="puntos">';
    for (var k = 0; k < 5; k++) {
      var hecho = s.fin || k < s.i || (k === s.i && s.ok);
      h += '<span class="' + (hecho ? 'hecho' : (k === s.i ? 'ahora' : '')) + '"></span>';
    }
    h += '</div><span class="sub" style="font-size:14px;font-weight:800">' + (s.fin ? '¡Terminado!' : 'Pregunta ' + (s.i + 1) + ' de 5') + '</span></div>';

    if (!s.fin) {
      h += '<div class="tarjeta pregunta"><p>' + K.h(q.texto) + '</p><p class="grande' + (q.grande.length > 9 ? ' largo' : '') + '">' + K.h(q.grande) + '</p></div>';
      h += '<div class="opciones">';
      q.ops.forEach(function (n) {
        var ok = s.ok && n === q.bien, mal = !!s.mal[n];
        h += '<button class="opcion' + (ok ? ' ok' : '') + (mal ? ' mal' : '') + '" data-op="' + n + '"><span>' + n + '</span>' + (ok ? K.ico.bien : '') + (mal ? K.ico.mal : '') + '</button>';
      });
      h += '</div><div class="respuesta" aria-live="polite">';
      if (s.ok) h += '<div class="fila-entre"><p class="premio">¡Muy bien! +' + s.ganado + ' hojas</p><button class="boton" data-sig>' + (s.i < 4 ? 'Siguiente' : 'Terminar') + '</button></div>';
      else if (fallos) h += '<div class="tarjeta pista">Pista: ' + K.h(q.pista) + '</div>';
      else h += '<p style="text-align:center;font-size:15px;font-weight:800">Toca la respuesta correcta.</p>';
      h += '</div>';
    } else {
      var e = s.resumen.estrellas;
      h += '<div class="tarjeta columna centro" style="padding:24px 18px;border-radius:24px">' + K.ico.estrella(64) +
        '<h2 class="titulo-grande">¡Reto completado!</h2>' +
        '<p>Has ganado ' + s.hojas + ' hojas y ' + e + (e === 1 ? ' estrella' : ' estrellas') + ' de sabiduría para ' + K.h(K.estado.nombre) + '.</p>' +
        (e === 2 ? '<p>¡Todas a la primera! Por eso te llevas una estrella extra.</p>' : '') +
        (s.resumen.cambio ? '<p>' + s.resumen.cambio + '</p>' : '') +
        '<a class="boton" style="width:100%" href="#/casa">Volver con ' + K.h(K.estado.nombre) + '</a>' +
        '<button class="boton blanco" style="width:100%" data-otra>Jugar otra vez</button></div>';
    }

    h += '<div class="pie-koala">' + K.koalaSVG({ ancho: 124, animo: fallos && !s.ok ? 'normal' : 'feliz', puesto: K.estado.puesto, trazo: 6 }) + '<div class="bocadillo">' + bocadillo + '</div></div>';
    h += '</section>';
    raiz.innerHTML = h;

    raiz.querySelectorAll('[data-op]').forEach(function (b) {
      b.addEventListener('click', function () { elegir(Number(b.getAttribute('data-op'))); });
    });
    var sig = raiz.querySelector('[data-sig]');
    if (sig) sig.addEventListener('click', siguiente);
    var otra = raiz.querySelector('[data-otra]');
    if (otra) otra.addEventListener('click', function () { empezar(); dibujar(); });
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.mates = {
    pintar: function (app) { raiz = app; empezar(); dibujar(); }
  };
  K.mates = { ronda: ronda, opciones: opciones, GENERA: GENERA };
})();
