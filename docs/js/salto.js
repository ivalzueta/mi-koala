// Koala saltarín: el koala rebota solo; se mueve tocando a los lados, inclinando el móvil o con las flechas.
(function () {
  var W = 390;                // ancho lógico del juego; el alto depende de la pantalla
  var GRAVEDAD = 1800, SALTO = -820, SUPERSALTO = -1250, VELOCIDAD = 330;
  var MAX_HOJAS = 25;

  var raiz, canvas, ctx, H, esc, dpr, raf, ultimo;
  var j, plats, nubes, camY, inicioY, subida, hojas, fase;
  var teclas = {}, toque = 0, inclinacion = 0;
  var imgQuieto, imgSalto;

  function imagen(svg) {
    var i = new Image();
    i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return i;
  }

  function medir() {
    var r = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    esc = r.width / W;
    H = r.height / esc;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
  }

  function nuevaPartida() {
    camY = 0; hojas = 0; subida = 0;
    j = { x: W / 2 - 33, y: H - 190, vx: 0, vy: 0, w: 66, h: 69 };
    inicioY = j.y;
    plats = [{ x: W / 2 - 46, y: H - 90, w: 92, tipo: 'rama' }];
    nubes = [];
    for (var i = 0; i < 5; i++) nubes.push({ x: K.al(0, W - 80), y: i * 190 + K.al(0, 80) });
    generar();
  }

  function generar() {
    var arriba = plats[plats.length - 1].y;
    while (arriba > camY - 200) {
      arriba -= K.al(62, 96 + Math.min(40, Math.floor(subida / 250)));
      plats.push({
        x: K.al(10, W - 102), y: arriba, w: 92,
        tipo: Math.random() < 0.13 ? 'brote' : 'rama',
        hoja: Math.random() < 0.4
      });
    }
  }

  function direccion() {
    if (teclas.ArrowLeft) return -1;
    if (teclas.ArrowRight) return 1;
    if (toque) return toque;
    return Math.abs(inclinacion) > 0.08 ? inclinacion : 0;
  }

  function paso(dt) {
    j.vx += (direccion() * VELOCIDAD - j.vx) * Math.min(1, dt * 12);
    j.vy += GRAVEDAD * dt;
    var piesAntes = j.y + j.h;
    j.x += j.vx * dt;
    j.y += j.vy * dt;
    if (j.x < -j.w / 2) j.x += W;
    if (j.x > W - j.w / 2) j.x -= W;

    var cx = j.x + j.w / 2;
    var pies = j.y + j.h;
    for (var i = 0; i < plats.length; i++) {
      var p = plats[i];
      if (j.vy > 0 && piesAntes <= p.y + 2 && pies >= p.y && cx > p.x - 12 && cx < p.x + p.w + 12) {
        j.y = p.y - j.h;
        j.vy = p.tipo === 'brote' ? SUPERSALTO : SALTO;
      }
      if (p.hoja && !p.cogida && Math.abs(cx - (p.x + p.w / 2)) < 38 && Math.abs(j.y + j.h / 2 - (p.y - 30)) < 46) {
        p.cogida = true;
        hojas++;
      }
    }

    if (j.y < camY + H * 0.42) camY = j.y - H * 0.42;
    subida = Math.max(subida, inicioY - j.y);
    generar();
    plats = plats.filter(function (p) { return p.y < camY + H + 60; });
    if (j.y > camY + H + 60) terminar();
  }

  function redondo(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hojaEn(x, y, t, giro, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(giro);
    ctx.beginPath();
    ctx.ellipse(0, 0, t, t * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function dibujar() {
    ctx.setTransform(dpr * esc, 0, 0, dpr * esc, 0, 0);
    ctx.fillStyle = '#BFE6F2';
    ctx.fillRect(0, 0, W, H);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3B2A20';
    ctx.lineWidth = 3;

    // Nubes: se mueven más despacio que las ramas para dar sensación de altura.
    var vuelta = 5 * 190;
    nubes.forEach(function (n) {
      var y = ((n.y - camY * 0.35) % vuelta + vuelta) % vuelta - 60;
      ctx.fillStyle = '#E3F4FA';
      redondo(n.x, y, 84, 30, 15);
      ctx.fill();
      redondo(n.x + 18, y - 14, 44, 30, 15);
      ctx.fill();
    });

    ctx.save();
    ctx.translate(0, -camY);
    plats.forEach(function (p) {
      if (p.tipo === 'brote') {
        ctx.beginPath(); ctx.moveTo(p.x + p.w / 2, p.y); ctx.lineTo(p.x + p.w / 2, p.y - 18); ctx.stroke();
        hojaEn(p.x + p.w / 2 - 13, p.y - 22, 14, -0.5, '#8CCB8A');
        hojaEn(p.x + p.w / 2 + 13, p.y - 22, 14, 0.5, '#8CCB8A');
        ctx.fillStyle = '#5DB075';
      } else {
        ctx.fillStyle = '#B5825A';
      }
      redondo(p.x, p.y, p.w, 20, 10);
      ctx.fill(); ctx.stroke();
      if (p.hoja && !p.cogida) hojaEn(p.x + p.w / 2, p.y - 30 - (p.tipo === 'brote' ? 22 : 0), 13, -0.78, '#5DB075');
    });

    var img = j.vy < 0 ? imgSalto : imgQuieto;
    if (img.complete && img.naturalWidth) {
      ctx.drawImage(img, j.x, j.y, j.w, j.h);
      if (j.x < 0) ctx.drawImage(img, j.x + W, j.y, j.w, j.h);
      if (j.x + j.w > W) ctx.drawImage(img, j.x - W, j.y, j.w, j.h);
    } else {
      ctx.fillStyle = '#9FB0BF';
      redondo(j.x, j.y, j.w, j.h, 20);
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function altura() { return Math.floor(subida / 40); }

  function marcador() {
    raiz.querySelector('[data-altura]').textContent = 'Altura: ' + altura() + ' m';
    raiz.querySelector('[data-hojas]').textContent = '+' + Math.min(hojas, MAX_HOJAS);
  }

  function bucle(t) {
    raf = requestAnimationFrame(bucle);
    var dt = Math.min(0.033, (t - ultimo) / 1000 || 0);
    ultimo = t;
    if (fase === 'jugando') { paso(dt); marcador(); }
    dibujar();
  }

  function cartel(html) {
    var c = raiz.querySelector('.cartel');
    c.style.display = html ? 'flex' : 'none';
    c.innerHTML = html || '';
  }

  function empezar() {
    nuevaPartida();
    marcador();
    cartel('');
    fase = 'jugando';
  }

  function terminar() {
    fase = 'fin';
    var ganadas = Math.min(hojas, MAX_HOJAS);
    var m = altura();
    var record = m > K.estado.recordSalto;
    if (record) K.estado.recordSalto = m;
    K.sumarHojas(ganadas);
    K.subirNecesidad('diversion', 15);
    cartel('<h2 class="titulo-grande">' + (record ? '¡Nuevo récord!' : '¡Buen salto!') + '</h2>' +
      '<p>Has subido ' + m + ' metros y has recogido ' + ganadas + (ganadas === 1 ? ' hoja' : ' hojas') + '. Tu récord es ' + K.estado.recordSalto + ' m.</p>' +
      '<button class="boton" data-otra>Saltar otra vez</button><a class="boton blanco" href="#/casa">Volver con ' + K.h(K.estado.nombre) + '</a>');
    raiz.querySelector('[data-otra]').addEventListener('click', empezar);
  }

  function alPulsar(e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { teclas[e.key] = true; e.preventDefault(); } }
  function alSoltar(e) { teclas[e.key] = false; }
  function alInclinar(e) { if (typeof e.gamma === 'number') inclinacion = Math.max(-1, Math.min(1, e.gamma / 22)); }
  function alOcultar() { if (document.hidden) { toque = 0; teclas = {}; } ultimo = performance.now(); }

  function pintar(app) {
    raiz = app;
    app.innerHTML = '<section class="salto"><canvas aria-label="Juego de saltos. Mueve al koala a izquierda y derecha."></canvas>' +
      '<div class="hud"><a class="circulo" href="#/juegos" aria-label="Salir del juego">' + K.ico.atras + '</a>' +
      '<div class="pastilla" data-altura>Altura: 0 m</div>' + K.pastillaHojas('+0') + '</div>' +
      '<div class="tarjeta cartel"></div></section>';
    canvas = app.querySelector('canvas');
    ctx = canvas.getContext('2d');
    imgQuieto = imagen(K.koalaSVG({ ancho: 132, puesto: K.estado.puesto, trazo: 7 }));
    imgSalto = imagen(K.koalaSVG({ ancho: 132, puesto: K.estado.puesto, trazo: 7, salto: true }));
    toque = 0; teclas = {}; inclinacion = 0;
    medir();
    nuevaPartida();
    fase = 'espera';
    cartel('<h2 class="titulo-grande">Koala saltarín</h2>' +
      '<p>Toca a la izquierda o a la derecha de la pantalla para moverte, o inclina el móvil. Los brotes verdes te lanzan más alto.</p>' +
      '<button class="boton" data-empezar>¡A saltar!</button>');
    app.querySelector('[data-empezar]').addEventListener('click', empezar);

    canvas.addEventListener('pointerdown', function (e) {
      var r = canvas.getBoundingClientRect();
      toque = (e.clientX - r.left) < r.width / 2 ? -1 : 1;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) {
      canvas.addEventListener(n, function () { toque = 0; });
    });
    window.addEventListener('keydown', alPulsar);
    window.addEventListener('keyup', alSoltar);
    window.addEventListener('deviceorientation', alInclinar);
    window.addEventListener('resize', medir);
    document.addEventListener('visibilitychange', alOcultar);
    ultimo = performance.now();
    raf = requestAnimationFrame(bucle);
  }

  function salir() {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', alPulsar);
    window.removeEventListener('keyup', alSoltar);
    window.removeEventListener('deviceorientation', alInclinar);
    window.removeEventListener('resize', medir);
    document.removeEventListener('visibilitychange', alOcultar);
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.salto = { pintar: pintar, salir: salir };
})();
