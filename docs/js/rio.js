// Acertijo de cruzar el río. Si un movimiento deja solos a dos que no pueden estarlo, no se hace y se explica por qué.
(function () {
  var raiz, s;
  var FILA = { dingo: 22, walabi: 108, cesta: 238 };
  var DIBUJO = {
    dingo: '<svg aria-hidden="true" width="44" height="44" viewBox="0 0 48 48"><g stroke="#3B2A20" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M9 20 7 5l12 7M39 20l2-15-12 7" fill="#E8A04C"/><path d="M8 22c0-8 7-12 16-12s16 4 16 12c0 9-8 20-16 20S8 31 8 22Z" fill="#E8A04C"/><path d="M17 30c0-4 3-6 7-6s7 2 7 6-3 9-7 9-7-5-7-9Z" fill="#FBE3C0"/><circle cx="17" cy="21" r="2" fill="#3B2A20"/><circle cx="31" cy="21" r="2" fill="#3B2A20"/><ellipse cx="24" cy="29" rx="3" ry="2" fill="#3B2A20"/></g></svg>',
    walabi: '<svg aria-hidden="true" width="44" height="44" viewBox="0 0 48 48"><g stroke="#3B2A20" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="15" cy="12" rx="5" ry="11" fill="#C9A27E" transform="rotate(-14 15 12)"/><ellipse cx="33" cy="12" rx="5" ry="11" fill="#C9A27E" transform="rotate(14 33 12)"/><ellipse cx="24" cy="29" rx="14" ry="13" fill="#C9A27E"/><circle cx="18" cy="26" r="2" fill="#3B2A20"/><circle cx="30" cy="26" r="2" fill="#3B2A20"/><ellipse cx="24" cy="32" rx="2.500" ry="2" fill="#3B2A20"/><path d="M21 37q3 2 6 0" fill="none"/></g></svg>',
    cesta: '<svg aria-hidden="true" width="44" height="44" viewBox="0 0 48 48"><g stroke="#3B2A20" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="17" cy="16" rx="9" ry="5" fill="#5DB075" transform="rotate(-30 17 16)"/><ellipse cx="31" cy="16" rx="9" ry="5" fill="#3E9B5F" transform="rotate(30 31 16)"/><ellipse cx="24" cy="13" rx="5" ry="9" fill="#5DB075"/><path d="M7 22h34l-4 20H11Z" fill="#D9A45B"/><path d="M10 30h28M12 37h24" fill="none"/></g></svg>'
  };
  var NOMBRE = { dingo: 'Dingo', walabi: 'Walabí', cesta: 'Hojas' };

  function inicio() {
    return {
      pos: { dingo: 'L', walabi: 'L', cesta: 'L' }, balsa: 'L', carga: null, viajes: 0, ganado: false,
      tono: '', mensaje: 'Toca a quien quieras subir a la balsa y después pulsa Cruzar el río.'
    };
  }

  function decir(tono, mensaje) { s.tono = tono; s.mensaje = mensaje; }

  function tocar(k) {
    if (s.ganado) return;
    if (s.carga === k) { s.carga = null; decir('', 'Lo has bajado de la balsa.'); }
    else if (s.pos[k] !== s.balsa) decir('aviso', 'La balsa está en la otra orilla. Cruza primero.');
    else { s.carga = k; decir('', 'Sube a la balsa. ¿Cruzamos?'); }
    colocar();
  }

  function cruzar() {
    if (s.ganado) return;
    function aqui(k) { return s.pos[k] === s.balsa && s.carga !== k; }
    if (aqui('dingo') && aqui('walabi')) { decir('aviso', 'Si te vas ahora, el dingo asustará al walabí. Piensa otra forma.'); colocar(); return; }
    if (aqui('walabi') && aqui('cesta')) { decir('aviso', 'Si te vas ahora, el walabí se comerá las hojas. Piensa otra forma.'); colocar(); return; }
    var otra = s.balsa === 'L' ? 'R' : 'L';
    if (s.carga) s.pos[s.carga] = otra;
    s.balsa = otra;
    s.carga = null;
    s.viajes++;
    if (s.pos.dingo === 'R' && s.pos.walabi === 'R' && s.pos.cesta === 'R') {
      s.ganado = true;
      var premio;
      if (!K.estado.rioResuelto) {
        K.estado.rioResuelto = true;
        K.sumarEstrellas(3);
        premio = 'Ganas 3 estrellas de sabiduría.';
      } else {
        K.sumarHojas(5);
        premio = 'Ganas 5 hojas por repetirlo.';
      }
      decir('bien', '¡Lo has conseguido en ' + s.viajes + ' viajes! ' + premio + (s.viajes === 7 ? ' Y con los mínimos viajes posibles.' : ''));
    } else {
      decir('', '¡Al otro lado! ¿Y ahora qué?');
    }
    colocar();
  }

  // Mueve las piezas a su sitio sin volver a pintar la pantalla, para que se vea el desplazamiento.
  function colocar() {
    var balsa = s.balsa === 'L' ? 'calc(50% - 97px)' : 'calc(50% - 31px)';
    raiz.querySelector('.balsa').style.left = balsa;
    raiz.querySelector('.luma').style.left = balsa;
    ['dingo', 'walabi', 'cesta'].forEach(function (k) {
      var b = raiz.querySelector('[data-p="' + k + '"]');
      if (s.carga === k) {
        b.style.left = s.balsa === 'L' ? 'calc(50% - 35px)' : 'calc(50% + 31px)';
        b.style.top = '150px';
      } else {
        b.style.left = s.pos[k] === 'L' ? '5px' : 'calc(100% - 69px)';
        b.style.top = FILA[k] + 'px';
      }
      b.setAttribute('aria-label', NOMBRE[k] + (s.carga === k ? ', en la balsa' : (s.pos[k] === 'L' ? ', en la orilla de salida' : ', en la otra orilla')));
    });
    var m = raiz.querySelector('.mensaje');
    m.className = 'tarjeta mensaje ' + s.tono;
    m.textContent = s.mensaje;
    raiz.querySelector('[data-viajes]').textContent = 'Viajes: ' + s.viajes;
    raiz.querySelector('[data-fin]').style.display = s.ganado ? 'flex' : 'none';
    raiz.querySelector('[data-mandos]').style.display = s.ganado ? 'none' : 'flex';
  }

  function pintar(app) {
    raiz = app;
    s = inicio();
    var h = '<section class="pantalla">' + K.cabecera('Cruzar el río', 'juegos', '<div class="pastilla" style="font-size:14px" data-viajes></div>');
    h += '<div class="tarjeta" style="font-size:14px;line-height:20px">' + K.h(K.estado.nombre) +
      ' quiere llevar al otro lado a un dingo, un walabí y una cesta de hojas. En la balsa solo cabe ' + K.h(K.estado.nombre) +
      ' con una cosa. Si no está delante, el dingo asusta al walabí y el walabí se come las hojas.</div>';
    h += '<div class="rio"><div class="orilla izq"></div><div class="orilla der"></div><div class="balsa"></div>';
    h += '<svg class="luma" role="img" aria-label="' + K.h(K.estado.nombre) + ' en la balsa" viewBox="0 14 240 156" width="62" height="40">' +
      '<g stroke="#3B2A20" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><circle cx="58" cy="66" r="40" fill="#9FB0BF"/><circle cx="182" cy="66" r="40" fill="#9FB0BF"/><circle cx="58" cy="68" r="20" fill="#F6D5C9" stroke="none"/><circle cx="182" cy="68" r="20" fill="#F6D5C9" stroke="none"/><ellipse cx="120" cy="98" rx="74" ry="62" fill="#9FB0BF"/><circle cx="90" cy="94" r="12" fill="#3B2A20" stroke="none"/><circle cx="150" cy="94" r="12" fill="#3B2A20" stroke="none"/><ellipse cx="120" cy="112" rx="15" ry="20" fill="#3B2A20" stroke="none"/><path d="M106 140Q120 150 134 140" fill="none"/></g></svg>';
    ['dingo', 'walabi', 'cesta'].forEach(function (k) {
      h += '<button class="pasajero" data-p="' + k + '">' + DIBUJO[k] + '<span>' + NOMBRE[k] + '</span></button>';
    });
    h += '</div>';
    h += '<div class="tarjeta mensaje" aria-live="polite"></div>';
    h += '<div class="fila" data-mandos><button class="boton crece" data-cruzar>Cruzar el río</button><button class="boton blanco" data-pista>Pista</button></div>';
    h += '<div class="fila" data-fin><a class="boton crece" href="#/casa">Volver con ' + K.h(K.estado.nombre) + '</a></div>';
    h += '<button class="enlace" data-nuevo>Empezar de nuevo</button>';
    h += '</section>';
    app.innerHTML = h;

    app.querySelectorAll('[data-p]').forEach(function (b) {
      b.addEventListener('click', function () { tocar(b.getAttribute('data-p')); });
    });
    app.querySelector('[data-cruzar]').addEventListener('click', cruzar);
    app.querySelector('[data-pista]').addEventListener('click', function () {
      decir('aviso', 'Pista: a veces hay que traer de vuelta a alguien que ya habías cruzado.');
      colocar();
    });
    app.querySelector('[data-nuevo]').addEventListener('click', function () { s = inicio(); colocar(); });
    colocar();
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.rio = { pintar: pintar };
})();
