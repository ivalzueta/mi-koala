// Fiesta de minijuegos: motor común (lienzo, tiempo, puntos, dedo y teclas) y menú.
// Cada minijuego se registra con K.mini({...}) en minijuegos1.js y minijuegos2.js.
(function () {
  var W = 390, H = 560, T = '#3B2A20';
  var LISTA = [];
  K.mini = function (d) { LISTA.push(d); };
  K.MINIS = LISTA;

  var raiz, canvas, ctx, raf, ultimo, g, def, fase, imgs, teclas = {};

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
    o.aviso = function () { o.rojo = 0.25; };
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
  }

  function bucle(t) {
    raf = requestAnimationFrame(bucle);
    var dt = Math.min(0.033, (t - ultimo) / 1000 || 0);
    ultimo = t;
    if (fase === 'jugando') {
      g.t += dt;
      if (g.rojo > 0) g.rojo -= dt;
      if (def.update) def.update(g, dt);
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
    fase = 'jugando';
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
    cartel('<h2 class="titulo-grande">' + (record ? '¡Nuevo récord!' : '¡Se acabó!') + '</h2>' +
      '<p>Has hecho ' + g.puntos + (g.puntos === 1 ? ' punto' : ' puntos') + ' y ganas ' + hojas + (hojas === 1 ? ' hoja' : ' hojas') + '. Tu récord es ' + (e.mini[def.id] || 0) + '.</p>' +
      '<button class="boton" data-otra>Otra vez</button>' +
      '<button class="boton blanco" data-sorpresa>Juego sorpresa</button>' +
      '<a class="enlace" href="#/fiesta">Ver todos los juegos</a>');
    raiz.querySelector('[data-otra]').addEventListener('click', empezar);
    raiz.querySelector('[data-sorpresa]').addEventListener('click', function () { cargar(otro(def.id)); });
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
    cartel('<h2 class="titulo-grande">' + def.nombre + '</h2><p>' + def.instr + '</p><button class="boton" data-empezar>¡Empezar!</button>');
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
    var d = LISTA.filter(function (x) { return x.id === id; })[0] || K.elige(LISTA);
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
    h += '<a class="boton" href="#/fiesta/sorpresa">Juego sorpresa</a>';
    h += '<div class="minis">';
    LISTA.forEach(function (d, i) {
      var r = K.estado.mini[d.id];
      h += '<a class="mini" href="#/fiesta/' + d.id + '"><span class="num" aria-hidden="true">' + (i + 1) + '</span>' +
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
