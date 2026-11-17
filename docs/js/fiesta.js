// Fiesta de minijuegos: motor común (lienzo, tiempo, puntos, dedo y teclas) y menú.
// Cada minijuego se registra con K.mini({...}) en minijuegos1.js y minijuegos2.js.
(function () {
  var W = 390, H = 560, T = '#3B2A20';
  var LISTA = [];
  K.mini = function (d) { LISTA.push(d); };
  K.MINIS = LISTA;

  var raiz, canvas, ctx, raf, ultimo, g, def, fase, imgs, teclas = {};
  var cuenta = 0, antes = 0, chispas = [], ultimoPop = 0, combo = 0, mejorCombo = 0, ultimoPunto = -9, copa = null;
  function son(t, n) { if (K.son) K.son(t, n); }

  // Medallas: bronce con la mitad de la meta, plata con la meta, oro con un 30 % más.
  function medalla(p, meta) {
    if (p >= Math.ceil(meta * 1.3)) return 3;
    if (p >= meta) return 2;
    if (p >= Math.ceil(meta / 2)) return 1;
    return 0;
  }
  var METAL = [null, { nombre: 'bronce', color: '#D9915A' }, { nombre: 'plata', color: '#D5DEE6' }, { nombre: 'oro', color: '#FFC53D' }];
  function icoMedalla(n, t) {
    t = t || 30;
    if (!n) return '<svg aria-hidden="true" width="' + t + '" height="' + t + '" viewBox="0 0 24 24"><circle cx="12" cy="14" r="7" fill="none" stroke="#C9BBA8" stroke-width="2" stroke-dasharray="3 3"/></svg>';
    return '<svg role="img" aria-label="Medalla de ' + METAL[n].nombre + '" width="' + t + '" height="' + t + '" viewBox="0 0 24 24">' +
      '<path d="M7 1h4l2 6H9ZM13 1h4l-2 6h-4Z" fill="#F2664B" stroke="' + T + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="15" r="7.5" fill="' + METAL[n].color + '" stroke="' + T + '" stroke-width="2"/>' +
      '<path d="M12 11l1.2 2.500 2.700.3-2 1.900.5 2.700L12 17.100 9.600 18.400l.5-2.700-2-1.900 2.700-.3Z" fill="#FFFFFF" stroke="' + T + '" stroke-width="1" stroke-linejoin="round"/></svg>';
  }

  // Rivales de la Copa del bosque
  var RIVALES = [
    { nombre: 'Wombi', animal: 'wombat', color: '#A9825F', nivel: 0.95 },
    { nombre: 'Saltarina', animal: 'canguro', color: '#E8A25A', nivel: 1.05 },
    { nombre: 'Pico', animal: 'ornitorrinco', color: '#6FA9A2', nivel: 0.85 }
  ];
  function caraRival(r, t) {
    t = t || 40;
    var s = '<svg role="img" aria-label="' + r.nombre + '" width="' + t + '" height="' + t + '" viewBox="0 0 40 40"><g stroke="' + T + '" stroke-width="2.500" stroke-linejoin="round">';
    if (r.animal === 'canguro') s += '<ellipse cx="11" cy="9" rx="4" ry="9" fill="' + r.color + '"/><ellipse cx="29" cy="9" rx="4" ry="9" fill="' + r.color + '"/>';
    else s += '<circle cx="9" cy="12" r="5" fill="' + r.color + '"/><circle cx="31" cy="12" r="5" fill="' + r.color + '"/>';
    s += '<circle cx="20" cy="23" r="14" fill="' + r.color + '"/>';
    s += '<circle cx="14.500" cy="20" r="2.200" fill="' + T + '" stroke="none"/><circle cx="25.500" cy="20" r="2.200" fill="' + T + '" stroke="none"/>';
    if (r.animal === 'ornitorrinco') s += '<ellipse cx="20" cy="30" rx="9" ry="5" fill="#4A4A55"/>';
    else s += '<ellipse cx="20" cy="27" rx="4" ry="3" fill="' + T + '" stroke="none"/><path d="M16 31q4 3 8 0" fill="none"/>';
    return s + '</g></svg>';
  }
  function caraKoala(t) { return K.koalaSVG({ ancho: t || 40, puesto: K.estado.puesto, trazo: 9 }); }

  function nuevaCopa() {
    return {
      juegos: K.baraja(LISTA).slice(0, 3), i: 0,
      total: { yo: 0, r0: 0, r1: 0, r2: 0 }
    };
  }

  function imagen(svg) {
    var i = new Image();
    i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return i;
  }

  function trazar(color, borde) {
    ctx.fillStyle = color;
    ctx.fill();
    if (borde !== false) ctx.stroke();
  }

  // Lo que recibe cada minijuego: estado común y utilidades de dibujo.
  function nuevoG() {
    var o = { W: W, H: H, T: T, t: 0, puntos: 0, px: W / 2, py: H / 2, abajo: false, rojo: 0, s: {}, al: K.al, elige: K.elige, baraja: K.baraja };
    o.r = function (a, b) { return a + Math.random() * (b - a); };
    o.suma = function (n) { o.puntos = Math.max(0, o.puntos + n); };
    o.aviso = function () { if (o.rojo <= 0) son('mal'); o.rojo = 0.25; };
    o.acabar = function () { terminar(); };
    o.dir = function () {
      if (teclas.ArrowLeft) return -1;
      if (teclas.ArrowRight) return 1;
      if (o.abajo) return o.px < W / 2 ? -1 : 1;
      return 0;
    };
    // Mueve x hacia el dedo (o con las flechas) sin salirse de la pantalla.
    o.sigue = function (x, dt, vel) {
      if (teclas.ArrowLeft) x -= vel * dt;
      else if (teclas.ArrowRight) x += vel * dt;
      else if (o.abajo) {
        var d = o.px - x, paso = vel * 1.8 * dt;
        x += Math.abs(d) < paso ? d : (d > 0 ? paso : -paso);
      }
      return Math.max(36, Math.min(W - 36, x));
    };
    o.circ = function (x, y, r, color, borde) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); trazar(color, borde); };
    o.elip = function (x, y, rx, ry, color, giro, borde) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, giro || 0, 0, Math.PI * 2); trazar(color, borde); };
    o.rect = function (x, y, w, h, r, color, borde) {
      ctx.beginPath();
      if (r) {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      } else ctx.rect(x, y, w, h);
      trazar(color, borde);
    };
    o.tri = function (x1, y1, x2, y2, x3, y3, color) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); trazar(color); };
    o.linea = function (x1, y1, x2, y2, ancho, color) {
      ctx.save(); ctx.lineWidth = ancho || 3; ctx.strokeStyle = color || T;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
    };
    o.txt = function (s, x, y, tam, color, alin) {
      ctx.font = '800 ' + (tam || 22) + 'px "Baloo 2", "Nunito", ui-rounded, "Segoe UI", sans-serif';
      ctx.textAlign = alin || 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = color || T; ctx.fillText(s, x, y);
    };
    o.hoja = function (x, y, t, giro, color) { o.elip(x, y, t, t * 0.5, color || '#5DB075', giro === undefined ? -0.78 : giro); };
    o.suelo = function (y, color) { ctx.fillStyle = color || '#8CCB8A'; ctx.fillRect(0, y, W, H - y); o.linea(0, y, W, y, 3); };
    // Koala con los pies en (x, y). salto = brazos arriba; giro en radianes.
    o.koala = function (x, y, w, salto, giro) {
      var im = salto ? imgs.s : imgs.q, h = w * 250 / 240;
      ctx.save(); ctx.translate(x, y); if (giro) ctx.rotate(giro);
      if (im.complete && im.naturalWidth) ctx.drawImage(im, -w / 2, -h, w, h);
      else o.circ(0, -h / 2, w / 2, '#9FB0BF');
      ctx.restore();
    };
    return o;
  }

  function medir() {
    var caja = raiz.querySelector('.lienzo').getBoundingClientRect();
    var k = Math.min(caja.width / W, caja.height / H);
    var dpr = window.devicePixelRatio || 1;
    canvas.style.width = Math.floor(W * k) + 'px';
    canvas.style.height = Math.floor(H * k) + 'px';
    canvas.width = Math.round(W * k * dpr);
    canvas.height = Math.round(H * k * dpr);
  }

  function pintarLienzo() {
    var k = canvas.width / W;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.fillStyle = def.fondo || '#BFE6F2';
    ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 3; ctx.strokeStyle = T; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    def.draw(g);
    if (g.rojo > 0) { ctx.fillStyle = 'rgba(217,80,47,0.28)'; ctx.fillRect(0, 0, W, H); }
    // Números que saltan al ganar puntos
    chispas.forEach(function (c) {
      ctx.globalAlpha = Math.max(0, c.vida / 0.8);
      ctx.lineWidth = 5; ctx.strokeStyle = '#FFFFFF';
      ctx.font = '800 ' + (c.tam || 30) + 'px "Baloo 2", "Nunito", ui-rounded, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeText(c.txt, c.x, c.y); ctx.fillStyle = c.color; ctx.fillText(c.txt, c.x, c.y);
      ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = T;
    });
    // Cuenta atrás 3, 2, 1, ¡Ya!
    if (fase === 'cuenta') {
      ctx.fillStyle = 'rgba(255,247,227,0.55)'; ctx.fillRect(0, 0, W, H);
      var n = Math.ceil(cuenta), f = cuenta - Math.floor(cuenta);
      var r = 64 + 30 * f;
      g.circ(W / 2, H / 2, r, '#FFC53D');
      g.txt(n > 0 ? String(n) : '¡Ya!', W / 2, H / 2 + 4, n > 0 ? 80 + 30 * f : 52);
    }
  }

  function bucle(t) {
    raf = requestAnimationFrame(bucle);
    var dt = Math.min(0.033, (t - ultimo) / 1000 || 0);
    ultimo = t;
    chispas = chispas.filter(function (c) { c.vida -= dt; c.y -= 70 * dt; return c.vida > 0; });
    if (fase === 'cuenta') {
      var antesN = Math.ceil(cuenta);
      cuenta -= dt;
      if (Math.ceil(cuenta) < antesN && cuenta > 0) son('bip');
      if (cuenta <= 0) { fase = 'jugando'; son('ya'); }
    }
    if (fase === 'jugando') {
      g.t += dt;
      if (g.rojo > 0) g.rojo -= dt;
      if (def.update) def.update(g, dt);
      if (g.puntos !== antes) {
        var d = g.puntos - antes;
        chispas.push({ txt: (d > 0 ? '+' : '') + d, x: Math.max(30, Math.min(W - 30, g.px)), y: Math.max(40, g.py - 30), vida: 0.8, color: d > 0 ? '#3E9B5F' : '#D9502F' });
        if (d > 0) {
          combo = g.t - ultimoPunto < 1.3 ? combo + 1 : 1;
          ultimoPunto = g.t;
          if (combo > mejorCombo) mejorCombo = combo;
          if (combo >= 3 && combo % 1 === 0) {
            chispas = chispas.filter(function (c) { return !c.combo; });
            chispas.push({ txt: '¡Combo x' + combo + '!', x: W / 2, y: 70, vida: 0.9, color: combo >= 8 ? '#D9502F' : '#E89A00', combo: true, tam: 30 + Math.min(14, combo * 2) });
          }
          if (t - ultimoPop > 70) { son('pop', combo); ultimoPop = t; }
        } else {
          combo = 0;
          if (g.rojo <= 0) son('mal');
        }
        antes = g.puntos;
      }
      if (fase === 'jugando' && g.t >= def.dur) terminar();
      raiz.querySelector('[data-puntos]').textContent = g.puntos;
      raiz.querySelector('[data-tiempo]').style.width = Math.max(0, 100 - g.t / def.dur * 100) + '%';
    }
    pintarLienzo();
  }

  function cartel(html) {
    var c = raiz.querySelector('.cartel');
    c.style.display = html ? 'flex' : 'none';
    c.innerHTML = html || '';
  }

  function preparar() {
    g = nuevoG();
    def.init(g);
  }

  function empezar() {
    preparar();
    cartel('');
    chispas = []; antes = 0; combo = 0; mejorCombo = 0; ultimoPunto = -9;
    cuenta = 3; fase = 'cuenta';
    son('bip');
  }

  function terminar() {
    if (fase !== 'jugando') return;
    fase = 'fin';
    var hojas = g.puntos > 0 ? Math.max(1, Math.round(10 * Math.min(1, g.puntos / def.meta))) : 0;
    var e = K.estado;
    var record = g.puntos > (e.mini[def.id] || 0);
    if (record) e.mini[def.id] = g.puntos;
    K.sumarHojas(hojas);
    K.subirNecesidad('diversion', 8);
    var med = medalla(g.puntos, def.meta);
    var genial = med >= 2;
    var textoCombo = mejorCombo >= 3 ? ' Mejor combo: x' + mejorCombo + '.' : '';
    if (copa) { finCopa(hojas, med); return; }
    if (record || genial) { son('fanfarria'); if (K.confeti) K.confeti(record ? 90 : 50); }
    cartel('<div class="fila-centro">' + K.koalaSVG({ ancho: 84, salto: record || genial, puesto: K.estado.puesto, trazo: 7, clase: 'salta' }) +
      '<span class="medalla-grande ' + (med ? 'aparece' : '') + '">' + icoMedalla(med, 64) + '</span></div>' +
      '<h2 class="titulo-grande">' + (med === 3 ? '¡Medalla de oro!' : record ? '¡Nuevo récord!' : med ? '¡Medalla de ' + METAL[med].nombre + '!' : '¡Se acabó!') + '</h2>' +
      '<p>Has hecho ' + g.puntos + (g.puntos === 1 ? ' punto' : ' puntos') + ' y ganas ' + hojas + (hojas === 1 ? ' hoja' : ' hojas') + '.' + textoCombo + '</p>' +
      '<p class="metas">' + metas(def) + '</p>' +
      '<button class="boton" data-otra>Otra vez</button>' +
      '<button class="boton blanco" data-sorpresa>Juego sorpresa</button>' +
      '<a class="enlace" href="#/fiesta">Ver todos los juegos</a>');
    raiz.querySelector('[data-otra]').addEventListener('click', empezar);
    raiz.querySelector('[data-sorpresa]').addEventListener('click', function () { cargar(otro(def.id)); });
  }

  // Lo que hace falta para cada medalla, marcando las conseguidas.
  function metas(d) {
    var r = K.estado.mini[d.id] || 0;
    return [1, 2, 3].map(function (n) {
      var falta = n === 3 ? Math.ceil(d.meta * 1.3) : n === 2 ? d.meta : Math.ceil(d.meta / 2);
      return '<span class="meta' + (r >= falta ? ' hecha' : '') + '">' + icoMedalla(n, 22) + falta + '</span>';
    }).join('');
  }

  // Copa del bosque: 3 juegos seguidos contra 3 rivales. Cada juego da 3, 2, 1 o 0 bellotas según el puesto.
  function puntosRival(r, d) {
    return Math.max(0, Math.round(d.meta * r.nivel * (0.55 + Math.random() * 0.5)));
  }

  function filaRival(cara, nombre, pts, extra, yo) {
    return '<li class="' + (yo ? 'yo' : '') + '">' + cara + '<b>' + nombre + '</b><span>' + pts + '</span>' + (extra || '') + '</li>';
  }

  function finCopa(hojas, med) {
    var lista = [{ cara: caraKoala(34), nombre: K.h(K.estado.nombre), pts: g.puntos, clave: 'yo', yo: true }];
    RIVALES.forEach(function (r, i) { lista.push({ cara: caraRival(r, 34), nombre: r.nombre, pts: puntosRival(r, def), clave: 'r' + i }); });
    // Gana el koala en caso de empate: es su fiesta.
    lista.sort(function (a, b) { return b.pts - a.pts || (b.yo ? 1 : 0) - (a.yo ? 1 : 0); });
    var BELLOTAS = [3, 2, 1, 0];
    var puesto = 0;
    lista.forEach(function (x, i) { x.gana = BELLOTAS[i]; copa.total[x.clave] += x.gana; if (x.yo) puesto = i; });
    if (puesto === 0) { son('fanfarria'); if (K.confeti) K.confeti(50); } else son(puesto === 1 ? 'bien' : 'mal');

    var ultimo = copa.i >= copa.juegos.length - 1;
    var h = '<h2 class="titulo-grande">' + ['¡Has ganado este juego!', '¡Segundo puesto!', 'Tercer puesto', 'Cuarto puesto... ¡a por el siguiente!'][puesto] + '</h2>';
    h += '<ol class="ranking">' + lista.map(function (x) {
      return filaRival(x.cara, x.nombre, x.pts + ' pts', '<em>+' + x.gana + ' ' + icoBellota(18) + '</em>', x.yo);
    }).join('') + '</ol>';
    h += '<p>Ganas ' + hojas + (hojas === 1 ? ' hoja' : ' hojas') + '.</p>';
    h += '<button class="boton" data-sigue>' + (ultimo ? 'Ver el podio' : 'Siguiente juego (' + (copa.i + 2) + ' de 3)') + '</button>';
    cartel(h);
    raiz.querySelector('[data-sigue]').addEventListener('click', function () {
      if (ultimo) podio();
      else { copa.i++; cargar(copa.juegos[copa.i]); }
    });
  }

  function icoBellota(t) {
    return '<svg role="img" aria-label="bellotas" width="' + t + '" height="' + t + '" viewBox="0 0 24 24"><path d="M6 11c0 6 3 10 6 11 3-1 6-5 6-11Z" fill="#C7894B" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/><path d="M4 11c0-4 4-6 8-6s8 2 8 6Z" fill="#8A5A33" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/><path d="M12 5V2" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  function podio() {
    var lista = [{ cara: caraKoala(54), nombre: K.h(K.estado.nombre), b: copa.total.yo, yo: true }];
    RIVALES.forEach(function (r, i) { lista.push({ cara: caraRival(r, 54), nombre: r.nombre, b: copa.total['r' + i] }); });
    lista.sort(function (a, b) { return b.b - a.b || (b.yo ? 1 : 0) - (a.yo ? 1 : 0); });
    var puesto = lista.findIndex(function (x) { return x.yo; });
    var premio = [15, 8, 4, 2][puesto];
    K.sumarHojas(premio);
    if (puesto === 0) {
      K.estado.copas = (K.estado.copas || 0) + 1;
      K.guardar();
      son('fanfarria');
      if (K.confeti) K.confeti(160);
    } else son('bien');
    // Podio: 2.º a la izquierda, 1.º en el centro, 3.º a la derecha.
    var orden = [lista[1], lista[0], lista[2]], alturas = [70, 100, 50], numeros = [2, 1, 3];
    var h = '<h2 class="titulo-grande">' + (puesto === 0 ? '¡' + K.h(K.estado.nombre) + ' gana la Copa del bosque!' : ['', '¡Segundo en la Copa!', '¡Tercero en la Copa!', 'Esta vez no ha habido suerte'][puesto]) + '</h2>';
    h += '<div class="podio">' + orden.map(function (x, i) {
      return '<div class="peana' + (x.yo ? ' yo' : '') + '"><div class="' + (numeros[i] === 1 ? 'salta' : '') + '">' + x.cara + '</div><b>' + x.nombre + '</b>' +
        '<div class="bloque" style="height:' + alturas[i] + 'px"><span>' + numeros[i] + '</span><small>' + x.b + ' ' + icoBellota(14) + '</small></div></div>';
    }).join('') + '</div>';
    if (puesto === 3) h += '<p>' + lista[3].nombre + ' ha quedado cuarto con ' + lista[3].b + ' bellotas.</p>';
    h += '<p>Premio: ' + premio + ' hojas.' + (K.estado.copas ? ' Copas ganadas: ' + K.estado.copas + '.' : '') + '</p>';
    h += '<button class="boton" data-otra-copa>Otra copa</button><a class="enlace" href="#/fiesta">Ver todos los juegos</a>';
    cartel(h);
    raiz.querySelector('[data-otra-copa]').addEventListener('click', function () { copa = nuevaCopa(); cargar(copa.juegos[0]); });
  }

  function otro(menosEste) {
    var resto = LISTA.filter(function (d) { return d.id !== menosEste; });
    return K.elige(resto);
  }

  function cargar(d) {
    def = d;
    if (!def.dur) def.dur = 25;
    raiz.querySelector('[data-nombre]').textContent = def.nombre;
    raiz.querySelector('[data-instr]').textContent = def.instr;
    fase = 'espera';
    preparar();
    raiz.querySelector('[data-puntos]').textContent = '0';
    raiz.querySelector('[data-tiempo]').style.width = '100%';
    var intro = '<h2 class="titulo-grande">' + def.nombre + '</h2><p>' + def.instr + '</p>';
    if (copa) {
      intro = '<p class="copa-etiqueta">' + icoBellota(20) + ' Copa del bosque · Juego ' + (copa.i + 1) + ' de 3</p>' + intro +
        '<ol class="ranking">' + filaRival(caraKoala(30), K.h(K.estado.nombre), copa.total.yo + ' ' + icoBellota(16), '', true) +
        RIVALES.map(function (r, i) { return filaRival(caraRival(r, 30), r.nombre, copa.total['r' + i] + ' ' + icoBellota(16)); }).join('') + '</ol>';
    } else {
      intro += '<p class="metas">' + metas(def) + '</p>';
    }
    cartel(intro + '<button class="boton" data-empezar>¡Empezar!</button>');
    raiz.querySelector('[data-empezar]').addEventListener('click', empezar);
  }

  function punto(e) {
    var r = canvas.getBoundingClientRect();
    g.px = (e.clientX - r.left) / r.width * W;
    g.py = (e.clientY - r.top) / r.height * H;
  }
  function tocar(x, y) { if (fase === 'jugando' && def.tap) def.tap(g, x, y); }
  function alPulsar(e) {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft') { teclas.ArrowLeft = true; tocar(W * 0.25, H / 2); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { teclas.ArrowRight = true; tocar(W * 0.75, H / 2); e.preventDefault(); }
    else if (e.key === ' ') { tocar(W / 2, H / 2); e.preventDefault(); }
  }
  function alSoltar(e) { teclas[e.key] = false; }

  function jugar(app, id) {
    raiz = app;
    app.innerHTML = '<section class="pantalla fiesta">' +
      '<header class="cab"><a class="circulo" href="#/fiesta" aria-label="Volver a los juegos">' + K.ico.atras + '</a><h1 data-nombre></h1>' +
      '<div class="pastilla">' + K.ico.estrella() + '<span data-puntos>0</span></div></header>' +
      '<div class="barra" aria-hidden="true"><i data-tiempo style="width:100%"></i></div>' +
      '<div class="lienzo"><canvas></canvas><div class="tarjeta cartel"></div></div>' +
      '<p class="instr" data-instr></p></section>';
    canvas = app.querySelector('canvas');
    ctx = canvas.getContext('2d');
    imgs = {
      q: imagen(K.koalaSVG({ ancho: 200, puesto: K.estado.puesto, trazo: 7 })),
      s: imagen(K.koalaSVG({ ancho: 200, puesto: K.estado.puesto, trazo: 7, salto: true }))
    };
    teclas = {};
    medir();
    copa = id === 'copa' ? nuevaCopa() : null;
    var d = copa ? copa.juegos[0] : LISTA.filter(function (x) { return x.id === id; })[0] || K.elige(LISTA);
    cargar(d);

    canvas.addEventListener('pointerdown', function (e) {
      punto(e); g.abajo = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
      tocar(g.px, g.py);
    });
    canvas.addEventListener('pointermove', punto);
    ['pointerup', 'pointercancel'].forEach(function (n) {
      canvas.addEventListener(n, function () { g.abajo = false; });
    });
    window.addEventListener('keydown', alPulsar);
    window.addEventListener('keyup', alSoltar);
    window.addEventListener('resize', medir);
    ultimo = performance.now();
    raf = requestAnimationFrame(bucle);
  }

  function menu(app) {
    var h = '<section class="pantalla">' + K.cabecera('Fiesta de juegos', 'juegos');
    var oros = 0;
    LISTA.forEach(function (d) { if (medalla(K.estado.mini[d.id] || 0, d.meta) === 3) oros++; });
    h += '<a class="copa-boton" href="#/fiesta/copa">' +
      '<span class="caras">' + caraKoala(40) + RIVALES.map(function (r) { return caraRival(r, 36); }).join('') + '</span>' +
      '<span class="datos"><b>Copa del bosque</b><span>3 juegos contra Wombi, Saltarina y Pico' + (K.estado.copas ? ' · Copas: ' + K.estado.copas : '') + '</span></span></a>';
    h += '<div class="fila"><a class="boton" href="#/fiesta/sorpresa" style="flex:1">Juego sorpresa</a>' +
      '<div class="pastilla">' + icoMedalla(3, 22) + oros + ' / ' + LISTA.length + '</div></div>';
    h += '<div class="minis">';
    LISTA.forEach(function (d) {
      var r = K.estado.mini[d.id];
      h += '<a class="mini" href="#/fiesta/' + d.id + '"><span class="med">' + icoMedalla(medalla(r || 0, d.meta), 34) + '</span>' +
        '<span class="datos"><b>' + d.nombre + '</b><span>' + (r ? 'Récord: ' + r : 'Sin jugar') + '</span></span></a>';
    });
    h += '</div></section>';
    app.innerHTML = h;
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.fiesta = {
    pintar: function (app, sub) { if (sub) jugar(app, sub); else { raf = null; menu(app); } },
    salir: function () {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      window.removeEventListener('keydown', alPulsar);
      window.removeEventListener('keyup', alSoltar);
      window.removeEventListener('resize', medir);
    }
  };
})();
