// Sonidos (hechos con el propio móvil, sin archivos), confeti y números que flotan.
(function () {
  var ac = null;

  function audio() {
    if (K.estado.mudo) return null;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { return null; }
    return ac;
  }

  // Una nota: frecuencia inicial y final, duración, forma de onda, volumen y retraso.
  function nota(f1, f2, dur, tipo, vol, retraso) {
    var a = audio();
    if (!a) return;
    var t = a.currentTime + (retraso || 0);
    var o = a.createOscillator(), g = a.createGain();
    o.type = tipo || 'sine';
    o.frequency.setValueAtTime(f1, t);
    if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  var SONIDOS = {
    toque: function () { nota(660, 520, 0.07, 'triangle', 0.08); },
    pop: function () { nota(500, 900, 0.09, 'sine', 0.16); },
    hoja: function () { nota(880, 880, 0.08, 'square', 0.05); nota(1320, 1320, 0.14, 'square', 0.05, 0.07); },
    bien: function () { [523, 659, 784].forEach(function (f, i) { nota(f, f, 0.16, 'triangle', 0.16, i * 0.08); }); },
    mal: function () { nota(220, 150, 0.25, 'sawtooth', 0.07); },
    fanfarria: function () {
      [523, 659, 784, 1047].forEach(function (f, i) { nota(f, f, 0.18, 'square', 0.06, i * 0.11); });
      nota(1047, 1047, 0.5, 'triangle', 0.14, 0.44);
    },
    risa: function () { [700, 820, 700, 860].forEach(function (f, i) { nota(f, f * 1.2, 0.08, 'sine', 0.13, i * 0.09); }); },
    nam: function () { nota(300, 200, 0.09, 'square', 0.08); nota(320, 210, 0.09, 'square', 0.08, 0.14); },
    dormir: function () { nota(400, 200, 0.6, 'sine', 0.12); },
    agua: function () { for (var i = 0; i < 4; i++) nota(600 + Math.random() * 500, 1400, 0.06, 'sine', 0.1, i * 0.07); },
    bip: function () { nota(600, 600, 0.12, 'square', 0.07); },
    ya: function () { nota(900, 900, 0.3, 'square', 0.08); },
    regalo: function () { for (var i = 0; i < 8; i++) nota(500 + i * 90, 500 + i * 90, 0.08, 'triangle', 0.12, i * 0.05); }
  };

  K.son = function (tipo) { try { if (SONIDOS[tipo]) SONIDOS[tipo](); } catch (e) { /* sin sonido */ } };

  // Confeti por toda la pantalla
  var COLORES = ['#FFC53D', '#5DB075', '#F2664B', '#7CC4D9', '#F7A8B8', '#B9C6F2'];
  K.confeti = function (n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var capa = document.createElement('div');
    capa.className = 'confeti';
    for (var i = 0; i < (n || 60); i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = K.elige(COLORES);
      p.style.animationDelay = Math.random() * 0.5 + 's';
      p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
      p.style.setProperty('--giro', (Math.random() * 1440 - 720) + 'deg');
      p.style.setProperty('--lado', (Math.random() * 120 - 60) + 'px');
      if (Math.random() < 0.4) p.style.borderRadius = '50%';
      capa.appendChild(p);
    }
    document.body.appendChild(capa);
    setTimeout(function () { capa.remove(); }, 3500);
  };

  // Texto o dibujo que sube y se desvanece desde un punto de la pantalla.
  K.flotar = function (html, x, y, clase) {
    var e = document.createElement('div');
    e.className = 'flota' + (clase ? ' ' + clase : '');
    e.innerHTML = html;
    e.style.left = x + 'px';
    e.style.top = y + 'px';
    e.style.setProperty('--lado', (Math.random() * 60 - 30) + 'px');
    document.body.appendChild(e);
    setTimeout(function () { e.remove(); }, 1400);
  };

  // Lluvia de iconos desde un elemento (corazones, hojas, zetas...).
  K.chorro = function (el, html, n) {
    var c = el.getBoundingClientRect();
    for (var i = 0; i < (n || 5); i++) {
      (function (i) {
        setTimeout(function () {
          K.flotar(html, c.left + c.width * (0.3 + Math.random() * 0.4), c.top + c.height * (0.2 + Math.random() * 0.3));
        }, i * 110);
      })(i);
    }
  };

  // Al ganar hojas o estrellas, en cualquier parte del juego, suena y se celebra.
  var sumarHojas = K.sumarHojas, sumarEstrellas = K.sumarEstrellas;
  K.sumarHojas = function (n) {
    sumarHojas(n);
    document.querySelectorAll('[data-hojas]').forEach(function (e) { e.textContent = Math.floor(K.estado.hojas); });
    if (n > 0) {
      K.son('hoja');
      var p = document.querySelector('[data-hojas]');
      if (p) {
        var c = p.getBoundingClientRect();
        K.flotar('+' + n + ' ' + K.ico.hoja(18), c.left, c.bottom, 'premio');
        p.parentNode.classList.remove('late'); void p.offsetWidth; p.parentNode.classList.add('late');
      }
    }
  };
  K.sumarEstrellas = function (n) {
    var crece = sumarEstrellas(n);
    if (n > 0) { setTimeout(function () { K.son('fanfarria'); }, 250); K.confeti(crece ? 140 : 50); }
    return crece;
  };

  // Clic suave en cualquier botón
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.boton, .circulo, .juego, .mini, a')) K.son('toque');
  }, true);
})();
